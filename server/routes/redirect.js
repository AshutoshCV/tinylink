import express from 'express';
const router = express.Router();
import Link from '../models/Link.js';

// GET /:code - Redirect to original URL
router.get('/:code', async (req, res) => {
  try {
    const link = await Link.findOne({ shortCode: req.params.code });
    
    if (!link) {
      return res.status(404).json({ error: 'Short link not found' });
    }

    // Update click statistics
    link.clicks += 1;
    link.lastClicked = new Date();
    await link.save();

    // Redirect to original URL
    res.redirect(302, link.originalUrl);
  } catch (error) {
    res.status(500).json({ error: 'Redirect failed' });
  }
});

export default router;