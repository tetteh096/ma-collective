'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminShell from '../../_components/AdminShell';
import ProductForm from '../../_components/ProductForm';

export default function NewProductPage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d.categories ?? []))
      .catch(console.error);
  }, []);

  return (
    <AdminShell
      title="Add Product"
      actions={
        <Link href="/admin/products" className="ad-btn ad-btn-secondary">
          ← Back to Products
        </Link>
      }
    >
      <ProductForm mode="new" categories={categories} />
    </AdminShell>
  );
}
