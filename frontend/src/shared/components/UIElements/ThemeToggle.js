import React from 'react';
import './ThemeToggle.css';

const ThemeToggle = ({ theme, toggleTheme }) => (
  <button
    type="button"
    className={`theme-toggle-btn theme-toggle-btn--corner ${theme}`}
    aria-label="Toggle light/dark mode"
    onClick={toggleTheme}
    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  >
    <span className="theme-toggle-icon">
      {theme === 'dark' ? (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="5.5" stroke="#fbbf24" strokeWidth="2"/>
          <g stroke="#fbbf24" strokeWidth="2">
            <line x1="12" y1="2" x2="12" y2="4"/>
            <line x1="12" y1="20" x2="12" y2="22"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="2" y1="12" x2="4" y2="12"/>
            <line x1="20" y1="12" x2="22" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </g>
        </svg>
      ) : (
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <path
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
            stroke="#2563eb"
            strokeWidth="2"
            fill="#111827"
          />
        </svg>
      )}
    </span>
  </button>
);

export default ThemeToggle;
