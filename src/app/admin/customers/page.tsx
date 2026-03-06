'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminShell from '../_components/AdminShell';

interface Customer {
  id: number;
  uuid: string;
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
}

interface ApiResponse {
  data: Customer[];
  total: number;
  totalPages: number;
  page: number;
}

interface OrderItem { productName: string; quantity: number; subtotal: number; }
interface Order {
  id: number;
  uuid: string;
  status: string;
  totalAmount: number;
  currency: string;
  couponCode: string | null;
  discountAmount: number;
  createdAt: string;
  items: OrderItem[];
}

interface CustomerDetail extends Customer {
  address: string | null;
  orders: Order[];
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'ad-badge-yellow',
  processing: 'ad-badge-blue',
  shipped: 'ad-badge-indigo',
  delivered: 'ad-badge-green',
  cancelled: 'ad-badge-red',
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CustomerDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: String(page), limit: '20', ...(search && { search }) });
      const res = await fetch(`/api/customers?${qs}`);
      const json: ApiResponse = await res.json();
      setCustomers(json.data ?? []);
      setTotal(json.total ?? 0);
      setTotalPages(json.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const t = setTimeout(() => setPage(1), 350);
    return () => clearTimeout(t);
  }, [search]);

  async function openCustomer(id: number) {
    setLoadingDetail(true);
    const res = await fetch(`/api/customers/${id}`);
    const json = await res.json();
    setSelected(json);
    setLoadingDetail(false);
  }

  return (
    <AdminShell title="Customers">
      <div className="ad-card">
        <div className="ad-card-header">
          <div className="ad-toolbar" style={{ margin: 0, flex: 1 }}>
            <div className="ad-search-wrap">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                className="ad-search" placeholder="Search by name, email or phone…"
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="ad-loading-center"><div className="ad-spinner" /></div>
        ) : customers.length === 0 ? (
          <div className="ad-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <p>{search ? 'No customers match your search.' : 'No customers yet.'}</p>
          </div>
        ) : (
          <>
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Orders</th>
                    <th>Total Spent</th>
                    <th>Joined</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => openCustomer(c.id)}>
                      <td><strong>{c.name}</strong></td>
                      <td style={{ color: 'var(--ad-text-muted)' }}>{c.email}</td>
                      <td>{c.phone ?? <span style={{ color: 'var(--ad-text-muted)' }}>—</span>}</td>
                      <td>{c.city ?? <span style={{ color: 'var(--ad-text-muted)' }}>—</span>}</td>
                      <td>
                        <span className="ad-badge ad-badge-indigo">{c.totalOrders}</span>
                      </td>
                      <td><strong>GHS {c.totalSpent.toFixed(2)}</strong></td>
                      <td style={{ color: 'var(--ad-text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td onClick={e => e.stopPropagation()}>
                        <button className="ad-btn ad-btn-ghost ad-btn-sm" onClick={() => openCustomer(c.id)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          View
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

      {/* ── Customer Detail Modal ─────────────────── */}
      {(selected || loadingDetail) && (
        <div className="ad-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
          <div className="ad-modal" style={{ maxWidth: 680 }}>
            <div className="ad-modal-header">
              <h2 className="ad-modal-title">{selected?.name ?? 'Loading…'}</h2>
              <button className="ad-modal-close" onClick={() => setSelected(null)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {loadingDetail ? (
              <div className="ad-loading-center" style={{ padding: 40 }}><div className="ad-spinner" /></div>
            ) : selected && (
              <div className="ad-modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
                {/* Info row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                  {[
                    ['Email', selected.email],
                    ['Phone', selected.phone ?? '—'],
                    ['City', selected.city ?? '—'],
                    ['Address', selected.address ?? '—'],
                    ['Total Orders', String(selected.orders.length)],
                    ['Total Spent', `GHS ${selected.totalSpent.toFixed(2)}`],
                  ].map(([label, value]) => (
                    <div key={label} style={{
                      background: 'var(--ad-card-bg)', border: '1px solid var(--ad-border)',
                      borderRadius: 8, padding: '10px 14px',
                    }}>
                      <div style={{ fontSize: 11, color: 'var(--ad-text-muted)', marginBottom: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
                      <div style={{ fontSize: 14, color: 'var(--ad-text)', fontWeight: 500 }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Orders */}
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ad-text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>
                  Order History ({selected.orders.length})
                </div>
                {selected.orders.length === 0 ? (
                  <div className="ad-empty" style={{ padding: 24 }}>
                    <p>No orders yet.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {selected.orders.map(order => (
                      <div key={order.id} style={{
                        background: 'var(--ad-card-bg)', border: '1px solid var(--ad-border)',
                        borderRadius: 10, overflow: 'hidden',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderBottom: '1px solid var(--ad-border)', background: 'var(--ad-card-glass)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ad-text)', fontFamily: 'monospace' }}>#{order.id}</span>
                            <span className={`ad-badge ${STATUS_BADGE[order.status] ?? 'ad-badge-gray'}`}>{order.status}</span>
                            {order.couponCode && <span className="ad-badge ad-badge-indigo">{order.couponCode}</span>}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ad-text)' }}>GHS {order.totalAmount.toFixed(2)}</div>
                            <div style={{ fontSize: 11, color: 'var(--ad-text-muted)' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div style={{ padding: '8px 14px' }}>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: idx < order.items.length - 1 ? '1px solid var(--ad-border)' : 'none' }}>
                              <span style={{ fontSize: 13, color: 'var(--ad-text-sub)' }}>{item.productName} <span style={{ color: 'var(--ad-text-muted)' }}>× {item.quantity}</span></span>
                              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ad-text)' }}>GHS {item.subtotal.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
