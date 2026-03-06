'use client';

import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

interface TopbarProps {
  title: string;
  actions?: React.ReactNode;
}

export default function Topbar({ title, actions }: TopbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="ad-topbar">
      <h1 className="ad-topbar-title">{title}</h1>
      <div className="ad-topbar-actions">
        {/* Theme Toggle */}
        <button
          className="ad-btn ad-btn-ghost ad-btn-sm"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          style={{ display: 'flex', alignItems: 'center', gap: 6 }}
        >
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>
        
        {/* Settings */}
        <Link href="/admin/settings/user" className="ad-btn ad-btn-ghost ad-btn-sm" title="Settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m2.98 2.98l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m-2.98-2.98l4.24-4.24M19.78 19.78l-4.24-4.24m-2.98-2.98l-4.24-4.24"/></svg>
        </Link>
        
        {actions}
      </div>
    </header>
  );
}
