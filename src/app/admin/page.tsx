'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from './_components/AdminShell';

interface Overview {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
}

interface RecentOrder {
  id: number;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'ad-badge-yellow',
  processing: 'ad-badge-blue',
  shipped: 'ad-badge-green',
  delivered: 'ad-badge-green',
  cancelled: 'ad-badge-red',
};

function fmt(n: number) {
  return '₵' + Number(n).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/analytics?type=overview')
      .then(r => r.json())
      .then(setOverview)
      .catch(console.error);

    fetch('/api/orders?limit=6')
      .then(r => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .catch(console.error);

    fetch('/api/analytics?type=top-products&limit=5')
      .then(r => r.json())
      .then((d) => setTopProducts(d.products ?? []))
      .catch(console.error);
  }, []);

  const stats = overview
    ? [
        { label: 'Total Revenue',  value: fmt(overview.totalRevenue),  color: 'indigo', sub: '', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
        { label: 'Total Profit',   value: fmt(overview.totalProfit),   color: 'green',  sub: `Margin ${overview.profitMargin}%`, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg> },
        { label: 'Total Orders',   value: overview.totalOrders,        color: 'blue',   sub: `${overview.pendingOrders} pending`, icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg> },
        { label: 'Products',       value: overview.totalProducts,      color: 'orange', sub: '', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg> },
      ]
    : [];

  return (
    <AdminShell
      title="Dashboard"
      actions={
        <Link href="/admin/products/new" className="ad-btn ad-btn-primary">
          + New Product
        </Link>
      }
    >
      {/* Stats */}
      {overview ? (
        <div className="ad-stats-grid">
          {stats.map((s) => (
            <div className="ad-stat-card" key={s.label}>
              <div className={`ad-stat-icon ${s.color}`}>{s.icon}</div>
              <div>
                <div className="ad-stat-label">{s.label}</div>
                <div className="ad-stat-value">{String(s.value)}</div>
                {s.sub && <div className="ad-stat-sub">{s.sub}</div>}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="ad-spinner" />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24 }}>
        {/* Recent Orders */}
        <div className="ad-card">
          <div className="ad-card-header">
            <span className="ad-card-title">Recent Orders</span>
            <Link href="/admin/orders" className="ad-btn ad-btn-secondary ad-btn-sm">View all</Link>
          </div>
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--ad-text-muted)', padding: 32 }}>No orders yet</td></tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o.id}>
                      <td><strong>{o.orderNumber}</strong></td>
                      <td>{o.customerName}</td>
                      <td>{fmt(o.total)}</td>
                      <td>
                        <span className={`ad-badge ${STATUS_COLORS[o.status] ?? 'ad-badge-gray'}`}>
                          {o.status}
                        </span>
                      </td>
                      <td>{new Date(o.createdAt).toLocaleDateString('en-GH')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="ad-card">
          <div className="ad-card-header">
            <span className="ad-card-title">Top Products</span>
            <Link href="/admin/products" className="ad-btn ad-btn-secondary ad-btn-sm">View all</Link>
          </div>
          <div className="ad-table-wrap">
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Revenue</th>
                  <th>Sold</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--ad-text-muted)', padding: 32 }}>No sales yet</td></tr>
                ) : (
                  topProducts.map((p: any) => (
                    <tr key={p.productId}>
                      <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.name}
                      </td>
                      <td>{fmt(p.revenue)}</td>
                      <td>{p.unitsSold}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
