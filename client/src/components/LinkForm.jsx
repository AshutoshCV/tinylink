import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const LinkForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    originalUrl: '',
    customCode: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate URL
    if (!formData.originalUrl) {
      newErrors.originalUrl = 'URL is required';
    } else if (!formData.originalUrl.startsWith('http://') && !formData.originalUrl.startsWith('https://')) {
      newErrors.originalUrl = 'URL must include http:// or https://';
    }

    // Validate custom code if provided
    if (formData.customCode && !/^[A-Za-z0-9]{6,8}$/.test(formData.customCode)) {
      newErrors.customCode = 'Custom code must be 6-8 alphanumeric characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
      setFormData({ originalUrl: '', customCode: '' });
      setErrors({});
    } catch (error) {
      // Error handling is done in parent component
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Create Short Link</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700 mb-2">
            Long URL *
          </label>
          <input
            type="url"
            id="originalUrl"
            name="originalUrl"
            value={formData.originalUrl}
            onChange={handleChange}
            placeholder="https://example.com/very-long-url"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.originalUrl ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.originalUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.originalUrl}</p>
          )}
        </div>

        <div>
          <label htmlFor="customCode" className="block text-sm font-medium text-gray-700 mb-2">
            Custom Code (Optional)
          </label>
          <input
            type="text"
            id="customCode"
            name="customCode"
            value={formData.customCode}
            onChange={handleChange}
            placeholder="my-link"
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.customCode ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.customCode && (
            <p className="mt-1 text-sm text-red-600">{errors.customCode}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            6-8 alphanumeric characters. Leave empty for auto-generation.
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isLoading ? 'Creating...' : 'Create Short Link'}
        </button>
      </form>
    </div>
  );
};

export default LinkForm;