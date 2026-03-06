'use client';
import { usePathname } from 'next/navigation';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import CartModal from '@/components/CartModal';
import WishlistModal from '@/components/WishlistModal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';
import Preloader from '@/components/Preloader';
import WhatsAppSupport from '@/components/WhatsAppSupport';
import ScrollProgressBar from '@/components/ScrollProgressBar';

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/auth');
  
  // Admin and auth pages don't need storefront UI
  if (isAdmin) {
    return (
      <CartProvider>
        <WishlistProvider>
          {children}
        </WishlistProvider>
      </CartProvider>
    );
  }

  // Storefront pages: render full UI
  return (
    <CartProvider>
      <WishlistProvider>
        <ScrollProgressBar />
        <Preloader />
        <Sidebar />
        <Header />
        {children}
        <Footer />
        <CartModal />
        <WishlistModal />
        <WhatsAppSupport />
      </WishlistProvider>
    </CartProvider>
  );
}
