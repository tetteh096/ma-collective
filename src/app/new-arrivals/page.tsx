import Link from 'next/link';
import { getCategories, getProducts } from '@/lib/api';
import type { Category } from '@/lib/api';
import ProductCard from '@/components/ProductCard';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'New Arrivals — MA Collective' };

interface Props {
  searchParams: Promise<{ page?: string; sort?: string }>;
}

function mapCategory(c: Category): { id: string; label: string } {
  return { id: c.slug, label: c.name };
}

export default async function NewArrivalsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? '1', 10));

  // Fetch categories and new arrival products
  const [categories, productsData] = await Promise.all([
    getCategories().catch(() => []),
    getProducts({ page, limit: 12, newArrival: true }).catch(() => ({ items: [], total: 0 })),
  ]);

  const mappedCategories =
    categories.length > 0
      ? [{ id: 'all', label: 'All Products' }, ...categories.map(mapCategory)]
      : [];

  return (
    <main>
      <div
        className="ul-page-header"
        style={{ background: '#f8f4f0', padding: '40px 0', marginBottom: 0 }}
      >
        <div className="ul-container">
          <div className="ul-section-title-wrapper text-center">
            <h1 className="ul-section-title" style={{ fontSize: 32 }}>
              New Arrivals
            </h1>
            <p style={{ color: '#666', marginBottom: 0 }}>Discover our latest additions to the collection</p>
            <nav aria-label="breadcrumb">
              <ol
                className="breadcrumb justify-content-center"
                style={{ background: 'none', marginBottom: 0 }}
              >
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item active">New Arrivals</li>
              </ol>
            </nav>
          </div>
        </div>
      </div>

      <div className="ul-container" style={{ padding: '64px 0' }}>
        {productsData.items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#888' }}>
            <p style={{ fontSize: 16 }}>No new arrivals yet. Check back soon!</p>
            <Link href="/shop" style={{ color: '#e85d04', fontWeight: 600, textDecoration: 'none' }}>
              ← Back to Shop
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ color: '#666', margin: 0 }}>
                Showing {productsData.items.length} of {productsData.total} new products
              </p>
            </div>

            {/* Products Grid */}
            <div className="row g-4">
              {productsData.items.map((p) => (
                <div key={p.id} className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {/* Pagination */}
            {productsData.total > 12 && (
              <div style={{ marginTop: 48, textAlign: 'center' }}>
                {page > 1 && (
                  <Link
                    href={`/new-arrivals?page=${page - 1}`}
                    style={{
                      display: 'inline-block',
                      margin: '0 8px',
                      padding: '10px 16px',
                      border: '1px solid #ddd',
                      borderRadius: 6,
                      textDecoration: 'none',
                      color: '#444',
                    }}
                  >
                    ← Previous
                  </Link>
                )}
                <span style={{ margin: '0 16px', color: '#888' }}>Page {page}</span>
                {productsData.items.length === 12 && (
                  <Link
                    href={`/new-arrivals?page=${page + 1}`}
                    style={{
                      display: 'inline-block',
                      margin: '0 8px',
                      padding: '10px 16px',
                      border: '1px solid #ddd',
                      borderRadius: 6,
                      textDecoration: 'none',
                      color: '#444',
                    }}
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
