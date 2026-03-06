'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import AdminShell from '../../../_components/AdminShell';
import ProductForm from '../../../_components/ProductForm';

export default function EditProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${slug}`).then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ])
      .then(([pData, cData]) => {
        if (pData.error) { setError(pData.error); } else { setProduct(pData.product); }
        setCategories(cData.categories ?? []);
      })
      .catch(() => setError('Failed to load product'))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <AdminShell
      title={product ? `Edit: ${product.name}` : 'Edit Product'}
      actions={
        <Link href="/admin/products" className="ad-btn ad-btn-secondary">
          ← Back to Products
        </Link>
      }
    >
      {loading ? (
        <div className="ad-spinner" />
      ) : error ? (
        <div className="ad-card">
          <div className="ad-card-body" style={{ textAlign: 'center', padding: 48, color: '#ef4444' }}>
            {error}
          </div>
        </div>
      ) : (
        <ProductForm
          mode="edit"
          slug={slug}
          categories={categories}
          initial={{
            name:         product.name,
            description:  product.description ?? '',
            costPrice:    String(product.costPrice ?? ''),
            sellingPrice: String(product.sellingPrice),
            originalPrice:String(product.originalPrice ?? ''),
            stockQty:     String(product.stockQty ?? ''),
            sku:          product.sku ?? '',
            brand:        product.brand ?? '',
            tags:         (product.tags ?? []).join(', '),
            sizes:        (product.sizes ?? []).join(', '),
            colors:       (product.colors ?? []).join(', '),
            discountPercent: product.originalPrice && product.sellingPrice 
              ? String(Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100))
              : '',
            category:     product.category ?? '',
            categoryId:   String(product.categoryId ?? ''),
            imageUrl:     product.imageUrl ?? '',
            gallery:      product.gallery ?? [],
            isFeatured:   product.isFeatured,
            isOnSale:     product.isOnSale,
            isNewArrival: product.isNewArrival,
            inStock:      product.inStock,
          }}
        />
      )}
    </AdminShell>
  );
}
