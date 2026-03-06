'use client';

import { useEffect, useState } from 'react';
import AdminShell from '../_components/AdminShell';

interface Product {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  imageUrl?: string;
  sellingPrice: string;
  isFeatured: boolean;
}

export default function FeaturedProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const [allRes, featuredRes] = await Promise.all([
        fetch('/api/products?limit=100'),
        fetch('/api/featured-products?limit=100'),
      ]);

      const allData = await allRes.json();
      const featuredData = await featuredRes.json();

      console.log('All products:', allData);
      console.log('Featured products:', featuredData);

      const allProducts = (allData.products || []).map((p: any) => ({
        ...p,
        sellingPrice: typeof p.sellingPrice === 'string' ? p.sellingPrice : String(p.sellingPrice),
      }));

      const featuredProducts = (featuredData.products || []).map((p: any) => ({
        ...p,
        sellingPrice: typeof p.sellingPrice === 'string' ? p.sellingPrice : String(p.sellingPrice),
      }));

      setProducts(allProducts);
      setFeatured(featuredProducts);
      setSelectedProducts(featuredProducts.map((p: any) => p.id));
    } catch (err) {
      console.error('Failed to fetch products:', err);
      alert('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleSave = async () => {
    try {
      // Get current featured products
      const currentFeatured = featured.map((p) => p.id);

      // Remove from featured
      const toRemove = currentFeatured.filter((id) => !selectedProducts.includes(id));
      for (const id of toRemove) {
        await fetch(`/api/featured-products/${id}`, {
          method: 'DELETE',
        });
      }

      // Add to featured
      const toAdd = selectedProducts.filter((id) => !currentFeatured.includes(id));
      if (toAdd.length > 0) {
        await fetch('/api/featured-products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productIds: toAdd }),
        });
      }

      fetchProducts();
      alert('Featured products updated!');
    } catch (err) {
      console.error('Failed to update featured:', err);
      alert('Error updating featured products');
    }
  };

  if (loading) {
    return (
      <AdminShell title="Featured Products">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
      </AdminShell>
    );
  }

  const unselected = products.filter((p) => !selectedProducts.includes(p.id));

  return (
    <AdminShell
      title="Featured Products"
      actions={
        <button
          onClick={handleSave}
          className="ad-btn ad-btn-success"
        >
          Save Changes
        </button>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Available Products */}
        <div className="ad-card">
          <h2 style={{ fontWeight: '600', marginBottom: '1rem' }}>Available Products</h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {unselected.map((product) => (
                <label
                  key={product.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.75rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => handleToggle(product.id)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span style={{ marginLeft: '0.75rem', flex: 1 }}>{product.name}</span>
                  <span style={{ fontSize: '0.875rem', color: '#666' }}>GH₵{product.sellingPrice}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Products */}
        <div className="ad-card">
          <h2 style={{ fontWeight: '600', marginBottom: '1rem' }}>
            Featured ({selectedProducts.length})
          </h2>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {products
                .filter((p) => selectedProducts.includes(p.id))
                .map((product) => (
                  <label
                    key={product.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem',
                      border: '1px solid #93c5fd',
                      backgroundColor: '#eff6ff',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => handleToggle(product.id)}
                      style={{ width: '16px', height: '16px', accentColor: '#3b82f6' }}
                    />
                    <span style={{ marginLeft: '0.75rem', flex: 1, fontWeight: '500' }}>{product.name}</span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleToggle(product.id);
                      }}
                      className="ad-btn ad-btn-danger-small"
                    >
                      Remove
                    </button>
                  </label>
                ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
