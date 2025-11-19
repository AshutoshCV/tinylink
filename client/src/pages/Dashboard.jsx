import React, { useState, useEffect } from 'react';
import LinkForm from '../components/LinkForm';
import LinkTable from '../components/LinkTable';
import { linkService } from '../services/api';
import './dashboard.css';

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setIsLoading(true);
      const data = await linkService.getAllLinks();
      setLinks(data);
    } catch (error) {
      showMessage('error', 'Failed to load links');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLink = async (formData) => {
    try {
      setIsSubmitting(true);
      const newLink = await linkService.createLink(formData);
      setLinks(prev => [newLink, ...prev]);
      showMessage('success', 'Short link created successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create link';
      showMessage('error', errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLink = async (shortCode) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;

    try {
      await linkService.deleteLink(shortCode);
      setLinks(prev => prev.filter(link => link.shortCode !== shortCode));
      showMessage('success', 'Link deleted successfully');
    } catch (error) {
      showMessage('error', 'Failed to delete link');
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  return (
    <div className="dashboard-container">

      {message.text && (
        <div
          className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}
        >
          {message.text}
        </div>
      )}

      <div>
        <h1 className="dashboard-title">URL Shortener</h1>
        <p className="dashboard-subtext">
          Create short, memorable links and track their performance.
        </p>
      </div>

      <LinkForm onSubmit={handleCreateLink} isLoading={isSubmitting} />
      <LinkTable 
        links={links} 
        onDelete={handleDeleteLink} 
        isLoading={isLoading}
      />
    </div>
  );
};

export default Dashboard;
