'use client';

import { useEffect, useState } from 'react';
import AdminShell from '../_components/AdminShell';

interface OrderItem {
  productName: string;
  quantity: number;
  sellingPrice: number;
  subtotal: number;
}

interface Order {
  id: number;
  uuid: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  totalAmount: number;
  currency: string;
  status: string;
  paymentMethod?: string;
  couponCode?: string | null;
  discountAmount?: number;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'ad-badge-yellow',
  processing: 'ad-badge-blue',
  shipped: 'ad-badge-green',
  delivered: 'ad-badge-green',
  cancelled: 'ad-badge-red',
};

const STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function fmt(n: number) {
  return '₵' + Number(n).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const LIMIT = 20;

  async function load(p = 1, status = statusFilter, q = search, from = dateFrom, to = dateTo) {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
    if (status !== 'all') params.set('status', status);
    if (q.trim()) params.set('search', q.trim());
    if (from) params.set('dateFrom', from);
    if (to) params.set('dateTo', to);
    const res = await fetch(`/api/orders?${params}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }

  useEffect(() => { load(1); }, []);

  const totalPages = Math.ceil(total / LIMIT);

  const fulfillmentLabel =
    selected?.notes?.startsWith('FULFILLMENT: Pick-up in store')
      ? 'Pick-up in store'
      : selected?.notes?.startsWith('FULFILLMENT: Delivery')
      ? 'Delivery'
      : null;

  return (
    <AdminShell title="Orders">
      {/* Search + date filter toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="ad-search-wrap" style={{ flex: '1 1 220px', minWidth: 180 }}>
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className="ad-search"
            placeholder="Search order #, name, email, phone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setPage(1); load(1, statusFilter, search, dateFrom, dateTo); } }}
          />
        </div>
        <input
          type="date"
          className="ad-search"
          style={{ width: 150 }}
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          title="From date"
        />
        <input
          type="date"
          className="ad-search"
          style={{ width: 150 }}
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
          title="To date"
        />
        <button
          className="ad-btn ad-btn-primary ad-btn-sm"
          onClick={() => { setPage(1); load(1, statusFilter, search, dateFrom, dateTo); }}
        >
          Search
        </button>
        {(search || dateFrom || dateTo) && (
          <button
            className="ad-btn ad-btn-secondary ad-btn-sm"
            onClick={() => {
              setSearch(''); setDateFrom(''); setDateTo(''); setPage(1);
              load(1, statusFilter, '', '', '');
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {STATUSES.map(s => (
          <button
            key={s}
            className={`ad-btn ${statusFilter === s ? 'ad-btn-primary' : 'ad-btn-secondary'} ad-btn-sm`}
            onClick={() => { setStatusFilter(s); setPage(1); load(1, s, search, dateFrom, dateTo); }}
            style={{ textTransform: 'capitalize' }}
          >
            {s === 'all' ? 'All Orders' : s}
          </button>
        ))}
      </div>

      <div className="ad-card">
        <div className="ad-card-header">
          <span className="ad-card-title">{total} order{total !== 1 ? 's' : ''}</span>
        </div>
        <div className="ad-table-wrap">
          {loading ? (
            <div className="ad-spinner" />
          ) : orders.length === 0 ? (
            <div className="ad-empty">
              <p>No orders {statusFilter !== 'all' ? `with status "${statusFilter}"` : search || dateFrom || dateTo ? 'matching your search' : 'yet'}</p>
            </div>
          ) : (
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>View</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td><strong>{o.uuid.slice(0, 8).toUpperCase()}</strong></td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{o.customerName ?? '—'}</div>
                      <div style={{ fontSize: 12, color: 'var(--ad-text-muted)' }}>{o.customerEmail}</div>
                      <div style={{ fontSize: 12, color: 'var(--ad-text-muted)' }}>{o.customerPhone}</div>
                    </td>
                    <td>{o.items?.length ?? 0} item{(o.items?.length ?? 0) !== 1 ? 's' : ''}</td>
                    <td><strong>{fmt(o.totalAmount)}</strong></td>
                    <td style={{ fontSize: 12, textTransform: 'capitalize' }}>{o.paymentMethod?.replace(/_/g, ' ') ?? '—'}</td>
                    <td>
                      <span className={`ad-badge ${STATUS_COLORS[o.status] ?? 'ad-badge-gray'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>{new Date(o.createdAt).toLocaleDateString('en-GH')}</td>
                    <td>
                      <button className="ad-btn ad-btn-secondary ad-btn-sm" onClick={() => setSelected(o)}>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="ad-pagination">
            <button className="ad-page-btn" disabled={page <= 1} onClick={() => { setPage(page - 1); load(page - 1); }}>← Prev</button>
            <span style={{ fontSize: 13 }}>Page {page} / {totalPages}</span>
            <button className="ad-page-btn" disabled={page >= totalPages} onClick={() => { setPage(page + 1); load(page + 1); }}>Next →</button>
          </div>
        )}
      </div>

      {/* Order Detail Panel */}
      {selected && (
        <div
          className="ad-modal-overlay"
          style={{ alignItems: 'stretch', justifyContent: 'flex-end', padding: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelected(null);
              setStatusError(null);
              setUpdatingStatus(null);
            }
          }}
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
              <h2 className="ad-modal-title">Order #{selected.uuid.slice(0, 8).toUpperCase()}</h2>
              <button className="ad-modal-close" onClick={() => { setSelected(null); setStatusError(null); setUpdatingStatus(null); }}>
                <span style={{ fontSize: 18, lineHeight: 1 }}>✕</span>
              </button>
            </div>

            <div className="ad-modal-body" style={{ maxHeight: 'calc(100vh - 72px)', overflowY: 'auto' }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: 'var(--ad-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700 }}>
                  Customer
                </div>
                <div style={{ fontWeight: 600, color: 'var(--ad-text)' }}>{selected.customerName ?? '—'}</div>
                <div style={{ fontSize: 13, color: 'var(--ad-text-sub)' }}>{selected.customerEmail ?? '—'}</div>
                <div style={{ fontSize: 13, color: 'var(--ad-text-sub)' }}>{selected.customerPhone ?? '—'}</div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: 'var(--ad-text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700 }}>
                  Order info
                </div>
                <div style={{ fontSize: 13, color: 'var(--ad-text-sub)', lineHeight: 1.7 }}>
                  {fulfillmentLabel && (
                    <div><strong style={{ color: 'var(--ad-text)' }}>Fulfillment:</strong> {fulfillmentLabel}</div>
                  )}
                  {selected.paymentMethod && (
                    <div><strong style={{ color: 'var(--ad-text)' }}>Payment:</strong> {selected.paymentMethod}</div>
                  )}
                  {selected.couponCode && (
                    <div>
                      <strong style={{ color: 'var(--ad-text)' }}>Coupon:</strong> {selected.couponCode}
                      {typeof selected.discountAmount === 'number' && selected.discountAmount > 0 && (
                        <> (−{fmt(selected.discountAmount)})</>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, color: 'var(--ad-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700 }}>
                  Items
                </div>
                {selected.items?.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--ad-border)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ad-text)' }}>{item.productName}</div>
                      <div style={{ fontSize: 12, color: 'var(--ad-text-sub)' }}>Qty: {item.quantity} × {fmt(item.sellingPrice)}</div>
                    </div>
                    <div style={{ fontWeight: 800, color: 'var(--ad-text)' }}>{fmt(item.subtotal)}</div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, fontWeight: 800, fontSize: 16 }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--ad-accent)' }}>{fmt(selected.totalAmount)}</span>
                </div>
              </div>

              {selected.notes && (
                <div style={{ marginBottom: 20, padding: 12, background: 'var(--ad-card-bg)', border: '1px solid var(--ad-border)', borderRadius: 10, fontSize: 13, color: 'var(--ad-text-sub)' }}>
                  <strong style={{ color: 'var(--ad-text)' }}>Notes:</strong> {selected.notes}
                </div>
              )}

              {/* Update Status */}
              <div>
                <div style={{ fontSize: 12, color: 'var(--ad-text-muted)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.08em', fontWeight: 700 }}>
                  Update Status
                </div>
                {statusError && (
                  <div style={{ marginBottom: 12, padding: 10, borderRadius: 10, background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.25)', color: 'var(--ad-text)' }}>
                    {statusError}
                  </div>
                )}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                    <button
                      key={s}
                      disabled={selected.status === s || Boolean(updatingStatus)}
                      className={`ad-btn ad-btn-sm ${selected.status === s ? 'ad-btn-primary' : 'ad-btn-secondary'}`}
                      style={{ textTransform: 'capitalize', opacity: updatingStatus && updatingStatus !== s ? 0.65 : 1 }}
                      onClick={async () => {
                        setStatusError(null);
                        setUpdatingStatus(s);
                        try {
                          const res = await fetch(`/api/orders/${selected.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: s }),
                          });
                          if (!res.ok) {
                            const j = await res.json().catch(() => ({}));
                            throw new Error(j.error ?? `Failed to update status (${res.status})`);
                          }
                          const updated: Order = await res.json();
                          setSelected(updated);
                          setOrders(prev => prev.map(o => o.id === updated.id ? { ...o, status: updated.status } : o));
                        } catch (err) {
                          setStatusError(err instanceof Error ? err.message : 'Failed to update status.');
                        } finally {
                          setUpdatingStatus(null);
                        }
                      }}
                    >
                      {updatingStatus === s ? 'Updating…' : s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
