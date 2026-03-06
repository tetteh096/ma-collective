import ShopGrid from './ShopGrid';
import { getCategories } from '@/lib/api';
import type { Category } from '@/lib/api';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Shop — Ayekwa Collective' };

interface Props {
  searchParams: Promise<{ category?: string; q?: string; page?: string; sort?: string }>;
}

const FALLBACK_CATEGORIES = [
  { id: 'all', label: 'All Products' },
];

function mapCategory(c: Category): { id: string; label: string } {
  return { id: c.slug, label: c.name };
}

export default async function ShopPage({ searchParams }: Props) {
  const params = await searchParams;

  // Fetch categories from our Neon API; fall back to static list
  const rawCategories = await getCategories().catch(() => []);
  const categories =
    rawCategories.length > 0
      ? [{ id: 'all', label: 'All Products' }, ...rawCategories.map(mapCategory)]
      : FALLBACK_CATEGORIES;

  return (
    <main>
      {/* Shop hero section with image */}
      <div
        className="ul-shop-hero"
        style={{
          position: 'relative',
          minHeight: 220,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'url(https://images.pexels.com/photos/9963294/pexels-photo-9963294.jpeg?auto=compress&cs=tinysrgb&w=1400)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 0 }} />
        <div className="ul-container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <h1 className="ul-section-title" style={{ fontSize: 36, color: '#fff', marginBottom: 8 }}>
            Shop All Products
          </h1>
          <nav aria-label="breadcrumb">
            <ol
              className="breadcrumb justify-content-center"
              style={{ background: 'none', marginBottom: 0 }}
            >
              <li className="breadcrumb-item">
                <a href="/" style={{ color: 'rgba(255,255,255,0.9)' }}>Home</a>
              </li>
              <li className="breadcrumb-item active" style={{ color: '#fff' }}>Shop</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ShopGrid fetches products entirely client-side — no server-side product pre-fetch */}
      <ShopGrid
        initialCategory={params.category ?? ''}
        initialPage={Math.max(1, parseInt(params.page ?? '1', 10))}
        query={params.q ?? ''}
        sort={params.sort ?? ''}
        categories={categories}
      />
    </main>
  );
}
