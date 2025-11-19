import express from 'express';
import Link from '../models/Link.js';
import { nanoid } from 'nanoid';
import validator from 'validator';
const router = express.Router();
// Generate random short code
const generateShortCode = () => {
  return nanoid(6);
};

// GET /api/links - Get all links
router.get('/', async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    res.json(links);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});

// GET /api/links/:code - Get link stats
router.get('/:code', async (req, res) => {
  try {
    const link = await Link.findOne({ shortCode: req.params.code });
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch link' });
  }
});

// POST /api/links - Create new short link
router.post('/', async (req, res) => {
  try {
    const { originalUrl, customCode } = req.body;

    // Validate URL
    if (!validator.isURL(originalUrl, { require_protocol: true, require_valid_protocol: true })) {
      return res.status(400).json({ error: 'Invalid URL format. Include http:// or https://' });
    }

    let shortCode;
    
    if (customCode) {
      // Validate custom code format
      if (!/^[A-Za-z0-9]{6,8}$/.test(customCode)) {
        return res.status(400).json({ 
          error: 'Custom code must be 6-8 alphanumeric characters' 
        });
      }
      
      // Check if custom code already exists
      const existingLink = await Link.findOne({ shortCode: customCode });
      if (existingLink) {
        return res.status(409).json({ error: 'Custom code already exists' });
      }
      shortCode = customCode;
    } else {
      // Generate unique short code
      let isUnique = false;
      let attempts = 0;
      while (!isUnique && attempts < 5) {
        shortCode = generateShortCode();
        const existingLink = await Link.findOne({ shortCode });
        if (!existingLink) {
          isUnique = true;
        }
        attempts++;
      }
      
      if (!isUnique) {
        return res.status(500).json({ error: 'Failed to generate unique short code' });
      }
    }

    const link = new Link({
      shortCode,
      originalUrl
    });

    await link.save();
    res.status(201).json(link);
  } catch (error) {
    if (error.code === 11000) {
      res.status(409).json({ error: 'Short code already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create link' });
    }
  }
});

// DELETE /api/links/:code - Delete a link
router.delete('/:code', async (req, res) => {
  try {
    const link = await Link.findOneAndDelete({ shortCode: req.params.code });
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete link' });
  }
});

export default router;