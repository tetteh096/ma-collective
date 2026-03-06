'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '../_components/AdminShell';

interface Product {
  id: number;
  name: string;
  slug: string;
  sellingPrice: number;
  costPrice: number;
  stockQty: number;
  imageUrl?: string;
  inStock: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  category?: string;
  createdAt: string;
}

function fmt(n: number) {
  return '₵' + Number(n).toFixed(2);
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const LIMIT = 20;

  async function load(p = 1, q = search) {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
    if (q) params.set('q', q);
    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts(data.items ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }

  useEffect(() => { load(1); }, []);

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function deleteProduct(slug: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/products/${slug}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('Product deleted', 'success');
      load(page);
    } else {
      showToast('Failed to delete product', 'error');
    }
  }

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <AdminShell
      title="Products"
      actions={
        <Link href="/admin/products/new" className="ad-btn ad-btn-primary">
          + Add Product
        </Link>
      }
    >
      <div className="ad-card">
        {/* Search */}
        <div className="ad-card-header">
          <div className="ad-search-bar" style={{ marginBottom: 0 }}>
            <input
              className="ad-input"
              placeholder="Search products…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { setPage(1); load(1, search); } }}
            />
            <button className="ad-btn ad-btn-secondary" onClick={() => { setPage(1); load(1, search); }}>
              Search
            </button>
            {search && (
              <button className="ad-btn ad-btn-secondary" onClick={() => { setSearch(''); setPage(1); load(1, ''); }}>
                Clear
              </button>
            )}
          </div>
          <span style={{ marginLeft: 'auto', color: '#6b7280', fontSize: 13 }}>
            {total} product{total !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="ad-table-wrap">
          {loading ? (
            <div className="ad-spinner" />
          ) : products.length === 0 ? (
            <div className="ad-empty">
              <div className="ad-empty-icon">👗</div>
              <p>No products found</p>
              <Link href="/admin/products/new" className="ad-btn ad-btn-primary">
                Add your first product
              </Link>
            </div>
          ) : (
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Sell Price</th>
                  <th>Cost</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} />
                      ) : (
                        <div style={{ width: 44, height: 44, background: '#f3f4f6', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                          👗
                        </div>
                      )}
                    </td>
                    <td>
                      <strong style={{ display: 'block' }}>{p.name}</strong>
                      <span style={{ fontSize: 12, color: '#6b7280' }}>{p.slug}</span>
                    </td>
                    <td>{p.category ?? '—'}</td>
                    <td><strong>{fmt(p.sellingPrice)}</strong></td>
                    <td style={{ color: '#6b7280' }}>{fmt(p.costPrice)}</td>
                    <td>
                      <span className={`ad-badge ${p.stockQty > 10 ? 'ad-badge-green' : p.stockQty > 0 ? 'ad-badge-yellow' : 'ad-badge-red'}`}>
                        {p.stockQty}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {p.inStock ? (
                          <span className="ad-badge ad-badge-green">In Stock</span>
                        ) : (
                          <span className="ad-badge ad-badge-gray">Out of Stock</span>
                        )}
                        {p.isFeatured && <span className="ad-badge ad-badge-indigo">Featured</span>}
                        {p.isOnSale && <span className="ad-badge ad-badge-yellow">Sale</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link href={`/admin/products/${p.slug}/edit`} className="ad-btn ad-btn-secondary ad-btn-sm">
                          Edit
                        </Link>
                        <button
                          className="ad-btn ad-btn-danger ad-btn-sm"
                          onClick={() => deleteProduct(p.slug, p.name)}
                        >
                          Del
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="ad-pagination">
            <button className="ad-page-btn" disabled={page <= 1} onClick={() => { setPage(page - 1); load(page - 1); }}>
              ← Prev
            </button>
            <span style={{ fontSize: 13 }}>Page {page} / {totalPages}</span>
            <button className="ad-page-btn" disabled={page >= totalPages} onClick={() => { setPage(page + 1); load(page + 1); }}>
              Next →
            </button>
          </div>
        )}
      </div>

      {toast && (
        <div className={`ad-toast ad-toast-${toast.type}`}>{toast.msg}</div>
      )}
    </AdminShell>
  );
}
