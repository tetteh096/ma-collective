'use client';

import { useEffect, useState } from 'react';

type Category = { id: number; slug: string; name: string };

export default function HeaderCategorySelect() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/categories', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const items = (data?.items ?? data?.categories ?? []) as Category[];
        setCategories(Array.isArray(items) ? items : []);
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <select name="category" id="ul-header-search-category">
      <option value="">All Categories</option>
      {categories.map((c) => (
        <option key={c.id} value={c.slug}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

