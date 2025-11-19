import React from 'react';
import { Link } from 'react-router-dom';
import { Link as LinkIcon } from 'lucide-react';
import './header.css';

const Header = () => {
  return (
    <header>
      <div className="header-container">
        <div className="header-flex">
          <Link to="/" className="header-logo">
            <LinkIcon />
            <span>TinyLink</span>
          </Link>

          <nav>
            <Link to="/">Dashboard</Link>
            <a 
              href="/healthz" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Health Check
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
