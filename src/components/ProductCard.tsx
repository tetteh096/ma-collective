import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/api';
import { discountPercent } from '@/lib/api';
import { formatGHSRaw } from '@/lib/currency';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = formatGHSRaw(product.sellingPrice);
  const imgSrc = product.imageUrl && (product.imageUrl.startsWith('http') || product.imageUrl.startsWith('/'))
    ? product.imageUrl
    : '/assets/img/product-img-1.jpg';

  const orig = product.originalPrice ?? 0;
  const calculatedDiscount = product.isOnSale && orig > product.sellingPrice
    ? discountPercent(product.sellingPrice, orig)
    : 0;
  const badge = product.isOnSale ? 'Sale' : product.isNewArrival ? 'New' : null;
  const isOutOfStock = !product.inStock;

  return (
    <div className="ul-product" style={isOutOfStock ? { opacity: 0.6 } : {}}>
      <div className="ul-product-heading">
        <span className="ul-product-price">{price}</span>
        {isOutOfStock && (
          <span className="ul-product-discount-tag" style={{ background: '#ef4444' }}>Out of Stock</span>
        )}
        {!isOutOfStock && calculatedDiscount > 0 && (
          <span className="ul-product-discount-tag">{calculatedDiscount}% Off</span>
        )}
        {!isOutOfStock && calculatedDiscount === 0 && badge && (
          <span className="ul-product-discount-tag">{badge}</span>
        )}
      </div>

      <div className="ul-product-img">
        <Image
          src={imgSrc}
          alt={product.name}
          width={300}
          height={360}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
        <div className="ul-product-actions">
          <button title={isOutOfStock ? "Out of Stock" : "Add to cart"} disabled={isOutOfStock} style={isOutOfStock ? { opacity: 0.5, cursor: 'not-allowed' } : {}}>
            <i className="flaticon-shopping-bag"></i>
          </button>
          <Link href={"/shop/" + product.slug} title="Quick view">
            <i className="flaticon-hide"></i>
          </Link>
          <button title="Add to wishlist"><i className="flaticon-heart"></i></button>
        </div>
      </div>

      <div className="ul-product-txt">
        <h4 className="ul-product-title">
          <Link href={"/shop/" + product.slug}>{product.name}</Link>
        </h4>
        <h5 className="ul-product-category">
          <Link href="/shop">{product.category || 'Fashion'}</Link>
        </h5>
      </div>
    </div>
  );
}

/* -- Horizontal variant (used in Most Selling section) -- */
interface HorizontalProductCardProps {
  product: Product;
  rating?: number;
}

export function HorizontalProductCard({ product, rating = 5 }: HorizontalProductCardProps) {
  const price = formatGHSRaw(product.sellingPrice);
  const imgSrc = product.imageUrl && (product.imageUrl.startsWith('http') || product.imageUrl.startsWith('/'))
    ? product.imageUrl
    : '/assets/img/product-img-sm-1.jpg';

  return (
    <div className="ul-product-horizontal">
      <div className="ul-product-horizontal-img">
        <Image
          src={imgSrc}
          alt={product.name}
          width={100}
          height={100}
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="ul-product-horizontal-txt">
        <span className="ul-product-price">{price}</span>
        <h4 className="ul-product-title">
          <Link href={"/shop/" + product.slug}>{product.name}</Link>
        </h4>
        <h5 className="ul-product-category">
          <Link href="/shop">{product.category || 'Fashion'}</Link>
        </h5>
        <div className="ul-product-rating">
          {Array.from({ length: Math.min(rating, 5) }).map((_, i) => (
            <span className="star" key={i}><i className="flaticon-star"></i></span>
          ))}
        </div>
      </div>
    </div>
  );
}
