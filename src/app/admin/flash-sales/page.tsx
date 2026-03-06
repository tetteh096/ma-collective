'use client';

import { useEffect, useState } from 'react';
import AdminShell from '../_components/AdminShell';

interface FlashSale {
  id: number;
  title: string;
  description?: string;
  discountPercent: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export default function FlashSalesPage() {
  const [sales, setSales] = useState<FlashSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountPercent: 10,
    startTime: '',
    endTime: '',
  });

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch('/api/flash-sales');
      const data = await res.json();
      setSales(data.sales || []);
    } catch (err) {
      console.error('Failed to fetch sales:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/flash-sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({
          title: '',
          description: '',
          discountPercent: 10,
          startTime: '',
          endTime: '',
        });
        setShowForm(false);
        fetchSales();
      }
    } catch (err) {
      console.error('Failed to create sale:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this flash sale?')) {
      try {
        await fetch(`/api/flash-sales/${id}`, { method: 'DELETE' });
        fetchSales();
      } catch (err) {
        console.error('Failed to delete sale:', err);
      }
    }
  };

  if (loading) {
    return (
      <AdminShell title="Flash Sales">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title="Flash Sales"
      actions={
        <button
          onClick={() => setShowForm(!showForm)}
          className="ad-btn ad-btn-primary"
        >
          {showForm ? 'Cancel' : 'Add Flash Sale'}
        </button>
      }
    >
      {showForm && (
        <div className="ad-card" style={{ marginBottom: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <label className="ad-label">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="ad-input"
                placeholder="e.g., Spring Sale - Up to 50% Off"
              />
            </div>
            <div>
              <label className="ad-label">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="ad-input"
                placeholder="Optional description"
                style={{ minHeight: '80px' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="ad-label">Discount %</label>
                <input
                  type="number"
                  value={formData.discountPercent}
                  onChange={(e) =>
                    setFormData({ ...formData, discountPercent: parseInt(e.target.value) })
                  }
                  min="1"
                  max="100"
                  required
                  className="ad-input"
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="ad-label">Start Time</label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                  className="ad-input"
                />
              </div>
              <div>
                <label className="ad-label">End Time</label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                  className="ad-input"
                />
              </div>
            </div>
            <button type="submit" className="ad-btn ad-btn-success">
              Create Flash Sale
            </button>
          </form>
        </div>
      )}

      {sales.length === 0 ? (
        <div className="ad-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <p style={{ marginBottom: '1rem', color: '#666' }}>No flash sales yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="ad-btn ad-btn-primary"
          >
            Create first flash sale
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {sales.map((sale) => (
            <div key={sale.id} className="ad-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>{sale.title}</h3>
                  {sale.description && (
                    <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.25rem' }}>{sale.description}</p>
                  )}
                </div>
                <span className={`ad-badge ${sale.isActive ? 'ad-badge-success' : ''}`}>
                  {sale.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem' }}>
                <div>
                  <p style={{ color: '#666' }}>Discount</p>
                  <p style={{ fontWeight: '600' }}>{sale.discountPercent}%</p>
                </div>
                <div>
                  <p style={{ color: '#666' }}>Start</p>
                  <p style={{ fontWeight: '600' }}>{new Date(sale.startTime).toLocaleDateString()}</p>
                </div>
                <div>
                  <p style={{ color: '#666' }}>End</p>
                  <p style={{ fontWeight: '600' }}>{new Date(sale.endTime).toLocaleDateString()}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleDelete(sale.id)}
                    className="ad-btn ad-btn-danger-small"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
