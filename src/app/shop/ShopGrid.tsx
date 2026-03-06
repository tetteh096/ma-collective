'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface Category { id: string; label: string; }

interface Props {
  initialCategory: string;
  initialPage:     number;
  query:           string;
  sort:            string;
  categories:      Category[];
}

const PRICE_RANGES = [
  { label: 'All Prices',              min: 0,   max: Infinity },
  { label: 'Under GH\u20b5300',       min: 0,   max: 300      },
  { label: 'GH\u20b5300 \u2013 GH\u20b5500', min: 300, max: 500 },
  { label: 'GH\u20b5500 \u2013 GH\u20b5800', min: 500, max: 800 },
  { label: 'Over GH\u20b5800',        min: 800, max: Infinity  },
];

const PER_PAGE = 9;

export default function ShopGrid({ initialCategory, initialPage, query, sort, categories }: Props) {
  const [category,   setCategory]   = useState(initialCategory);
  const [priceRange, setPriceRange] = useState(0);
  const [sortBy,     setSortBy]     = useState(sort || 'default');
  const [page,       setPage]       = useState(initialPage);
  const [products,   setProducts]   = useState<Product[]>([]);
  const [total,      setTotal]      = useState(0);
  const [loading,    setLoading]    = useState(true);   // true from the start
  const [error,      setError]      = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { addItem, openCart } = useCart();
  const { toggle, isInWishlist } = useWishlist();

  const fetchProducts = useCallback(async (cat: string, pg: number, q: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (cat && cat !== 'all') params.set('category', cat);
      if (q)                    params.set('q', q);
      params.set('page',  String(pg));
      params.set('limit', String(PER_PAGE));

      const res = await fetch('/api/products?' + params.toString());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setProducts(data.items ?? []);
      setTotal(data.total   ?? 0);
    } catch (err) {
      console.error('[ShopGrid] fetch failed:', err);
      setError('Could not load products. Please try again.');
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Always fetch on mount and whenever category / page / query changes
  useEffect(() => {
    fetchProducts(category, page, query);
  }, [category, page, query, fetchProducts]);

  // Client-side price filter + sort on the current page
  const displayed = useMemo(() => {
    let items = [...products];
    const range = PRICE_RANGES[priceRange];
    if (range.min > 0 || range.max !== Infinity) {
      items = items.filter((p) => p.sellingPrice >= range.min && p.sellingPrice <= range.max);
    }
    if (sortBy === 'price-asc')  items.sort((a, b) => a.sellingPrice - b.sellingPrice);
    if (sortBy === 'price-desc') items.sort((a, b) => b.sellingPrice - a.sellingPrice);
    return items;
  }, [products, priceRange, sortBy]);

  const totalPages = Math.ceil(total / PER_PAGE);

  function handleCategoryChange(id: string) {
    setCategory(id);
    setPage(1);
    setPriceRange(0);
    setFiltersOpen(false);
  }

  function handleAddToCart(p: Product) {
    addItem({ id: String(p.id), slug: p.slug, name: p.name, price: p.sellingPrice, image: p.imageUrl ?? '', quantity: 1 });
    openCart();
  }

  function handlePriceChange(i: number) {
    setPriceRange(i);
    setPage(1);
    setFiltersOpen(false);
  }

  return (
    <section style={{ padding: '40px 0 80px' }}>
      <div className="ul-container">
        <div className="row g-4">

          {/* ── Sidebar ──────────────────────────────────────── */}
          <aside className="col-lg-3 d-none d-lg-block">
            <div style={{ position: 'sticky', top: 100 }}>

              {/* Categories */}
              <div className="ul-widget mb-4" style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
                <h6 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15, textTransform: 'uppercase', letterSpacing: 1 }}>Categories</h6>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {categories.map((c) => {
                    const active = c.id === 'all' ? !category || category === 'all' : category === c.id;
                    return (
                      <li key={c.id} style={{ marginBottom: 10 }}>
                        <button
                          onClick={() => handleCategoryChange(c.id === 'all' ? '' : c.id)}
                          style={{ background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer', fontWeight: active ? 700 : 400, color: active ? '#e85d04' : '#444', fontSize: 14 }}
                        >
                          {c.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Price Range */}
              <div className="ul-widget mb-4" style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,.06)' }}>
                <h6 style={{ fontWeight: 700, marginBottom: 16, fontSize: 15, textTransform: 'uppercase', letterSpacing: 1 }}>Price Range</h6>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {PRICE_RANGES.map((r, i) => (
                    <li key={i} style={{ marginBottom: 10 }}>
                      <button
                        onClick={() => handlePriceChange(i)}
                        style={{ background: 'none', border: 'none', padding: '4px 0', cursor: 'pointer', fontWeight: priceRange === i ? 700 : 400, color: priceRange === i ? '#e85d04' : '#444', fontSize: 14 }}
                      >
                        {r.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </aside>

          {/* ── Main ─────────────────────────────────────────── */}
          <div className="col-lg-9">

            {/* Toolbar */}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
              <div className="d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="d-lg-none"
                  onClick={() => setFiltersOpen(true)}
                  style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontSize: 14,
                    background: '#fff',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 16, lineHeight: 1 }}>☰</span>
                  Filters
                </button>
              <p style={{ margin: 0, color: '#888', fontSize: 14 }}>
                {loading
                  ? 'Loading products…'
                  : error
                  ? 'Backend offline'
                  : `Showing ${displayed.length} of ${total} products`
                }
              </p>
              </div>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); }}
                style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: '8px 16px', fontSize: 14, cursor: 'pointer' }}
              >
                <option value="default">Default sorting</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {/* Mobile filters offcanvas */}
            {filtersOpen && (
              <div
                className="d-lg-none"
                style={{
                  position: 'fixed',
                  inset: 0,
                  zIndex: 9999,
                }}
                aria-hidden={!filtersOpen}
              >
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Close filters"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(0,0,0,0.45)',
                    border: 'none',
                    padding: 0,
                    margin: 0,
                    cursor: 'pointer',
                  }}
                />
                <div
                  role="dialog"
                  aria-modal="true"
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    height: '100%',
                    width: '86%',
                    maxWidth: 360,
                    background: '#fff',
                    boxShadow: '0 12px 40px rgba(0,0,0,.2)',
                    padding: 18,
                    overflowY: 'auto',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <strong style={{ fontSize: 16 }}>Filters</strong>
                    <button
                      type="button"
                      onClick={() => setFiltersOpen(false)}
                      style={{ border: 'none', background: 'transparent', fontSize: 22, lineHeight: 1, cursor: 'pointer' }}
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>

                  <div style={{ borderTop: '1px solid #eee', paddingTop: 14 }}>
                    <h6 style={{ fontWeight: 700, marginBottom: 12, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Categories</h6>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {categories.map((c) => {
                        const active = c.id === 'all' ? !category || category === 'all' : category === c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleCategoryChange(c.id === 'all' ? '' : c.id)}
                            style={{
                              textAlign: 'left',
                              border: '1px solid ' + (active ? '#e85d04' : '#e0e0e0'),
                              background: active ? '#fef3ec' : '#fff',
                              color: active ? '#e85d04' : '#333',
                              padding: '10px 12px',
                              borderRadius: 10,
                              fontWeight: active ? 700 : 500,
                              cursor: 'pointer',
                            }}
                          >
                            {c.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid #eee', paddingTop: 14, marginTop: 16 }}>
                    <h6 style={{ fontWeight: 700, marginBottom: 12, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>Price Range</h6>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {PRICE_RANGES.map((r, i) => {
                        const active = priceRange === i;
                        return (
                          <button
                            key={r.label}
                            type="button"
                            onClick={() => handlePriceChange(i)}
                            style={{
                              textAlign: 'left',
                              border: '1px solid ' + (active ? '#e85d04' : '#e0e0e0'),
                              background: active ? '#fef3ec' : '#fff',
                              color: active ? '#e85d04' : '#333',
                              padding: '10px 12px',
                              borderRadius: 10,
                              fontWeight: active ? 700 : 500,
                              cursor: 'pointer',
                            }}
                          >
                            {r.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Loading skeletons */}
            {loading && (
              <div className="row g-4">
                {Array.from({ length: PER_PAGE }).map((_, i) => (
                  <div key={i} className="col-6 col-xl-4">
                    <div style={{ borderRadius: 12, background: '#f0f0f0', height: 380 }} />
                  </div>
                ))}
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div className="text-center py-5">
                <p style={{ color: '#e85d04', fontSize: 16, fontWeight: 600 }}>
                  {error}
                </p>
                <button
                  onClick={() => fetchProducts(category, page, query)}
                  className="ul-btn mt-3"
                  style={{ background: '#222', color: '#fff', border: 'none', padding: '10px 28px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && displayed.length === 0 && (
              <div className="text-center py-5">
                <p style={{ color: '#888', fontSize: 18 }}>No products found.</p>
                <button
                  onClick={() => { handleCategoryChange(''); setPriceRange(0); setSortBy('default'); }}
                  className="ul-btn mt-3"
                  style={{ background: '#222', color: '#fff', border: 'none', padding: '10px 28px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Product grid */}
            {!loading && !error && displayed.length > 0 && (
              <div className="row g-4">
                {displayed.map((p) => (
                  <div key={p.id} className="col-6 col-xl-4">
                    <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.06)', background: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>

                      {/* Image */}
                      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '3/4', background: '#f5f5f5' }}>
                        <Link href={"/shop/" + p.slug}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.imageUrl || '/assets/img/product-img-1.jpg'}
                            alt={p.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s', display: 'block' }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                          />
                        </Link>
                        {(p.isOnSale || p.isNewArrival) && (
                          <span style={{ position: 'absolute', top: 12, left: 12, background: p.isOnSale ? '#e85d04' : '#10b981', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>
                            {p.isOnSale ? 'Sale' : 'New'}
                          </span>
                        )}
                        <button
                          onClick={() => toggle({ id: String(p.id), slug: p.slug, name: p.name, price: p.sellingPrice, image: p.imageUrl ?? '' })}
                          aria-label="Toggle wishlist"
                          style={{ position: 'absolute', top: 12, right: 12, background: '#fff', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,.12)', color: isInWishlist(String(p.id)) ? '#e85d04' : '#888' }}
                        >
                          <i className={"flaticon-heart" + (isInWishlist(String(p.id)) ? '' : '-outline')} />
                        </button>
                      </div>

                      {/* Info */}
                      <div style={{ padding: '16px 16px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 11, color: '#e85d04', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, display: 'block' }}>
                          {(p.category ?? 'Fashion').replace(/-/g, ' ')}
                        </span>
                        <Link href={"/shop/" + p.slug} style={{ fontWeight: 600, fontSize: 15, color: '#222', textDecoration: 'none', marginBottom: 8, display: 'block' }}>
                          {p.name}
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                          <span style={{ fontWeight: 700, color: '#e85d04', fontSize: 16 }}>
                            GH&#8373;{p.sellingPrice.toFixed(2)}
                          </span>
                          {p.originalPrice && (
                            <span style={{ textDecoration: 'line-through', color: '#aaa', fontSize: 13 }}>
                              GH&#8373;{p.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleAddToCart(p)}
                          style={{ marginTop: 'auto', background: '#222', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 13, cursor: 'pointer', width: '100%', transition: 'background .2s' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#e85d04')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = '#222')}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="d-flex justify-content-center gap-2 mt-5">
                {page > 1 && (
                  <button onClick={() => setPage(page - 1)} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #e0e0e0', background: '#fff', color: '#444', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>
                    &#8249;
                  </button>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #e0e0e0', background: page === pg ? '#e85d04' : '#fff', color: page === pg ? '#fff' : '#444', fontWeight: page === pg ? 700 : 400, cursor: 'pointer', fontSize: 14 }}
                  >
                    {pg}
                  </button>
                ))}
                {page < totalPages && (
                  <button onClick={() => setPage(page + 1)} style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #e0e0e0', background: '#fff', color: '#444', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>
                    &#8250;
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
