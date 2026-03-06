import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/lib/api';
import ProductDetail from './ProductDetail';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  return {
    title: product ? `${product.name} — Ayekwa Collective` : 'Product Not Found',
    description: product?.description ?? 'Shop authentic Ghanaian fashion at Ayekwa Collective',
    openGraph: product ? {
      title: product.name,
      description: product.description ?? '',
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
    } : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) notFound();

  // Fetch related products in the same category (exclude current)
  const related = await getProducts({ category: product.category, limit: 5 })
    .then((r) => r.items.filter((p) => p.slug !== slug).slice(0, 4))
    .catch(() => []);

  return (
    <>
      <main>
        {/* Breadcrumb */}
        <div style={{ background: '#f8f4f0', padding: '20px 0' }}>
          <div className="ul-container">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item"><a href="/">Home</a></li>
                <li className="breadcrumb-item"><a href="/shop">Shop</a></li>
                <li className="breadcrumb-item active">{product.name}</li>
              </ol>
            </nav>
          </div>
        </div>
        <ProductDetail product={product} related={related} />
      </main>
    </>
  );
}

