'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductDetail({ product, related }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const { addItem, openCart } = useCart();
  const { toggle, isInWishlist } = useWishlist();

  const allImages = [product.imageUrl, ...(product.gallery ?? [])].filter((v): v is string => !!v).filter((v, i, a) => a.indexOf(v) === i);

  function handleAddToCart() {
    addItem({
      id: String(product.id),
      slug: product.slug,
      name: product.name,
      price: product.sellingPrice,
      image: product.imageUrl ?? '',
      quantity: qty,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });
    openCart();
  }

  const discount = product.originalPrice
    ? Math.round((1 - product.sellingPrice / product.originalPrice) * 100)
    : 0;

  const badge = product.isOnSale ? 'Sale' : product.isNewArrival ? 'New' : null;

  return (
    <div style={{ padding: '48px 0 80px' }}>
      <div className="ul-container">
        {/* Detail */}
        <div className="row g-5 mb-5">
          {/* Images */}
          <div className="col-lg-6">
            <div style={{ display: 'flex', gap: 12 }}>
              {/* Thumbnails */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    style={{
                      width: 72, height: 86, border: i === selectedImage ? '2px solid #e85d04' : '2px solid #eee',
                      borderRadius: 8, overflow: 'hidden', padding: 0, background: '#f5f5f5', cursor: 'pointer',
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
              {/* Main image */}
              <div style={{ flex: 1, borderRadius: 16, overflow: 'hidden', background: '#f5f5f5', aspectRatio: '3/4' }}>
                <img
                  src={allImages[selectedImage]}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="col-lg-6">
            {badge && (
              <span style={{ background: product.isOnSale ? '#e85d04' : '#10b981', color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 4, marginBottom: 12, display: 'inline-block' }}>
                {badge}
              </span>
            )}
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12, color: '#111' }}>{product.name}</h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[1,2,3,4,5].map((s) => (
                  <i key={s} className="flaticon-star" style={{ color: s <= Math.round(product.rating) ? '#f5a623' : '#ddd', fontSize: 13 }} />
                ))}
              </div>
              <span style={{ fontSize: 13, color: '#888' }}>({product.reviewsCount} reviews)</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#e85d04' }}>GH₵{product.sellingPrice.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span style={{ fontSize: 18, color: '#aaa', textDecoration: 'line-through' }}>GH₵{product.originalPrice.toFixed(2)}</span>
                  <span style={{ background: '#fef3ec', color: '#e85d04', fontSize: 13, fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            <p style={{ color: '#555', lineHeight: 1.7, marginBottom: 28 }}>{product.description}</p>

            {/* Color */}
            {product.colors.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Color: <span style={{ fontWeight: 400 }}>{selectedColor || 'Select a color'}</span></p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      style={{
                        padding: '6px 14px', borderRadius: 6, fontSize: 13,
                        border: selectedColor === c ? '2px solid #e85d04' : '1px solid #ddd',
                        background: selectedColor === c ? '#fef3ec' : '#fff',
                        fontWeight: selectedColor === c ? 600 : 400, cursor: 'pointer',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {product.sizes.length > 0 && (
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Size: <span style={{ fontWeight: 400 }}>{selectedSize || 'Select a size'}</span></p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        width: 44, height: 44, borderRadius: 8, fontSize: 13,
                        border: selectedSize === s ? '2px solid #e85d04' : '1px solid #ddd',
                        background: selectedSize === s ? '#e85d04' : '#fff',
                        color: selectedSize === s ? '#fff' : '#444',
                        fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              {/* Qty */}
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden', opacity: product.inStock ? 1 : 0.5 }}>
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={!product.inStock}
                  style={{ width: 40, height: 48, border: 'none', background: '#f5f5f5', fontSize: 18, cursor: product.inStock ? 'pointer' : 'not-allowed' }}
                >
                  −
                </button>
                <span style={{ width: 48, textAlign: 'center', fontWeight: 600 }}>{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  disabled={!product.inStock}
                  style={{ width: 40, height: 48, border: 'none', background: '#f5f5f5', fontSize: 18, cursor: product.inStock ? 'pointer' : 'not-allowed' }}
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                style={{
                  flex: 1, minWidth: 160, background: product.inStock ? '#222' : '#ccc', color: '#fff', border: 'none',
                  borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: product.inStock ? 'pointer' : 'not-allowed', transition: 'background .2s', opacity: product.inStock ? 1 : 0.6,
                }}
                onMouseEnter={(e) => product.inStock && (e.currentTarget.style.background = '#e85d04')}
                onMouseLeave={(e) => product.inStock && (e.currentTarget.style.background = '#222')}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {/* Buy Now */}
              {product.inStock ? (
                <Link
                  href="/checkout"
                  onClick={handleAddToCart}
                  style={{
                    flex: 1, minWidth: 160, background: '#e85d04', color: '#fff', border: 'none',
                    borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', textDecoration: 'none',
                  }}
                >
                  Buy Now
                </Link>
              ) : (
                <button
                  disabled
                  style={{
                    flex: 1, minWidth: 160, background: '#ccc', color: '#666', border: 'none',
                    borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'not-allowed', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', opacity: 0.6,
                  }}
                >
                  Buy Now
                </button>
              )}

              {/* Wishlist */}
              <button
                onClick={() => toggle({ id: String(product.id), slug: product.slug, name: product.name, price: product.sellingPrice, image: product.imageUrl ?? '' })}
                style={{
                  width: 48, height: 48, borderRadius: 8, border: '1px solid #ddd', background: '#fff',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: isInWishlist(String(product.id)) ? '#e85d04' : '#888',
                }}
                aria-label="Wishlist"
              >
                <i className="flaticon-heart" style={{ fontSize: 18 }} />
              </button>
            </div>

            {/* Meta */}
            <div style={{ borderTop: '1px solid #eee', paddingTop: 20, fontSize: 13, color: '#888', lineHeight: 2 }}>
              <p style={{ margin: 0 }}>
                <strong style={{ color: '#444' }}>Category:</strong>{' '}
                <Link href={`/shop?category=${product.category ?? 'fashion'}`} style={{ color: '#e85d04' }}>
                  {(product.category ?? 'Fashion').charAt(0).toUpperCase() + (product.category ?? 'Fashion').slice(1)}
                </Link>
              </p>
              <p style={{ margin: 0 }}>
                <strong style={{ color: '#444' }}>Availability:</strong>{' '}
                <span style={{ color: product.inStock ? '#2e7d32' : '#c62828' }}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginBottom: 64 }}>
          <div style={{ display: 'flex', borderBottom: '2px solid #eee', marginBottom: 24, gap: 0 }}>
            {['description', 'reviews', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 24px', border: 'none', background: 'none', fontWeight: 600,
                  fontSize: 14, cursor: 'pointer', textTransform: 'capitalize',
                  color: activeTab === tab ? '#e85d04' : '#888',
                  borderBottom: activeTab === tab ? '2px solid #e85d04' : '2px solid transparent',
                  marginBottom: -2,
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div style={{ maxWidth: 700, color: '#555', lineHeight: 1.8 }}>
              <p>{product.description}</p>
              <ul style={{ paddingLeft: 20, marginTop: 16 }}>
                <li>100% authentic African print fabric</li>
                <li>Handcrafted by skilled Ghanaian artisans</li>
                <li>Machine washable at 30°C</li>
                <li>Sizes run true to size — see our size guide</li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div style={{ maxWidth: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 0', borderBottom: '1px solid #eee' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 48, fontWeight: 800, color: '#111' }}>{product.rating}</div>
                  <div style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                    {[1,2,3,4,5].map((s) => (
                      <i key={s} className="flaticon-star" style={{ color: s <= Math.round(product.rating) ? '#f5a623' : '#ddd', fontSize: 14 }} />
                    ))}
                  </div>
                  <p style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{product.reviewsCount} reviews</p>
                </div>
              </div>
              <p style={{ color: '#888', marginTop: 20, fontSize: 14 }}>
                Customer reviews are collected after purchase. Sign in to leave your review.
              </p>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div style={{ maxWidth: 600, color: '#555', lineHeight: 1.8 }}>
              <p><strong>🚚 Free delivery</strong> within Accra on orders above GH₵500</p>
              <p><strong>📦 Standard delivery</strong> across Ghana: 3–5 business days</p>
              <p><strong>⚡ Express delivery</strong> in Accra & Kumasi: Next day available</p>
              <p><strong>🔁 Returns:</strong> Easy returns within 7 days of delivery</p>
            </div>
          )}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: 24 }}>Related Products</h3>
            <div className="row g-4">
              {related.map((p) => (
                <div key={p.id} className="col-6 col-md-3">
                  <Link href={`/shop/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ borderRadius: 12, overflow: 'hidden', background: '#f5f5f5' }}>
                      <img src={p.imageUrl ?? ''} alt={p.name} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <p style={{ marginTop: 12, fontWeight: 600, fontSize: 14 }}>{p.name}</p>
                    <p style={{ color: '#e85d04', fontWeight: 700 }}>GH₵{p.sellingPrice.toFixed(2)}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
