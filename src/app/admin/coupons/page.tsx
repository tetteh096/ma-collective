'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '../_components/AdminShell';

interface Coupon {
  id: number;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  minOrderAmount: number | null;
  maxDiscountAmount: number | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
}

interface ApiResponse { data: Coupon[]; total: number; totalPages: number; page: number; }

const EMPTY_FORM = {
  code: '', description: '', discountType: 'percentage',
  discountValue: '', minOrderAmount: '', maxDiscountAmount: '',
  maxUses: '', expiresAt: '', isActive: true,
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: '20', ...(search && { search }) });
      const res = await fetch(`/api/coupons?${qs}`);
      const json: ApiResponse = await res.json();
      setCoupons(json.data ?? []);
      setTotal(json.total ?? 0);
      setTotalPages(json.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.discountValue) { setError('Discount value is required'); return; }
    setSaving(true);
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: form.code || undefined,
          description: form.description || undefined,
          discountType: form.discountType,
          discountValue: Number(form.discountValue),
          minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
          maxDiscountAmount: form.maxDiscountAmount ? Number(form.maxDiscountAmount) : undefined,
          maxUses: form.maxUses ? Number(form.maxUses) : undefined,
          expiresAt: form.expiresAt || undefined,
          isActive: form.isActive,
        }),
      });
      if (!res.ok) {
        const j = await res.json();
        setError(j.error ?? 'Failed to create coupon');
        return;
      }
      setShowModal(false);
      setForm(EMPTY_FORM);
      load();
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(id: number, current: boolean) {
    await fetch(`/api/coupons/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !current }),
    });
    load();
  }

  async function deleteCoupon(id: number) {
    if (!confirm('Delete this coupon?')) return;
    await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
    load();
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  }

  function formatDiscount(c: Coupon) {
    return c.discountType === 'percentage'
      ? `${c.discountValue}%`
      : `GHS ${c.discountValue.toFixed(2)}`;
  }

  return (
    <AdminShell
      title="Coupons"
      actions={
        <button className="ad-btn ad-btn-primary" onClick={() => { setShowModal(true); setError(''); setForm(EMPTY_FORM); }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Coupon
        </button>
      }
    >
      <div className="ad-card">
        <div className="ad-card-header">
          <div className="ad-toolbar" style={{ margin: 0, flex: 1 }}>
            <div className="ad-search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                className="ad-search" placeholder="Search by code or description…"
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="ad-loading-center"><div className="ad-spinner" /></div>
        ) : coupons.length === 0 ? (
          <div className="ad-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>
            <p>{search ? 'No coupons match your search.' : 'No coupons yet. Create one to get started.'}</p>
          </div>
        ) : (
          <>
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Description</th>
                    <th>Discount</th>
                    <th>Min Order</th>
                    <th>Used / Max</th>
                    <th>Expires</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map(c => (
                    <tr key={c.id}>
                      <td>
                        <span className="ad-chip" onClick={() => copyCode(c.code)} title="Click to copy">
                          {c.code}
                          {copied === c.code ? (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                          ) : (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                          )}
                        </span>
                      </td>
                      <td>{c.description ?? <span style={{ color: 'var(--ad-text-muted)' }}>—</span>}</td>
                      <td><strong>{formatDiscount(c)}</strong></td>
                      <td>{c.minOrderAmount ? `GHS ${c.minOrderAmount.toFixed(2)}` : <span style={{ color: 'var(--ad-text-muted)' }}>—</span>}</td>
                      <td>{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ''}</td>
                      <td>
                        {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString()
                          : <span style={{ color: 'var(--ad-text-muted)' }}>Never</span>}
                      </td>
                      <td>
                        <label className="ad-toggle">
                          <input type="checkbox" checked={c.isActive} onChange={() => toggleActive(c.id, c.isActive)} />
                          <span className="ad-toggle-track" />
                          <span className="ad-toggle-label">{c.isActive ? 'Active' : 'Off'}</span>
                        </label>
                      </td>
                      <td>
                        <button className="ad-btn ad-btn-danger ad-btn-xs" onClick={() => deleteCoupon(c.id)}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="ad-pagination">
                <span>{(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}</span>
                <button className="ad-page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
                <button className="ad-page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Create Modal ──────────────────────────── */}
      {showModal && (
        <div className="ad-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="ad-modal">
            <div className="ad-modal-header">
              <h2 className="ad-modal-title">New Coupon</h2>
              <button className="ad-modal-close" onClick={() => setShowModal(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="ad-modal-body">
                {error && (
                  <div style={{ background: 'rgba(239,68,68,.1)', border: '1px solid rgba(239,68,68,.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#f87171', fontSize: 13 }}>
                    {error}
                  </div>
                )}
                <div className="ad-form-grid" style={{ gap: 14 }}>
                  <div className="ad-form-group">
                    <label className="ad-label">Coupon Code</label>
                    <input className="ad-input" placeholder="Leave blank to auto-generate"
                      value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} />
                  </div>
                  <div className="ad-form-group">
                    <label className="ad-label">Discount Type</label>
                    <select className="ad-select" value={form.discountType}
                      onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))}>
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (GHS)</option>
                    </select>
                  </div>

                  <div className="ad-form-group">
                    <label className="ad-label">Discount Value *</label>
                    <input className="ad-input" type="number" min="0" step="0.01" placeholder={form.discountType === 'percentage' ? 'e.g. 10' : 'e.g. 20.00'}
                      value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))} required />
                  </div>
                  <div className="ad-form-group">
                    <label className="ad-label">Min Order Amount (GHS)</label>
                    <input className="ad-input" type="number" min="0" step="0.01" placeholder="Optional"
                      value={form.minOrderAmount} onChange={e => setForm(f => ({ ...f, minOrderAmount: e.target.value }))} />
                  </div>

                  {form.discountType === 'percentage' && (
                    <div className="ad-form-group">
                      <label className="ad-label">Max Discount Cap (GHS)</label>
                      <input className="ad-input" type="number" min="0" step="0.01" placeholder="Optional ceiling"
                        value={form.maxDiscountAmount} onChange={e => setForm(f => ({ ...f, maxDiscountAmount: e.target.value }))} />
                    </div>
                  )}
                  <div className="ad-form-group">
                    <label className="ad-label">Max Uses</label>
                    <input className="ad-input" type="number" min="1" placeholder="Unlimited"
                      value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} />
                  </div>

                  <div className="ad-form-group">
                    <label className="ad-label">Expiry Date</label>
                    <input className="ad-input" type="date"
                      value={form.expiresAt} onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))} />
                  </div>
                  <div className="ad-form-group" style={{ justifyContent: 'center' }}>
                    <label className="ad-label">Active</label>
                    <label className="ad-toggle" style={{ marginTop: 6 }}>
                      <input type="checkbox" checked={form.isActive}
                        onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                      <span className="ad-toggle-track" />
                      <span className="ad-toggle-label">{form.isActive ? 'Yes' : 'No'}</span>
                    </label>
                  </div>

                  <div className="ad-form-group ad-form-full">
                    <label className="ad-label">Description</label>
                    <input className="ad-input" placeholder="e.g. Summer sale 10% off"
                      value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="ad-modal-footer">
                <button type="button" className="ad-btn ad-btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="ad-btn ad-btn-primary" disabled={saving}>
                  {saving ? <><span className="ad-spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> Saving…</> : 'Create Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
