'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

export default function HeaderActions() {
  const { totalItems, openCart } = useCart();
  const { items: wishlistItems, openWishlist } = useWishlist();

  const handleCartClick = () => {
    console.log('Cart button clicked');
    openCart();
  };

  const handleWishlistClick = () => {
    console.log('Wishlist button clicked');
    openWishlist();
  };

  return (
    <div className="ul-header-actions">
      <button className="ul-header-mobile-search-opener d-xxl-none">
        <i className="flaticon-search-interface-symbol" />
      </button>
      <Link href="/login">
        <i className="flaticon-user" />
      </Link>
      <button className="ul-header-action-btn position-relative" onClick={handleWishlistClick} aria-label="Wishlist">
        <i className="flaticon-heart" />
        {wishlistItems.length > 0 && (
          <span className="ul-header-action-badge">{wishlistItems.length}</span>
        )}
      </button>
      <button className="ul-header-action-btn position-relative" onClick={openCart} aria-label="Cart">
        <i className="flaticon-shopping-bag" />
        {totalItems > 0 && (
          <span className="ul-header-action-badge">{totalItems}</span>
        )}
      </button>
    </div>
  );
}
