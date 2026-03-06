'use client';

import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import AdminShell from '../_components/AdminShell';

const PINK = '#e91e8c';
const GREEN = '#10b981';
const BLUE = '#3b82f6';
const ORANGE = '#f59e0b';
const COLORS = [PINK, GREEN, BLUE, ORANGE, '#8b5cf6', '#ef4444'];

type Period = '7d' | '30d' | '90d';

function fmt(n: number | undefined) {
  if (n == null) return '₵0.00';
  return '₵' + Number(n).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function pctFmt(n: number) { return `${Number(n).toFixed(1)}%`; }

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<Period>('30d');
  const [overview, setOverview] = useState<any>(null);
  const [sales, setSales] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [traffic, setTraffic] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/analytics?type=overview').then(r => r.json()),
      fetch(`/api/analytics?type=sales&period=${period}`).then(r => r.json()),
      fetch('/api/analytics?type=categories').then(r => r.json()),
      fetch('/api/analytics?type=top-products&limit=8').then(r => r.json()),
      fetch(`/api/analytics?type=traffic&period=${period}`).then(r => r.json()),
    ])
      .then(([ov, sl, cat, tp, tr]) => {
        setOverview(ov);
        setSales(sl.data ?? []);
        setCategories(cat.data ?? []);
        setTopProducts((tp.data ?? []).map((p: any) => ({ ...p, name: p.productName, unitsSold: p.units })));
        setTraffic((tr.data ?? []).map((t: any) => ({ source: t.productName || 'Unknown', count: t.views })));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [period]);

  const overviewCards = overview ? [
    { label: 'Total Revenue', value: fmt(overview.totalRevenue), color: PINK },
    { label: 'Total Cost',    value: fmt(overview.totalCost),    color: ORANGE },
    { label: 'Total Profit',  value: fmt(overview.totalProfit),  color: GREEN },
    { label: 'Profit Margin', value: pctFmt(overview.profitMargin), color: BLUE },
    { label: 'Orders',        value: overview.totalOrders,       color: '#8b5cf6' },
    { label: 'Pending',       value: overview.pendingOrders,     color: ORANGE },
  ] : [];

  return (
    <AdminShell
      title="Analytics"
      actions={
        <div style={{ display: 'flex', gap: 8 }}>
          {(['7d', '30d', '90d'] as Period[]).map(p => (
            <button
              key={p}
              className={`ad-btn ad-btn-sm ${period === p ? 'ad-btn-primary' : 'ad-btn-secondary'}`}
              onClick={() => setPeriod(p)}
            >
              {p === '7d' ? '7 days' : p === '30d' ? '30 days' : '90 days'}
            </button>
          ))}
        </div>
      }
    >
      {loading ? (
        <div className="ad-spinner" />
      ) : (
        <>
          {/* Overview cards */}
          <div className="ad-stats-grid" style={{ gridTemplateColumns: 'repeat(6,1fr)' }}>
            {overviewCards.map(c => (
              <div className="ad-stat-card" key={c.label}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0, marginRight: 4 }} />
                <div>
                  <div className="ad-stat-label">{c.label}</div>
                  <div className="ad-stat-value" style={{ fontSize: 18 }}>{String(c.value)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue & Profit Chart */}
          <div className="ad-card">
            <div className="ad-card-header">
              <span className="ad-card-title">Revenue vs Profit — Last {period}</span>
            </div>
            <div className="ad-card-body">
              {sales.length === 0 ? (
                <div className="ad-empty" style={{ padding: 32 }}>No sales data for this period</div>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={sales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={d => {
                      const date = new Date(d);
                      return `${date.getDate()}/${date.getMonth() + 1}`;
                    }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₵${v}`} />
                    <Tooltip formatter={fmt as any} labelFormatter={l => new Date(l).toLocaleDateString('en-GH')} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke={PINK} strokeWidth={2} dot={false} name="Revenue" />
                    <Line type="monotone" dataKey="profit" stroke={GREEN} strokeWidth={2} dot={false} name="Profit" />
                    <Line type="monotone" dataKey="cost" stroke={ORANGE} strokeWidth={1.5} dot={false} name="Cost" strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Orders chart */}
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Orders — Last {period}</span>
              </div>
              <div className="ad-card-body">
                {sales.length === 0 ? (
                  <div className="ad-empty" style={{ padding: 32 }}>No data</div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={sales}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={d => {
                        const date = new Date(d);
                        return `${date.getDate()}/${date.getMonth() + 1}`;
                      }} />
                      <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                      <Tooltip labelFormatter={l => new Date(l).toLocaleDateString('en-GH')} />
                      <Bar dataKey="orders" fill={BLUE} radius={[4, 4, 0, 0]} name="Orders" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Categories breakdown */}
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Revenue by Category</span>
              </div>
              <div className="ad-card-body">
                {categories.length === 0 ? (
                  <div className="ad-empty" style={{ padding: 32 }}>No sales data</div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <ResponsiveContainer width={180} height={180}>
                      <PieChart>
                        <Pie data={categories} dataKey="revenue" nameKey="category" cx="50%" cy="50%" outerRadius={80}>
                          {categories.map((_: any, i: number) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={fmt as any} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ flex: 1 }}>
                      {categories.map((c: any, i: number) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                          <span style={{ fontSize: 13, flex: 1 }}>{c.category ?? 'Uncategorised'}</span>
                          <strong style={{ fontSize: 13 }}>{fmt(c.revenue)}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
            {/* Top products */}
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Top Products by Revenue</span>
              </div>
              <div className="ad-card-body">
                {topProducts.length === 0 ? (
                  <div className="ad-empty" style={{ padding: 32 }}>No sales yet</div>
                ) : (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={topProducts} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={v => `₵${v}`} />
                      <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={120} />
                      <Tooltip formatter={fmt as any} />
                      <Bar dataKey="revenue" fill={PINK} radius={[0, 4, 4, 0]} name="Revenue" />
                      <Bar dataKey="profit" fill={GREEN} radius={[0, 4, 4, 0]} name="Profit" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Product views */}
            <div className="ad-card">
              <div className="ad-card-header">
                <span className="ad-card-title">Most Viewed Products</span>
              </div>
              <div className="ad-card-body">
                {traffic.length === 0 ? (
                  <div className="ad-empty" style={{ padding: 32 }}>No product views yet</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {traffic.map((t: any, i: number) => {
                      const total = traffic.reduce((sum: number, x: any) => sum + x.count, 0);
                      const pct = total > 0 ? Math.round((t.count / total) * 100) : 0;
                      return (
                        <div key={i}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                            <span style={{ fontWeight: 500 }}>
                              {t.source}
                            </span>
                            <span style={{ color: '#6b7280' }}>{t.count} views ({pct}%)</span>
                          </div>
                          <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3 }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: COLORS[i % COLORS.length], borderRadius: 3, transition: 'width .5s' }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
