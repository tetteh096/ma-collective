'use client';

import { useState } from 'react';
import AdminShell from '@/app/admin/_components/AdminShell';

export default function OrgSettingsPage() {
  const [orgName, setOrgName] = useState('AFI Clothing');
  const [email, setEmail] = useState('admin@aficlothing.com');
  const [phone, setPhone] = useState('+233 24 123 4567');
  const [city, setCity] = useState('Accra');
  const [address, setAddress] = useState('123 Fashion Street, Accra');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // In a real app, you'd call an API to update org settings
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminShell title="Organization Settings">
      <div className="ad-card">
        <div className="ad-card-header">
          <h2 className="ad-card-title">Organization Details</h2>
        </div>
        <div className="ad-card-body">
          <form onSubmit={handleSave} className="ad-form-grid" style={{ gap: 14 }}>
            <div className="ad-form-group">
              <label className="ad-label">Organization Name</label>
              <input
                className="ad-input"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                placeholder="e.g. AFI Clothing"
              />
            </div>

            <div className="ad-form-group">
              <label className="ad-label">Email</label>
              <input
                className="ad-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="contact@organization.com"
              />
            </div>

            <div className="ad-form-group">
              <label className="ad-label">Phone</label>
              <input
                className="ad-input"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+233 24 123 4567"
              />
            </div>

            <div className="ad-form-group">
              <label className="ad-label">City</label>
              <input
                className="ad-input"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="Accra"
              />
            </div>

            <div className="ad-form-group ad-form-full">
              <label className="ad-label">Address</label>
              <input
                className="ad-input"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder="Street address"
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
                  Settings saved successfully
                </div>
              )}
              <button type="submit" className="ad-btn ad-btn-primary" disabled={saving}>
                {saving ? <><span className="ad-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving…</> : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="ad-card">
        <div className="ad-card-header">
          <h2 className="ad-card-title">Billing & Subscription</h2>
        </div>
        <div className="ad-card-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
            {[
              { label: 'Plan', value: 'Professional' },
              { label: 'Status', value: 'Active' },
              { label: 'Renewal Date', value: 'April 5, 2026' },
            ].map(item => (
              <div key={item.label} style={{
                background: 'var(--ad-card-glass)',
                border: '1px solid var(--ad-border)',
                borderRadius: 8,
                padding: '12px 14px'
              }}>
                <div style={{ fontSize: 11, color: 'var(--ad-text-muted)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 14, color: 'var(--ad-text)', fontWeight: 500 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          <button className="ad-btn ad-btn-secondary">Manage Subscription</button>
        </div>
      </div>

      <div className="ad-card">
        <div className="ad-card-header">
          <h2 className="ad-card-title">Integrations</h2>
        </div>
        <div className="ad-card-body">
          <p style={{ fontSize: 13, color: 'var(--ad-text-sub)', marginBottom: 16 }}>
            Connect third-party services to your account
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="ad-btn ad-btn-secondary">Connect Payment Gateway</button>
            <button className="ad-btn ad-btn-secondary">Connect Email Service</button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
