'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';

const slides = [
  {
    img: 'https://images.pexels.com/photos/13634354/pexels-photo-13634354.jpeg?auto=compress&cs=tinysrgb&w=1920',
    imgSlide: 'https://images.pexels.com/photos/34232728/pexels-photo-34232728.jpeg?auto=compress&cs=tinysrgb&w=700',
    subTitle: 'New Arrivals',
    title: 'Everyday Styles That Work',
    price: 'GH₵ 199',
    modifier: '',
  },
  {
    img: '/smart.jpg',
    imgSlide: '/smart.jpg',
    subTitle: 'For Him',
    title: 'Smart Casual & Office Wear',
    price: 'GH₵ 149',
    modifier: 'ul-banner-slide--2',
  },
  {
    img: 'https://images.pexels.com/photos/6192463/pexels-photo-6192463.jpeg?auto=compress&cs=tinysrgb&w=1920',
    imgSlide: 'https://images.pexels.com/photos/1661443/pexels-photo-1661443.jpeg?auto=compress&cs=tinysrgb&w=700',
    subTitle: "For Her",
    title: 'Work Ready & Weekend Ready',
    price: 'GH₵ 299',
    modifier: 'ul-banner-slide--3',
  },
];

export default function Banner() {
  const thumbRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let thumbSwiper: { destroy: (a: boolean, b: boolean) => void } | null = null;
    let mainSwiper: { destroy: (a: boolean, b: boolean) => void } | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;

    const init = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SwiperClass = (window as any).Swiper;
      if (!SwiperClass || !thumbRef.current || !mainRef.current) return false;

      thumbSwiper = new SwiperClass(thumbRef.current, {
        slidesPerView: 1.4,
        loop: true,
        autoplay: true,
        spaceBetween: 15,
        breakpoints: {
          992: { spaceBetween: 15 },
          1680: { spaceBetween: 26 },
          1700: { spaceBetween: 30 },
        },
      });

      mainSwiper = new SwiperClass(mainRef.current, {
        slidesPerView: 1,
        loop: true,
        autoplay: true,
        thumbs: { swiper: thumbSwiper },
        navigation: {
          nextEl: '.ul-banner-slider-nav .next',
          prevEl: '.ul-banner-slider-nav .prev',
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
      mainSwiper?.destroy(true, true);
      thumbSwiper?.destroy(true, true);
    };
  }, []);

  return (
    <div className="overflow-hidden">
      <div className="ul-container">
        <section className="ul-banner">
          <div className="ul-banner-slider-wrapper">
            <div ref={mainRef} className="ul-banner-slider swiper">
              <div className="swiper-wrapper">
                {slides.map((slide, i) => (
                  <div key={i} className={`swiper-slide ul-banner-slide ${slide.modifier}`}>
                    <div className="ul-banner-slide-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={slide.img} alt="Banner Image" />
                    </div>
                    <div className="ul-banner-slide-txt">
                      <span className="ul-banner-slide-sub-title">{slide.subTitle}</span>
                      <h1 className="ul-banner-slide-title">{slide.title}</h1>
                      <Link href="/shop" className="ul-btn">
                        SHOP NOW <i className="flaticon-up-right-arrow"></i>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="ul-banner-slider-nav-wrapper">
                <div className="ul-banner-slider-nav">
                  <button className="prev"><span className="icon"><i className="flaticon-down"></i></span></button>
                  <button className="next"><span className="icon"><i className="flaticon-down"></i></span></button>
                </div>
              </div>
            </div>
          </div>

          <div className="ul-banner-img-slider-wrapper">
            <div ref={thumbRef} className="ul-banner-img-slider swiper">
              <div className="swiper-wrapper">
                {slides.map((slide, i) => (
                  <div key={i} className="swiper-slide">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={slide.imgSlide} alt="Banner Image" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
