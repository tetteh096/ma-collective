import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/api';
import { discountPercent } from '@/lib/api';
import { formatGHSRaw } from '@/lib/currency';

interface MostSellingProps {
  products?: Product[];
}

export default function MostSelling({ products }: MostSellingProps) {
  const items = (products && products.length > 0) ? products : [];

  return (
    <div className="ul-container">
      <section className="ul-products ul-most-selling-products">
        <div className="ul-inner-container">
          <div className="ul-section-heading flex-lg-row flex-column text-md-start text-center">
            <div className="left">
              <span className="ul-section-sub-title">On sale</span>
              <h2 className="ul-section-title">Biggest discounts</h2>
            </div>
            <div className="right">
              <Link href="/shop" className="ul-btn">
                All on sale <i className="flaticon-up-right-arrow" />
              </Link>
            </div>
          </div>

          <div className="ul-bs-row row row-cols-xl-3 row-cols-lg-3 row-cols-sm-2 row-cols-1 ul-most-selling-grid">
            {items.map((p) => {
              const orig = p.originalPrice ?? 0;
              const discount = discountPercent(p.sellingPrice, orig);
              return (
                <div className="col" key={p.id}>
                  <div className="ul-product-horizontal">
                    <div className="ul-product-horizontal-img">
                      <Image
                        src={p.imageUrl && (p.imageUrl.startsWith('http') || p.imageUrl.startsWith('/')) ? p.imageUrl : '/assets/img/product-img-sm-1.jpg'}
                        alt={p.name}
                        width={100}
                        height={100}
                        style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                      />
                      {discount > 0 && (
                        <span className="ul-product-discount-tag ul-product-horizontal-discount">
                          {discount}% Off
                        </span>
                      )}
                    </div>
                    <div className="ul-product-horizontal-txt">
                      <span className="ul-product-price">{formatGHSRaw(p.sellingPrice)}</span>
                      {orig > p.sellingPrice && (
                        <span className="ul-product-original-price">₵{Number(orig).toFixed(2)}</span>
                      )}
                      <h4 className="ul-product-title">
                        <Link href={"/shop/" + p.slug}>{p.name}</Link>
                      </h4>
                      <h5 className="ul-product-category">
                        <Link href="/shop">{p.category || 'Fashion'}</Link>
                      </h5>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {items.length === 0 && (
            <p className="ul-most-selling-empty">No products on sale right now. Check back later.</p>
          )}
        </div>
      </section>
    </div>
  );
}
