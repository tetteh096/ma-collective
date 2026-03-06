'use client';

import { useState } from 'react';
import AdminShell from '@/app/admin/_components/AdminShell';
import { useAuthenticate } from '@neondatabase/neon-js/auth/react';
import { authClient } from '@/lib/auth';

export default function UserSettingsPage() {
  const { data } = useAuthenticate();
  const user = (data as { user?: { name?: string; email?: string; id?: string } })?.user;
  const [name, setName] = useState(user?.name ?? '');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // In a real app, you'd call an API to update user profile
      // For now, we just show success
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // Placeholder for password change
      alert('Password change flow to be implemented');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell title="User Settings">
      <div className="ad-card">
        <div className="ad-card-header">
          <h2 className="ad-card-title">Profile</h2>
        </div>
        <div className="ad-card-body">
          <form onSubmit={handleSave} className="ad-form-grid" style={{ maxWidth: 500, gap: 14 }}>
            <div className="ad-form-group">
              <label className="ad-label">Email</label>
              <input className="ad-input" type="email" value={user?.email ?? ''} disabled />
              <div className="ad-input-hint" style={{ color: 'var(--ad-text-muted)' }}>Email cannot be changed</div>
            </div>

            <div className="ad-form-group">
              <label className="ad-label">Full Name</label>
              <input
                className="ad-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="ad-form-group ad-form-full" style={{ paddingTop: 10 }}>
              {saved && (
                <div style={{
                  background: 'rgba(16,185,129,.1)',
                  border: '1px solid rgba(16,185,129,.3)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: '#6ee7b7',
                  fontSize: 13,
                  marginBottom: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Profile updated successfully
                </div>
              )}
              <button type="submit" className="ad-btn ad-btn-primary" disabled={saving}>
                {saving ? <><span className="ad-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving…</> : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="ad-card">
        <div className="ad-card-header">
          <h2 className="ad-card-title">Security</h2>
        </div>
        <div className="ad-card-body">
          <form onSubmit={handleChangePassword} className="ad-form-grid" style={{ maxWidth: 500, gap: 14 }}>
            <div className="ad-form-group ad-form-full">
              <label className="ad-label">Password</label>
              <p style={{ fontSize: 13, color: 'var(--ad-text-sub)', margin: '0 0 12px' }}>
                Change your password to keep your account secure
              </p>
            </div>

            <div className="ad-form-group">
              <label className="ad-label">Current Password</label>
              <input className="ad-input" type="password" placeholder="••••••••" />
            </div>

            <div className="ad-form-group">
              <label className="ad-label">New Password</label>
              <input className="ad-input" type="password" placeholder="••••••••" />
            </div>

            <div className="ad-form-group ad-form-full">
              <label className="ad-label">Confirm New Password</label>
              <input className="ad-input" type="password" placeholder="••••••••" />
            </div>

            <div className="ad-form-group ad-form-full" style={{ paddingTop: 10 }}>
              <button type="submit" className="ad-btn ad-btn-secondary" disabled={saving}>
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="ad-card">
        <div className="ad-card-header">
          <h2 className="ad-card-title">Sessions</h2>
        </div>
        <div className="ad-card-body">
          <p style={{ fontSize: 13, color: 'var(--ad-text-sub)', marginBottom: 16 }}>
            Your current session will be active here. You can sign out of this device or all devices.
          </p>
          <button
            className="ad-btn ad-btn-secondary"
            onClick={async () => {
              await authClient.signOut();
              window.location.href = '/auth/sign-in';
            }}
          >
            Sign Out This Device
          </button>
        </div>
      </div>
    </AdminShell>
  );
}
