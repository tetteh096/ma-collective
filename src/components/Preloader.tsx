'use client';
import { useEffect } from 'react';

export default function Preloader() {
  useEffect(() => {
    const hide = () => {
      const el = document.getElementById('preloader');
      if (el) el.style.display = 'none';
      document.body.style.overflow = '';
      document.body.style.position = 'static';
    };
    // Hide immediately when React hydrates
    hide();
    // Hard fallback: force-hide after 3 seconds no matter what
    const t = setTimeout(hide, 3000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="preloader" id="preloader">
      <div className="loader"></div>
    </div>
  );
}
