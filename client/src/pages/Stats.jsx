import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MousePointer, ExternalLink, Copy } from 'lucide-react';
import { linkService } from '../services/api';
import './stats.css';

const Stats = () => {
    const { code } = useParams();
    const [link, setLink] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetchLinkStats();
    }, [code]);

    const fetchLinkStats = async () => {
        try {
            setIsLoading(true);
            const data = await linkService.getLinkStats(code);
            setLink(data);
        } catch (error) {
            setError('Link not found');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getShortUrl = () => {
        return `${import.meta.env.VITE_BACKEND_URL}/${code}`;
        // OR: return `${window.location.origin}/${code}`;
    };

    if (isLoading) {
        return (
            <div className="stats-container">
                <div className="loading-skeleton">
                    <div className="loading-title"></div>
                    <div className="loading-box"></div>
                </div>
            </div>
        );
    }

    if (error || !link) {
        return (
            <div className="stats-container">
                <Link to="/" className="back-link">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>

                <div className="error-box">
                    <h2 className="error-title">Link Not Found</h2>
                    <p>The requested short link does not exist.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="stats-container">
            <Link to="/" className="back-link">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>

            <div className="stats-card">
                <div className="stats-header">
                    <h1 className="stats-header-title">Link Statistics</h1>

                    <div className="short-url-box">
                        <code className="short-url-code">{getShortUrl()}</code>

                        <button
                            onClick={() => copyToClipboard(getShortUrl())}
                            className="copy-btn"
                        >
                            <Copy className="w-4 h-4" />
                        </button>

                        {copied && <span className="copied-badge">Copied!</span>}
                    </div>
                </div>

                <div className="stats-body">
                    <div className="stats-grid">

                        <div className="stat-box stat-blue">
                            <MousePointer className="stat-icon text-blue" />
                            <div className="stat-value text-blue">{link.clicks}</div>
                            <div className="stat-label text-blue">Total Clicks</div>
                        </div>

                        <div className="stat-box stat-green">
                            <Calendar className="stat-icon text-green" />
                            <div className="stat-date text-green">{formatDate(link.createdAt)}</div>
                            <div className="stat-label text-green">Created</div>
                        </div>

                        <div className="stat-box stat-purple">
                            <Calendar className="stat-icon text-purple" />
                            <div className="stat-date text-purple">{formatDate(link.lastClicked)}</div>
                            <div className="stat-label text-purple">Last Clicked</div>
                        </div>

                    </div>

                    <div className="section-wrapper">
                        <div>
                            <h3 className="section-title">Original URL</h3>
                            <div className="section-box">
                                <a
                                    href={link.originalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="section-url"
                                >
                                    {link.originalUrl}
                                </a>
                                <ExternalLink className="section-icon" />
                            </div>
                        </div>

                        <div>
                            <h3 className="section-title">Short Code</h3>
                            <div className="section-box section-mono">
                                {link.shortCode}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Stats;
