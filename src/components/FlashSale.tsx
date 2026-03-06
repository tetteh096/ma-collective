'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/api';
import { formatGHSRaw } from '@/lib/currency';

interface FlashSaleProps {
  products?: Product[];
}

/** New Arrivals — from the new-arrival API (isNewArrival), with tags/badges from API. */
export default function FlashSale({ products }: FlashSaleProps) {
  const items = (products && products.length > 0) ? products.slice(0, 3) : [];
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let swiper: { destroy: (a: boolean, b: boolean) => void } | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;

    const init = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SwiperClass = (window as any).Swiper;
      if (!SwiperClass || !sliderRef.current) return false;

      swiper = new SwiperClass(sliderRef.current, {
        slidesPerView: 1,
        loop: true,
        autoplay: true,
        spaceBetween: 15,
        breakpoints: {
          480:  { slidesPerView: 2 },
          768:  { slidesPerView: 3 },
          992:  { slidesPerView: 4 },
          1200: { spaceBetween: 20, slidesPerView: 4 },
          1680: { spaceBetween: 26, slidesPerView: 4 },
          1700: { spaceBetween: 30, slidesPerView: 4.7 },
        },
      });
      return true;
    };

    if (!init()) {
      timer = setInterval(() => {
        if (init()) {
          clearInterval(timer!);
          timer = null;
        }
      }, 100);
    }

    return () => {
      if (timer) clearInterval(timer);
      swiper?.destroy(true, true);
    };
  }, []);

  return (
    <div className="overflow-hidden">
      <div className="ul-container">
        <div className="ul-flash-sale">
          <div className="ul-inner-container">
            <div className="ul-section-heading ul-flash-sale-heading">
              <div className="left">
                <span className="ul-section-sub-title">New Arrivals</span>
                <h2 className="ul-section-title">Just in</h2>
              </div>

              <Link href="/new-arrivals" className="ul-btn">
                View all new arrivals <i className="flaticon-up-right-arrow"></i>
              </Link>
            </div>

            <div ref={sliderRef} className="ul-flash-sale-slider swiper">
              <div className="swiper-wrapper">
                {items.map((p) => (
                  <div className="swiper-slide" key={p.id}>
                    <div className="ul-product">
                      <div className="ul-product-heading">
                        <span className="ul-product-price">{formatGHSRaw(p.sellingPrice)}</span>
                        {p.isOnSale && <span className="ul-product-discount-tag">Sale</span>}
                        {!p.isOnSale && p.isNewArrival && <span className="ul-product-discount-tag">New</span>}
                        {!p.isOnSale && !p.isNewArrival && p.tags?.length > 0 && (
                          <span className="ul-product-discount-tag">{p.tags[0]}</span>
                        )}
                      </div>
                      <div className="ul-product-img">
                        <Image
                          src={p.imageUrl && (p.imageUrl.startsWith('http') || p.imageUrl.startsWith('/')) ? p.imageUrl : '/assets/img/product-img-1.jpg'}
                          alt={p.name}
                          width={280}
                          height={340}
                          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                        <div className="ul-product-actions">
                          <button><i className="flaticon-shopping-bag"></i></button>
                          <Link href={"/shop/" + p.slug}><i className="flaticon-hide"></i></Link>
                          <button><i className="flaticon-heart"></i></button>
                        </div>
                      </div>
                      <div className="ul-product-txt">
                        <h4 className="ul-product-title">
                          <Link href={"/shop/" + p.slug}>{p.name}</Link>
                        </h4>
                        <h5 className="ul-product-category">
                          <Link href="/shop">{p.category || 'Fashion'}</Link>
                        </h5>
                        {p.tags && p.tags.length > 0 && (
                          <p className="ul-product-tags">{p.tags.slice(0, 3).join(' · ')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
