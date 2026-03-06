/**
 * EverShop API client
 * Talks to the EverShop GraphQL endpoint running at EVERSHOP_API_URL
 */

import type { Product } from './staticProducts';

const BASE_URL = process.env.EVERSHOP_API_URL || 'http://localhost:3000';

async function gql<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const controller = new AbortController();
  // Increase timeout to 10 seconds for slow builds/startups
  const timeout = setTimeout(() => controller.abort(), 10000);
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/graphql`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables }),
      cache: 'no-store',
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message ?? 'GraphQL error');
  return json.data as T;
}

// ─── Type Conversion ──────────────────────────────────────────────────────────

/**
 * Convert EverShop product to storefront Product type
 */
function normalizeProduct(ep: EverShopProduct): Product {
  // Get price - handle both regular and special pricing
  const priceValue = ep.price?.regular?.value || 0;

  // Get image URLs from EverShop (prefer listing size for catalog view, fallback to url, then placeholder)
  const mainImage = ep.image?.listing || ep.image?.url || '/assets/img/product-default.jpg';
  const galleryImages = (ep.gallery && ep.gallery.length > 0)
    ? ep.gallery.map(img => img.listing || img.url).filter(Boolean)
    : [mainImage];

  // Parse description to extract text
  let descriptionText = 'Premium product';
  if (typeof ep.description === 'string') {
    descriptionText = ep.description.substring(0, 200);
  } else if (ep.description && typeof ep.description === 'object') {
    // If it's JSON blocks (EditorJS format), try to extract text
    try {
      const desc = JSON.stringify(ep.description).substring(0, 200);
      if (desc && desc.length > 10) descriptionText = desc;
    } catch {
      // Keep default
    }
  }

  return {
    id: String(ep.productId),
    slug: ep.urlKey || `product-${ep.productId}`,
    name: ep.name,
    price: priceValue, // Use actual price from EverShop
    image: mainImage,
    category: 'general', // EverShop doesn't return category in product query - would need separate query
    rating: 4.5, // Default rating - could be enhanced with dedicated API call
    reviews: 0,
    description: descriptionText,
    sizes: [], // EverShop doesn't include sizes in base product data
    colors: [], // EverShop doesn't include colors in base product data
    inStock: true, // Could be checked from inventory endpoint
    images: galleryImages.filter(Boolean),
  };
}

// ─── Types ───────────────────────────────────────────────────────────

export interface EverShopProduct {
  productId: number;
  uuid: string;
  name: string;
  urlKey: string;
  sku: string;
  description: unknown; // JSON blocks (EditorJS format)
  price?: {
    regular: { value: number; text: string };
    special: { value: number; text: string };
  };
  image?: { url: string; listing: string; single?: string; thumb?: string };
  gallery?: { url: string; listing: string; single?: string; thumb?: string }[];
}

export interface EverShopCategory {
  categoryId: number;
  uuid: string;
  name: string;
  urlKey: string;
  image?: string;
}

// Aliases for backward compatibility
export type ESProduct = EverShopProduct;
export type ESCategory = EverShopCategory;

// ─── Product Queries ──────────────────────────────────────────────────────────

const PRODUCT_FIELDS = `
  productId
  uuid
  name
  urlKey
  sku
  description
  price {
    regular {
      value
      text
    }
    special {
      value
      text
    }
  }
  image {
    url
    listing
  }
  gallery {
    url
    listing
  }
`;

interface GetProductsOptions {
  page?: number;
  limit?: number;
  search?: string;
  categoryUrlKey?: string;
}

export async function getProducts(
  options: GetProductsOptions = {}
): Promise<{ items: Product[]; total: number }> {
  const { page = 1, limit = 9, search = '', categoryUrlKey = '' } = options;

  const query = `
    query GetProducts($filters: [FilterInput]) {
      products(filters: $filters) {
        items {
          ${PRODUCT_FIELDS}
        }
        total
      }
    }
  `;

  // Build filters from options
  const filters: { key: string; operation: string; value: string }[] = [];

  if (search && search.trim()) {
    filters.push({ key: 'keyword', operation: 'eq', value: search.trim() });
  }

  if (categoryUrlKey && categoryUrlKey.trim()) {
    filters.push({ key: 'category_url_key', operation: 'eq', value: categoryUrlKey.trim() });
  }

  const data = await gql<{ products: { items: EverShopProduct[]; total: number } }>(
    query,
    { filters }
  );

  // Normalize EverShop products to storefront Product type
  return {
    items: data.products.items.map(normalizeProduct),
    total: data.products.total,
  };
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const query = `
    query GetProducts($filters: [FilterInput]) {
      products(filters: $filters) {
        items {
          ${PRODUCT_FIELDS}
        }
      }
    }
  `;

  const filters: { key: string; operation: string; value: string }[] = [];

  const data = await gql<{ products: { items: EverShopProduct[] } }>(
    query,
    { filters }
  );
  return data.products.items.map(normalizeProduct);
}

// ─── Category Queries ─────────────────────────────────────────────────────────

export async function getCategories(): Promise<EverShopCategory[]> {
  const query = `
    query GetCategories {
      categories {
        items {
          categoryId
          uuid
          name
          urlKey
          image
        }
      }
    }
  `;

  const data = await gql<{ categories: { items: EverShopCategory[] } }>(query);
  return data.categories.items;
}

// ─── Product Detail Query ──────────────────────────────────────────────────────

export async function getProductBySlug(
  urlKey: string
): Promise<Product | null> {
  const query = `
    query GetProduct($filters: [FilterInput]) {
      products(filters: $filters) {
        items {
          ${PRODUCT_FIELDS}
        }
      }
    }
  `;

  const filters = [{ key: 'url_key', operation: 'eq', value: urlKey }];

  const data = await gql<{ products: { items: EverShopProduct[] } }>(
    query,
    { filters }
  );
  const item = data.products.items[0];
  return item ? normalizeProduct(item) : null;
}
