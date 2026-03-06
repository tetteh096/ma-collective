import type { Metadata } from 'next';
import Script from 'next/script';
import Providers from '@/components/Providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ayekwa Collective — Dressed for Work, Life & Every Moment',
  description:
    'Ayekwa Collective offers real, wearable fashion for women — from office-ready looks to weekend outings and everyday essentials. Shop quality clothing designed for how you actually live.',
  keywords: 'women clothing Ghana, workwear Accra, everyday fashion, casual wear, outfits Ghana, ladies fashion',
  openGraph: {
    title: 'Ayekwa Collective',
    description: 'Real clothes for work, outings & everyday life.',
    locale: 'en_GH',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="stylesheet" href="/assets/icon/flaticon_glamer.css" />
        <link rel="stylesheet" href="/assets/vendor/bootstrap/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/vendor/splide/splide.min.css" />
        <link rel="stylesheet" href="/assets/vendor/swiper/swiper-bundle.min.css" />
        <link rel="stylesheet" href="/assets/vendor/slim-select/slimselect.css" />
        <link rel="stylesheet" href="/assets/vendor/animate-wow/animate.min.css" />
        <link rel="stylesheet" href="/assets/css/style.css" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
        {/* Load all vendor scripts SEQUENTIALLY so main.js always runs after deps */}
        <Script
          id="vendor-chain"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function loadSeq(scripts, i) {
                if (i >= scripts.length) {
                  // All scripts loaded — fire DOMContentLoaded so main.js listeners run
                  document.dispatchEvent(new Event('DOMContentLoaded'));
                  return;
                }
                var s = document.createElement('script');
                s.src = scripts[i];
                s.onload = function() { loadSeq(scripts, i + 1); };
                s.onerror = function() { loadSeq(scripts, i + 1); };
                document.body.appendChild(s);
              })([
                '/assets/vendor/bootstrap/bootstrap.bundle.min.js',
                '/assets/vendor/splide/splide.min.js',
                '/assets/vendor/splide/splide-extension-auto-scroll.min.js',
                '/assets/vendor/swiper/swiper-bundle.min.js',
                '/assets/vendor/slim-select/slimselect.min.js',
                '/assets/vendor/animate-wow/wow.min.js',
                '/assets/vendor/splittype/index.min.js',
                '/assets/vendor/mixitup/mixitup.min.js',
                '/assets/vendor/fslightbox/fslightbox.js',
                '/assets/js/main.js',
                '/assets/js/countdown.js'
              ], 0);
            `,
          }}
        />
      </body>
    </html>
  );
}
