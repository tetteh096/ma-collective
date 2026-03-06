'use client';
import { useEffect, useRef } from 'react';

const reviews = [
  { name: 'Kwame', role: '', text: 'Ordered on Monday, received on Wednesday. Delivery was fast and the customer service team helped me pick the right size. Great prices too!', avatar: 'K', rating: 5 },
  { name: 'Ama', role: '', text: 'I got exactly what I ordered. The quality is really good and the prices are fair compared to other stores. Will definitely order again.', avatar: 'A', rating: 5 },
  { name: 'Samuel', role: '', text: 'Fast delivery to the regions is rare. They shipped my order quickly and the customer care team was very helpful when I had questions.', avatar: 'S', rating: 5 },
  { name: 'Grace', role: '', text: 'Good quality items and reasonable prices. My order arrived in good condition and on time. Happy with my shopping experience here.', avatar: 'G', rating: 5 },
  { name: 'Christopher', role: '', text: 'The prices are competitive and the delivery was faster than I expected. Got my items exactly as described. Satisfied customer here.', avatar: 'C', rating: 5 },
];

export default function Reviews() {
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
          768:  { slidesPerView: 2 },
          992:  { spaceBetween: 20, slidesPerView: 3 },
          1200: { spaceBetween: 20, slidesPerView: 4 },
          1680: { slidesPerView: 4, spaceBetween: 26 },
          1700: { slidesPerView: 4, spaceBetween: 30 },
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
    <section className="ul-reviews overflow-hidden">
      <div className="ul-section-heading text-center justify-content-center">
        <div>
          <span className="ul-section-sub-title">Customer Reviews</span>
          <h2 className="ul-section-title">What Our Customers Are Saying</h2>
          <p className="ul-reviews-heading-descr">Trusted by thousands of customers across Ghana</p>
        </div>
      </div>

      <div ref={sliderRef} className="ul-reviews-slider swiper">
        <div className="swiper-wrapper">
          {reviews.map((r, i) => (
            <div className="swiper-slide" key={i}>
              <div className="ul-review">
                <div className="ul-review-rating">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <i key={s} className={s <= r.rating ? 'flaticon-star' : 'flaticon-star-3'}></i>
                  ))}
                </div>
                <p className="ul-review-descr">{r.text}</p>
                <div className="ul-review-bottom">
                  <div className="ul-review-reviewer">
                    <div className="reviewer-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#8B7355', color: 'white', fontSize: '18px', fontWeight: 'bold', flexShrink: 0 }}>
                      {r.avatar}
                    </div>
                    <div>
                      <h3 className="reviewer-name">{r.name}</h3>
                      <span className="reviewer-role">{r.role}</span>
                    </div>
                  </div>
                  <div className="ul-review-icon"><i className="flaticon-left"></i></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
