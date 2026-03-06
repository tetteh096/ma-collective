'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Category { id: number; name: string; slug: string; }

interface ProductFormData {
  name: string;
  description: string;
  costPrice: string;
  sellingPrice: string;
  originalPrice: string;
  stockQty: string;
  sku: string;
  brand: string;
  tags: string;
  category: string;
  categoryId: string;
  imageUrl: string;
  gallery: string[];
  sizes: string;
  colors: string;
  discountPercent: string;
  isFeatured: boolean;
  isOnSale: boolean;
  isNewArrival: boolean;
  inStock: boolean;
}

interface Props {
  mode: 'new' | 'edit';
  productId?: number;
  slug?: string;
  initial?: Partial<ProductFormData>;
  categories: Category[];
}

export default function ProductForm({ mode, slug, initial, categories }: Props) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProductFormData>({
    name: initial?.name ?? '',
    description: initial?.description ?? '',
    costPrice: initial?.costPrice ?? '',
    sellingPrice: initial?.sellingPrice ?? '',
    originalPrice: initial?.originalPrice ?? '',
    stockQty: initial?.stockQty ?? '',
    sku: initial?.sku ?? '',
    brand: initial?.brand ?? '',
    tags: initial?.tags ?? '',
    category: initial?.category ?? '',
    categoryId: initial?.categoryId ?? '',
    imageUrl: initial?.imageUrl ?? '',
    gallery: initial?.gallery ?? [],
    sizes: initial?.sizes ?? '',
    colors: initial?.colors ?? '',
    discountPercent: initial?.discountPercent ?? '',
    isFeatured: initial?.isFeatured ?? false,
    isOnSale: initial?.isOnSale ?? false,
    isNewArrival: initial?.isNewArrival ?? false,
    inStock: initial?.inStock ?? true,
  });

  const [saving, setSaving] = useState(false);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  function set(field: keyof ProductFormData, value: any) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  async function uploadImage(file: File, target: 'main' | 'gallery') {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('folder', 'products');
    if (target === 'main') setUploadingMain(true);
    else setUploadingGallery(true);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = await res.json();
      if (target === 'main') {
        set('imageUrl', url);
      } else {
        setForm(f => ({ ...f, gallery: [...f.gallery, url] }));
      }
    } catch {
      showToast('Image upload failed', 'error');
    } finally {
      if (target === 'main') setUploadingMain(false);
      else setUploadingGallery(false);
    }
  }

  function removeGallery(url: string) {
    setForm(f => ({ ...f, gallery: f.gallery.filter(u => u !== url) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.sellingPrice) {
      showToast('Name and selling price are required', 'error');
      return;
    }

    setSaving(true);
    const { discountPercent, ...formData } = form;
    const payload = {
      ...formData,
      costPrice: parseFloat(form.costPrice) || 0,
      sellingPrice: parseFloat(form.sellingPrice),
      originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
      stockQty: parseInt(form.stockQty) || 0,
      categoryId: form.categoryId ? parseInt(form.categoryId) : null,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      sizes: form.sizes.split(',').map(s => s.trim()).filter(Boolean),
      colors: form.colors.split(',').map(c => c.trim()).filter(Boolean),
    };

    try {
      const url = mode === 'new' ? '/api/products' : `/api/products/${slug}`;
      const method = mode === 'new' ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? 'Save failed');
      }

      const data = await res.json();
      showToast(mode === 'new' ? 'Product created!' : 'Product updated!', 'success');
      setTimeout(() => router.push('/admin/products'), 1000);
    } catch (err: any) {
      showToast(err.message ?? 'Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        {/* Left column */}
        <div>
          {/* Basic info */}
          <div className="ad-card">
            <div className="ad-card-header">
              <span className="ad-card-title">Basic Information</span>
            </div>
            <div className="ad-card-body">
              <div className="ad-form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="ad-form-group">
                  <label className="ad-label">Product Name <span className="req">*</span></label>
                  <input className="ad-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Kente Print Maxi Dress" required />
                </div>
                <div className="ad-form-group">
                  <label className="ad-label">Description</label>
                  <textarea className="ad-textarea" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Product description…" rows={5} />
                </div>
              </div>

              <div className="ad-form-grid" style={{ marginTop: 16 }}>
                <div className="ad-form-group">
                  <label className="ad-label">Brand</label>
                  <input className="ad-input" value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="Brand name" />
                </div>
                <div className="ad-form-group">
                  <label className="ad-label">SKU</label>
                  <input className="ad-input" value={form.sku} onChange={e => set('sku', e.target.value)} placeholder="AFI-001" />
                </div>
                <div className="ad-form-group ad-form-full">
                  <label className="ad-label">Tags <span className="ad-input-hint">(comma-separated)</span></label>
                  <input className="ad-input" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="ankara, casual, summer" />
                </div>
              </div>

              <div className="ad-form-grid" style={{ marginTop: 16 }}>
                <div className="ad-form-group ad-form-full">
                  <label className="ad-label">Sizes <span className="ad-input-hint">(comma-separated)</span></label>
                  <input className="ad-input" value={form.sizes} onChange={e => set('sizes', e.target.value)} placeholder="S, M, L, XL, XXL" />
                </div>
                <div className="ad-form-group ad-form-full">
                  <label className="ad-label">Colors <span className="ad-input-hint">(comma-separated)</span></label>
                  <input className="ad-input" value={form.colors} onChange={e => set('colors', e.target.value)} placeholder="White, Navy, Black, Red" />
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="ad-card">
            <div className="ad-card-header">
              <span className="ad-card-title">Pricing (GHS ₵)</span>
            </div>
            <div className="ad-card-body">
              <div className="ad-form-grid cols-3">
                <div className="ad-form-group">
                  <label className="ad-label">Selling Price <span className="req">*</span></label>
                  <input className="ad-input" type="number" step="0.01" min="0" value={form.sellingPrice} onChange={e => set('sellingPrice', e.target.value)} placeholder="0.00" required />
                </div>
                <div className="ad-form-group">
                  <label className="ad-label">Cost Price</label>
                  <input className="ad-input" type="number" step="0.01" min="0" value={form.costPrice} onChange={e => set('costPrice', e.target.value)} placeholder="0.00" />
                  <span className="ad-input-hint">For profit tracking (not shown to customers)</span>
                </div>
                <div className="ad-form-group">
                  <label className="ad-label">Original Price <span className="ad-input-hint">(crossed out)</span></label>
                  <input className="ad-input" type="number" step="0.01" min="0" value={form.originalPrice} onChange={e => set('originalPrice', e.target.value)} placeholder="0.00" />
                </div>
                <div className="ad-form-group">
                  <label className="ad-label">Discount % <span className="ad-input-hint">(sale badge)</span></label>
                  <input className="ad-input" type="number" step="0.01" min="0" max="100" value={form.discountPercent} onChange={e => set('discountPercent', e.target.value)} placeholder="0" />
                  <span className="ad-input-hint">Shows on sale badge (e.g., "Save 22%")</span>
                </div>
              </div>

              {form.sellingPrice && form.costPrice && parseFloat(form.costPrice) > 0 && (
                <div style={{ marginTop: 12, padding: '10px 14px', background: '#f0fdf4', borderRadius: 8, fontSize: 13, color: '#065f46' }}>
                  Profit: ₵{(parseFloat(form.sellingPrice) - parseFloat(form.costPrice)).toFixed(2)} &nbsp;·&nbsp;
                  Margin: {Math.round(((parseFloat(form.sellingPrice) - parseFloat(form.costPrice)) / parseFloat(form.sellingPrice)) * 100)}%
                </div>
              )}
            </div>
          </div>

          {/* Images */}
          <div className="ad-card">
            <div className="ad-card-header">
              <span className="ad-card-title">Images</span>
            </div>
            <div className="ad-card-body">
              {/* Main Image */}
              <div className="ad-form-group" style={{ marginBottom: 20 }}>
                <label className="ad-label">Main Image</label>
                {form.imageUrl ? (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <img src={form.imageUrl} alt="Main" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e7eb' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <button type="button" className="ad-btn ad-btn-secondary ad-btn-sm" onClick={() => imageInputRef.current?.click()}>
                        Change Image
                      </button>
                      <button type="button" className="ad-btn ad-btn-danger ad-btn-sm" onClick={() => set('imageUrl', '')}>
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="ad-img-upload"
                    onClick={() => imageInputRef.current?.click()}
                  >
                    {uploadingMain ? (
                      <div className="ad-spinner" style={{ margin: '0 auto' }} />
                    ) : (
                      <>
                        <div style={{ fontSize: 32 }}>🖼️</div>
                        <p style={{ margin: '8px 0 4px', fontWeight: 500 }}>Click to upload main image</p>
                        <p style={{ fontSize: 12, color: '#6b7280' }}>JPG, PNG, WebP · max 5MB</p>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => { const f = e.target.files?.[0]; if (f) uploadImage(f, 'main'); e.target.value = ''; }}
                />
                <input className="ad-input" value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="or paste image URL directly" style={{ marginTop: 8 }} />
              </div>

              {/* Gallery */}
              <div className="ad-form-group">
                <label className="ad-label">Gallery Images</label>
                <div className="ad-img-preview">
                  {form.gallery.map((url) => (
                    <div className="ad-img-thumb" key={url}>
                      <img src={url} alt="" />
                      <button type="button" className="ad-img-thumb-del" onClick={() => removeGallery(url)}>✕</button>
                    </div>
                  ))}
                  <div
                    style={{ width: 80, height: 80, border: '2px dashed #e5e7eb', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 24, color: '#9ca3af' }}
                    onClick={() => galleryInputRef.current?.click()}
                  >
                    {uploadingGallery ? '…' : '+'}
                  </div>
                </div>
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={e => {
                    Array.from(e.target.files ?? []).forEach(f => uploadImage(f, 'gallery'));
                    e.target.value = '';
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Publish */}
          <div className="ad-card" style={{ marginBottom: 24 }}>
            <div className="ad-card-header">
              <span className="ad-card-title">Publish</span>
            </div>
            <div className="ad-card-body" style={{ padding: '8px 24px' }}>
              {[
                { field: 'inStock',     label: 'In Stock',     desc: 'Product available to purchase' },
                { field: 'isFeatured',  label: 'Featured',     desc: 'Show on homepage' },
                { field: 'isOnSale',    label: 'On Sale',      desc: 'Mark with sale badge' },
                { field: 'isNewArrival',label: 'New Arrival',  desc: 'Show in new arrivals' },
              ].map(({ field, label, desc }) => {
                const isDisabled = field !== 'inStock' && !form.inStock;
                return (
                  <div className="ad-toggle-row" key={field} style={{ opacity: isDisabled ? 0.5 : 1 }}>
                    <div>
                      <div className="ad-toggle-label">{label}</div>
                      <div className="ad-toggle-desc">{desc}</div>
                      {isDisabled && <div style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>Enable "In Stock" first</div>}
                    </div>
                    <label className="ad-toggle">
                      <input
                        type="checkbox"
                        disabled={isDisabled}
                        checked={form[field as keyof ProductFormData] as boolean}
                        onChange={e => set(field as keyof ProductFormData, e.target.checked)}
                      />
                      <span className="ad-toggle-track" />
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Organisation */}
          <div className="ad-card" style={{ marginBottom: 24 }}>
            <div className="ad-card-header">
              <span className="ad-card-title">Organisation</span>
            </div>
            <div className="ad-card-body">
              <div className="ad-form-group" style={{ marginBottom: 16 }}>
                <label className="ad-label">Category</label>
                <select className="ad-select" value={form.categoryId} onChange={e => {
                  const cat = categories.find(c => String(c.id) === e.target.value);
                  set('categoryId', e.target.value);
                  set('category', cat?.name ?? '');
                }}>
                  <option value="">— No category —</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="ad-form-group">
                <label className="ad-label">Stock Quantity</label>
                <input className="ad-input" type="number" min="0" value={form.stockQty} onChange={e => set('stockQty', e.target.value)} placeholder="0" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button type="submit" className="ad-btn ad-btn-primary" disabled={saving} style={{ justifyContent: 'center' }}>
              {saving ? 'Saving…' : mode === 'new' ? '✓ Create Product' : '✓ Save Changes'}
            </button>
            <button type="button" className="ad-btn ad-btn-secondary" onClick={() => router.push('/admin/products')} style={{ justifyContent: 'center' }}>
              Cancel
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className={`ad-toast ad-toast-${toast.type}`}>{toast.msg}</div>
      )}
    </form>
  );
}
