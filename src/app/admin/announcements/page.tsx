'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '../_components/AdminShell';

interface Announcement {
  id: number;
  uuid: string;
  message: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formMessage, setFormMessage] = useState('');
  const [formSortOrder, setFormSortOrder] = useState(0);
  const [formActive, setFormActive] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/announcements?all=1');
      const data = await res.json();
      setItems(data.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const msg = formMessage.trim();
    if (!msg) {
      setError('Message is required');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const res = await fetch(`/api/announcements/${editingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg, sortOrder: formSortOrder, isActive: formActive }),
        });
        if (!res.ok) throw new Error('Update failed');
      } else {
        const res = await fetch('/api/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: msg, sortOrder: formSortOrder, isActive: formActive }),
        });
        if (!res.ok) {
          const j = await res.json();
          throw new Error(j.error || 'Create failed');
        }
      }
      setShowForm(false);
      setEditingId(null);
      setFormMessage('');
      setFormSortOrder(items.length);
      setFormActive(true);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  function startEdit(a: Announcement) {
    setEditingId(a.id);
    setFormMessage(a.message);
    setFormSortOrder(a.sortOrder);
    setFormActive(a.isActive);
    setShowForm(true);
    setError('');
  }

  function startAdd() {
    setEditingId(null);
    setFormMessage('');
    setFormSortOrder(items.length);
    setFormActive(true);
    setShowForm(true);
    setError('');
  }

  async function toggleActive(id: number, current: boolean) {
    await fetch(`/api/announcements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    });
    load();
  }

  async function remove(id: number) {
    if (!confirm('Remove this announcement from the top bar?')) return;
    await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <AdminShell
      title="Top bar announcements"
      actions={
        <button type="button" className="ad-btn ad-btn-primary" onClick={startAdd}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Add announcement
        </button>
      }
    >
      <p style={{ color: 'var(--ad-text-muted)', marginBottom: 16, fontSize: 14 }}>
        These messages scroll in the top bar across the site. Order is by &quot;Sort order&quot; (lower numbers first).
      </p>

      {showForm && (
        <div className="ad-card" style={{ marginBottom: 24 }}>
          <div className="ad-card-header">
            <h3 style={{ margin: 0 }}>{editingId ? 'Edit announcement' : 'New announcement'}</h3>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: 24 }}>
            {error && <p style={{ color: 'var(--ad-danger)', marginBottom: 12 }}>{error}</p>}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Message</label>
              <input
                type="text"
                className="ad-input"
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                placeholder="e.g. Free delivery within Accra on orders over GH₵500"
                required
                style={{ width: '100%' }}
              />
            </div>
            <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Sort order</label>
                <input
                  type="number"
                  className="ad-input"
                  value={formSortOrder}
                  onChange={(e) => setFormSortOrder(Number(e.target.value) || 0)}
                  min={0}
                  style={{ width: 80 }}
                />
              </div>
              <label className="ad-toggle" style={{ marginTop: 24 }}>
                <input type="checkbox" checked={formActive} onChange={(e) => setFormActive(e.target.checked)} />
                <span className="ad-toggle-track" />
                <span className="ad-toggle-label">Active</span>
              </label>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="ad-btn ad-btn-primary" disabled={saving}>
                {editingId ? 'Update' : 'Create'}
              </button>
              <button type="button" className="ad-btn" onClick={() => { setShowForm(false); setEditingId(null); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="ad-card">
        {loading ? (
          <div className="ad-loading-center"><div className="ad-spinner" /></div>
        ) : items.length === 0 ? (
          <div className="ad-empty">
            <p>No announcements yet. Add one to show in the top bar.</p>
            <button type="button" className="ad-btn ad-btn-primary" onClick={startAdd}>Add announcement</button>
          </div>
        ) : (
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th style={{ width: 60 }}>Order</th>
                  <th>Message</th>
                  <th style={{ width: 100 }}>Status</th>
                  <th style={{ width: 120 }}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((a) => (
                  <tr key={a.id}>
                    <td>{a.sortOrder}</td>
                    <td>{a.message}</td>
                    <td>
                      <label className="ad-toggle">
                        <input type="checkbox" checked={a.isActive} onChange={() => toggleActive(a.id, a.isActive)} />
                        <span className="ad-toggle-track" />
                        <span className="ad-toggle-label">{a.isActive ? 'On' : 'Off'}</span>
                      </label>
                    </td>
                    <td>
                      <button type="button" className="ad-btn ad-btn-xs" onClick={() => startEdit(a)}>Edit</button>
                      <button type="button" className="ad-btn ad-btn-danger ad-btn-xs" style={{ marginLeft: 8 }} onClick={() => remove(a.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
