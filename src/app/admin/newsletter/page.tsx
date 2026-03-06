'use client';

import { useEffect, useState } from 'react';
import AdminShell from '../_components/AdminShell';

interface Subscriber {
  id: number;
  uuid: string;
  email: string;
  isActive: boolean;
  createdAt: string;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/newsletter');
      const data = await res.json();
      setSubscribers(data.subscribers || []);
    } catch (err) {
      console.error('Failed to fetch subscribers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: number, isActive: boolean) => {
    try {
      await fetch(`/api/newsletter/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });
      fetchSubscribers();
    } catch (err) {
      console.error('Failed to toggle subscriber:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Remove this subscriber?')) {
      try {
        await fetch(`/api/newsletter/${id}`, { method: 'DELETE' });
        fetchSubscribers();
      } catch (err) {
        console.error('Failed to delete subscriber:', err);
      }
    }
  };

  const exportCSV = () => {
    const csv = ['Email,Status,Subscribed Date'];
    subscribers.forEach((sub) => {
      csv.push(`${sub.email},${sub.isActive ? 'Active' : 'Inactive'},${new Date(sub.createdAt).toLocaleDateString()}`);
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
  };

  if (loading) {
    return (
      <AdminShell title="Newsletter Subscribers">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
      </AdminShell>
    );
  }

  const activeCount = subscribers.filter((s) => s.isActive).length;

  return (
    <AdminShell
      title="Newsletter Subscribers"
      actions={
        <button
          onClick={exportCSV}
          className="ad-btn ad-btn-success"
        >
          Export CSV
        </button>
      }
    >
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#666', fontSize: '0.875rem' }}>
          {activeCount} active subscriber{activeCount !== 1 ? 's' : ''} out of {subscribers.length} total
        </p>
      </div>

      <div className="ad-card">
        {subscribers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <p style={{ color: '#666' }}>No newsletter subscribers yet</p>
          </div>
        ) : (
          <table style={{ width: '100%' }}>
            <thead style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>Email</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>Subscribed</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem' }}>{subscriber.email}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <button
                      onClick={() => handleToggle(subscriber.id, subscriber.isActive)}
                      className={`ad-badge ${subscriber.isActive ? 'ad-badge-success' : ''}`}
                      style={{ cursor: 'pointer' }}
                    >
                      {subscriber.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#666' }}>
                    {new Date(subscriber.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <button
                      onClick={() => handleDelete(subscriber.id)}
                      style={{ color: '#dc2626', fontSize: '0.875rem', fontWeight: '500', cursor: 'pointer', border: 'none', background: 'none' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminShell>
  );
}
