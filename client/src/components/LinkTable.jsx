import React, { useState } from 'react';
import { Copy, Trash2, ExternalLink, BarChart3, Search } from 'lucide-react';
import './linktable.css';

const LinkTable = ({ links, onDelete, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  const filteredLinks = links.filter(link =>
    link.shortCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(text);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getShortUrl = (shortCode) => {
    return `${import.meta.env.VITE_BACKEND_URL}/${shortCode}`;
  };

  if (isLoading) {
    return (
      <div className="linktable-wrapper" style={{ padding: '24px' }}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="linktable-wrapper">
      <div className="linktable-header">
        <div className="linktable-header-top">
          <h2 className="linktable-title">Your Links</h2>

          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by code or URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredLinks.length === 0 ? (
        <div className="empty-state">
          {links.length === 0 ? 'No links created yet.' : 'No links match your search.'}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="linktable">
            <thead>
              <tr>
                <th>Short Code</th>
                <th>Target URL</th>
                <th>Clicks</th>
                <th>Last Clicked</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredLinks.map((link) => (
                <tr key={link._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="shortcode-badge">{link.shortCode}</span>

                      <button
                        onClick={() => copyToClipboard(getShortUrl(link.shortCode))}
                        className="icon-btn"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {copiedCode === getShortUrl(link.shortCode) && (
                        <span className="copied-text">Copied!</span>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className="url-truncate" title={link.originalUrl}>
                      {link.originalUrl}
                    </div>
                  </td>

                  <td>
                    <span className="clicks-badge">{link.clicks}</span>
                  </td>

                  <td className="last-clicked">
                    {formatDate(link.lastClicked)}
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <a
                        href={getShortUrl(link.shortCode)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-btn action-btn-blue"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      <a
                        href={`/code/${link.shortCode}`}
                        className="action-btn action-btn-green"
                      >
                        <BarChart3 className="w-4 h-4" />
                      </a>

                      <button
                        onClick={() => onDelete(link.shortCode)}
                        className="action-btn action-btn-red"
                        disabled={isLoading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default LinkTable;