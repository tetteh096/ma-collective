'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

const items = [
  'https://images.pexels.com/photos/34232728/pexels-photo-34232728.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1661443/pexels-photo-1661443.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.unsplash.com/photo-1556136412-3813d7367e4b?w=400&q=80&auto=format&fit=crop',
  'https://images.pexels.com/photos/935985/pexels-photo-935985.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/2170387/pexels-photo-2170387.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1625775/pexels-photo-1625775.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/10919897/pexels-photo-10919897.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1544724/pexels-photo-1544724.jpeg?auto=compress&cs=tinysrgb&w=400',
];

export default function Gallery() {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let swiper: { destroy: (a: boolean, b: boolean) => void } | null = null;
    let timer: ReturnType<typeof setInterval> | null = null;

    const init = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SwiperClass = (window as any).Swiper;
      if (!SwiperClass || !sliderRef.current) return false;

      swiper = new SwiperClass(sliderRef.current, {
        slidesPerView: 2.2,
        loop: true,
        autoplay: true,
        centeredSlides: true,
        spaceBetween: 15,
        breakpoints: {
          480:  { slidesPerView: 3.4 },
          576:  { slidesPerView: 4 },
          768:  { slidesPerView: 5 },
          992:  { spaceBetween: 20, slidesPerView: 5.5 },
          1680: { spaceBetween: 26, slidesPerView: 5.5 },
          1700: { spaceBetween: 30, slidesPerView: 5.5 },
          1920: { spaceBetween: 30, slidesPerView: 6, centeredSlides: false },
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
    <div className="ul-gallery overflow-hidden mx-auto">
      <div ref={sliderRef} className="ul-gallery-slider swiper">
        <div className="swiper-wrapper">
          {items.map((src, i) => (
            <div className="ul-gallery-item swiper-slide" key={i}>
              <Image src={src} alt={`Gallery ${i + 1}`} width={300} height={350} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              <div className="ul-gallery-item-btn-wrapper">
                <a href={src} data-fslightbox="gallery">
                  <i className="flaticon-instagram"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
