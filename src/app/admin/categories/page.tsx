'use client';

import { useEffect, useState } from 'react';
import AdminShell from '../_components/AdminShell';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  sortOrder: number;
  createdAt: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '', imageUrl: '', sortOrder: '0' });
  const [saving, setSaving] = useState(false);

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function load() {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data.categories ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditItem(null);
    setForm({ name: '', slug: '', description: '', imageUrl: '', sortOrder: '0' });
    setShowForm(true);
  }

  function openEdit(c: Category) {
    setEditItem(c);
    setForm({
      name: c.name, slug: c.slug,
      description: c.description ?? '',
      imageUrl: c.imageUrl ?? '',
      sortOrder: String(c.sortOrder),
    });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      sortOrder: parseInt(form.sortOrder) || 0,
      slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    };

    try {
      const method = editItem ? 'PATCH' : 'POST';
      const url = editItem ? `/api/categories/${editItem.id}` : '/api/categories';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? 'Failed');
      showToast(editItem ? 'Category updated' : 'Category created', 'success');
      setShowForm(false);
      load();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this category?')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Delete failed');
      showToast('Category deleted', 'success');
      load();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  }

  return (
    <AdminShell
      title="Categories"
      actions={
        <button className="ad-btn ad-btn-primary" onClick={openNew}>
          + Add Category
        </button>
      }
    >
      <div className="ad-card">
        <div className="ad-table-wrap">
          {loading ? (
            <div className="ad-spinner" />
          ) : categories.length === 0 ? (
            <div className="ad-empty">
              <div className="ad-empty-icon">🗂️</div>
              <p>No categories yet</p>
              <button className="ad-btn ad-btn-primary" onClick={openNew}>Add first category</button>
            </div>
          ) : (
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((c) => (
                  <tr key={c.id}>
                    <td>
                      {c.imageUrl ? (
                        <img src={c.imageUrl} alt={c.name} />
                      ) : (
                        <div style={{ width: 44, height: 44, background: 'var(--ad-card-bg)', border: '1px solid var(--ad-border)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🗂️</div>
                      )}
                    </td>
                    <td><strong>{c.name}</strong></td>
                    <td><code style={{ fontSize: 12, background: 'var(--ad-card-bg)', border: '1px solid var(--ad-border)', padding: '2px 6px', borderRadius: 4, color: 'var(--ad-text)' }}>{c.slug}</code></td>
                    <td style={{ maxWidth: 200, color: 'var(--ad-text-sub)', fontSize: 13 }}>{c.description ?? '—'}</td>
                    <td>{c.sortOrder}</td>
                    <td>
                      <button className="ad-btn ad-btn-secondary ad-btn-sm" onClick={() => openEdit(c)}>Edit</button>
                      <button className="ad-btn ad-btn-danger ad-btn-sm" onClick={() => handleDelete(c.id)} style={{ marginLeft: 8 }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Slide-in form */}
      {showForm && (
        <div
          className="ad-modal-overlay"
          style={{ alignItems: 'stretch', justifyContent: 'flex-end', padding: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false); }}
        >
          <div
            className="ad-modal"
            style={{
              maxWidth: 520,
              height: '100%',
              borderRadius: 0,
              borderLeft: '1px solid var(--ad-border)',
              borderTop: 'none',
              borderRight: 'none',
              borderBottom: 'none',
              boxShadow: '-12px 0 40px rgba(0,0,0,.45)',
              overflow: 'hidden',
              animation: 'none',
            }}
          >
            <div className="ad-modal-header" style={{ borderBottom: '1px solid var(--ad-border)' }}>
              <h2 className="ad-modal-title">{editItem ? 'Edit Category' : 'New Category'}</h2>
              <button className="ad-modal-close" onClick={() => setShowForm(false)}>
                <span style={{ fontSize: 18, lineHeight: 1 }}>✕</span>
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="ad-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16, maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}>
                <div className="ad-form-group">
                  <label className="ad-label">Name <span className="req">*</span></label>
                  <input className="ad-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="ad-form-group">
                  <label className="ad-label">Slug</label>
                  <input className="ad-input" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="auto-generated if empty" />
                </div>
                <div className="ad-form-group">
                  <label className="ad-label">Description</label>
                  <textarea className="ad-textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
                </div>
                <div className="ad-form-group">
                  <label className="ad-label">Image URL</label>
                  <input className="ad-input" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://…" />
                </div>
                <div className="ad-form-group">
                  <label className="ad-label">Sort Order</label>
                  <input className="ad-input" type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: e.target.value }))} />
                </div>
              </div>
              <div className="ad-modal-footer">
                <button type="submit" className="ad-btn ad-btn-primary" disabled={saving} style={{ flex: 1, justifyContent: 'center' }}>
                  {saving ? 'Saving…' : 'Save Category'}
                </button>
                <button type="button" className="ad-btn ad-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className={`ad-toast ad-toast-${toast.type}`}>{toast.msg}</div>}
    </AdminShell>
  );
}
