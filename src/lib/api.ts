/**
 * AFI Fashion Store — API Client
 * All calls go to our own Next.js API routes (backed by Neon PostgreSQL)
 * Prices are in GHS (₵)
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  sellingPrice: number;     // GHS
  originalPrice?: number;   // GHS – before discount
  currency: string;
  category?: string;
  brand?: string;
  sizes: string[];
  colors: string[];
  tags: string[];
  imageUrl?: string;
  gallery: string[];
  inStock: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  isNewArrival: boolean;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  // Extended (product detail only)
  description?: string;
  stockQty?: number;
  sku?: string;
}

export interface Category {
  id: number;
  uuid: string;
  name: string;
  slug: string;
  imageUrl?: string;
  description?: string;
  sortOrder: number;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format GHS price: ₵441.75 */
export function formatPrice(amount: number | string): string {
  return `₵${Number(amount).toFixed(2)}`;
}

/** Calculate discount % */
export function discountPercent(selling: number, original: number): number {
  if (!original || original <= selling) return 0;
  return Math.round(((original - selling) / original) * 100);
}

// ─── Base URL (same origin in Next.js; absolute for SSR) ─────────────────────

function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';
  return `${base}${path}`;
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getProducts(options: {
  page?: number;
  limit?: number;
  category?: string;
  sort?: 'newest' | 'price-asc' | 'price-desc' | 'rating' | 'discount-desc';
  q?: string;
  featured?: boolean;
  onSale?: boolean;
  newArrival?: boolean;
} = {}): Promise<ProductListResponse> {
  const params = new URLSearchParams();
  if (options.page)       params.set('page',         String(options.page));
  if (options.limit)      params.set('limit',        String(options.limit));
  if (options.category)   params.set('category',     options.category);
  if (options.sort)       params.set('sort',         options.sort);
  if (options.q)          params.set('q',            options.q);
  if (options.featured)   params.set('featured',     'true');
  if (options.onSale)     params.set('on_sale',      'true');
  if (options.newArrival) params.set('new_arrival',  'true');

  const res = await fetch(apiUrl(`/api/products?${params}`), { cache: 'no-store' });
  if (!res.ok) throw new Error(`Products API error: ${res.status}`);
  return res.json();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(apiUrl(`/api/products/${slug}`), { cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Product API error: ${res.status}`);
  const data = await res.json();
  return data.product ?? null;
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const data = await getProducts({ featured: true, limit });
  return data.items;
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const data = await getProducts({ newArrival: true, limit, sort: 'newest' });
  return data.items;
}

export async function getOnSaleProducts(limit = 8): Promise<Product[]> {
  const data = await getProducts({ onSale: true, limit });
  return data.items;
}

/** Top discount products: on-sale only, biggest discount % first. Used for Best Sellers section. */
export async function getTopDiscountProducts(limit = 3): Promise<Product[]> {
  const data = await getProducts({ onSale: true, sort: 'discount-desc', limit });
  return data.items;
}

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(apiUrl('/api/categories'), { cache: 'no-store' });
  if (!res.ok) throw new Error(`Categories API error: ${res.status}`);
  const data = await res.json();
  return data.items ?? data.categories ?? [];
}

// ─── Search ───────────────────────────────────────────────────────────────────

export async function searchProducts(q: string, limit = 12): Promise<Product[]> {
  if (!q.trim()) return [];
  const res = await fetch(apiUrl(`/api/search?q=${encodeURIComponent(q)}&limit=${limit}`), {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.items ?? [];
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function trackProductView(productId: number, referrer = 'direct') {
  try {
    await fetch(apiUrl('/api/analytics'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, referrer }),
    });
  } catch {
    // Fire-and-forget — never block the UI
  }
}
