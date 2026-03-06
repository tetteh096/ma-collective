'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import type { Product } from '@/lib/api';

interface ProductsSectionProps {
  products?: Product[];
}

// This section shows FEATURED products (from getFeaturedProducts on the home page).
// Row 1 = first 3, Row 2 = next 3 → 6 products total in "New Arrivals / Shop Your Style".
// To show more: increase the slice end (e.g. slice(0,4) and slice(4,8) for 8 total).
const ROW1_SIZE = 3;
const ROW2_SIZE = 3;

export default function ProductsSection({ products }: ProductsSectionProps) {
  const items = products && products.length > 0 ? products : [];
  const row1 = items.slice(0, ROW1_SIZE);
  const row2 = items.slice(ROW1_SIZE, ROW1_SIZE + ROW2_SIZE);

  const slider1Ref = useRef<HTMLDivElement>(null);
  const slider2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let swiper1: { destroy: (a: boolean, b: boolean) => void } | null = null;
    let swiper2: { destroy: (a: boolean, b: boolean) => void } | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;

    const init = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SwiperClass = (window as any).Swiper;
      if (!SwiperClass || !slider1Ref.current || !slider2Ref.current) return false;

      swiper1 = new SwiperClass(slider1Ref.current, {
        slidesPerView: 3,
        loop: true,
        autoplay: true,
        spaceBetween: 15,
        navigation: {
          nextEl: '.ul-products-slider-1-nav .next',
          prevEl: '.ul-products-slider-1-nav .prev',
        },
        breakpoints: {
          0:    { slidesPerView: 1 },
          480:  { slidesPerView: 2 },
          992:  { slidesPerView: 3 },
          1200: { spaceBetween: 20 },
          1400: { spaceBetween: 22 },
          1600: { spaceBetween: 26 },
          1700: { spaceBetween: 30 },
        },
      });

      swiper2 = new SwiperClass(slider2Ref.current, {
        slidesPerView: 3,
        loop: true,
        autoplay: true,
        spaceBetween: 15,
        navigation: {
          nextEl: '.ul-products-slider-2-nav .next',
          prevEl: '.ul-products-slider-2-nav .prev',
        },
        breakpoints: {
          0:    { slidesPerView: 1 },
          480:  { slidesPerView: 2 },
          992:  { slidesPerView: 3 },
          1200: { spaceBetween: 20 },
          1400: { spaceBetween: 22 },
          1600: { spaceBetween: 26 },
          1700: { spaceBetween: 30 },
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
      swiper1?.destroy(true, true);
      swiper2?.destroy(true, true);
    };
  }, []);

  return (
    <div className="ul-container">
      <section className="ul-products">
        <div className="ul-inner-container">
          <div className="ul-section-heading">
            <div className="left">
              <span className="ul-section-sub-title">Customer Choice</span>
              <h2 className="ul-section-title">Shop Your Style</h2>
            </div>
            <div className="right">
              <Link href="/shop" className="ul-btn">
                More Collective <i className="flaticon-up-right-arrow"></i>
              </Link>
            </div>
          </div>

          <div className="row ul-bs-row">
            {/* Row 1 */}
            <div className="col-lg-3 col-md-4 col-12">
              <div className="ul-products-sub-banner">
                <div className="ul-products-sub-banner-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.pexels.com/photos/1661443/pexels-photo-1661443.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Banner" />
                </div>
                <div className="ul-products-sub-banner-txt">
                  <h3 className="ul-products-sub-banner-title">New Styles - Shop This Week!</h3>
                  <Link href="/shop" className="ul-btn">Shop Now <i className="flaticon-up-right-arrow"></i></Link>
                </div>
              </div>
            </div>
            <div className="col-lg-9 col-md-8 col-12">
              <div ref={slider1Ref} className="swiper ul-products-slider-1">
                <div className="swiper-wrapper">
                  {row1.map((p) => (
                    <div className="swiper-slide" key={p.id}>
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="ul-products-slider-nav ul-products-slider-1-nav">
                <button className="prev"><i className="flaticon-left-arrow"></i></button>
                <button className="next"><i className="flaticon-arrow-point-to-right"></i></button>
              </div>
            </div>

            {/* Row 2 */}
            <div className="col-lg-3 col-md-4 col-12">
              <div className="ul-products-sub-banner">
                <div className="ul-products-sub-banner-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="https://images.pexels.com/photos/2922301/pexels-photo-2922301.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Banner" />
                </div>
                <div className="ul-products-sub-banner-txt">
                  <h3 className="ul-products-sub-banner-title">Dresses &amp; Occasion Wear</h3>
                  <Link href="/shop" className="ul-btn">Explore <i className="flaticon-up-right-arrow"></i></Link>
                </div>
              </div>
            </div>
            <div className="col-lg-9 col-md-8 col-12">
              <div ref={slider2Ref} className="swiper ul-products-slider-2">
                <div className="swiper-wrapper">
                  {row2.map((p) => (
                    <div className="swiper-slide" key={p.id}>
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="ul-products-slider-nav ul-products-slider-2-nav">
                <button className="prev"><i className="flaticon-left-arrow"></i></button>
                <button className="next"><i className="flaticon-arrow-point-to-right"></i></button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
