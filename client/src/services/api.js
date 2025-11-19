import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const linkService = {
  // Get all links
  getAllLinks: async () => {
    const response = await api.get('/links');
    return response.data;
  },

  // Get link statistics
  getLinkStats: async (code) => {
    const response = await api.get(`/links/${code}`);
    return response.data;
  },

  // Create new short link
  createLink: async (linkData) => {
    const response = await api.post('/links', linkData);
    return response.data;
  },

  // Delete a link
  deleteLink: async (code) => {
    const response = await api.delete(`/links/${code}`);
    return response.data;
  },
};

export const healthCheck = async () => {
  const response = await api.get('/healthz');
  return response.data;
};

export default api;