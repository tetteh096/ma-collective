'use client';

import { useEffect, useState, useRef } from 'react';

interface Announcement {
  id: number;
  message: string;
  sortOrder: number;
  isActive: boolean;
}

export default function AnnouncementBar() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [mounted, setMounted] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const splideRef = useRef<{ mount: (ext?: any) => void; destroy: () => void } | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/announcements')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data?.items) ? data.items : [];
        setItems(list);
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      });
    setMounted(true);
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!mounted || items.length === 0 || !sliderRef.current) return;

    const init = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Splide = (window as any).Splide;
      if (!Splide) return false;
      splideRef.current = new Splide(sliderRef.current, {
        arrows: false,
        pagination: false,
        type: 'loop',
        drag: 'free',
        focus: 'center',
        perPage: 9,
        autoWidth: true,
        gap: 15,
        autoScroll: {
          speed: 1.5,
        },
      });
      const Ext = (window as any).splide?.Extensions;
      if (Ext) splideRef.current?.mount(Ext);
      else splideRef.current?.mount();
      return true;
    };

    if (!init()) {
      const t = setInterval(() => {
        if (init()) clearInterval(t);
      }, 100);
      return () => {
        clearInterval(t);
        splideRef.current?.destroy();
        splideRef.current = null;
      };
    }

    return () => {
      splideRef.current?.destroy();
      splideRef.current = null;
    };
  }, [mounted, items.length]);

  if (items.length === 0) return null;

  return (
    <div className="ul-header-top">
      <div ref={sliderRef} className="ul-header-top-slider splide">
        <div className="splide__track">
          <ul className="splide__list">
            {items.map((a) => (
              <li key={a.id} className="splide__slide">
                <p className="ul-header-top-slider-item">{a.message}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
