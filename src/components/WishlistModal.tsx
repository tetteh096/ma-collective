'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatGHSRaw } from '@/lib/currency';

export default function WishlistModal() {
  const { items, isOpen, closeWishlist, remove } = useWishlist();
  const { addItem, openCart } = useCart();
  
  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  function moveToCart(item: typeof items[0]) {
    addItem({
      id: item.id,
      slug: item.slug,
      name: item.name,
      price: item.price,
      costPrice: item.costPrice,
      image: item.image,
      quantity: 1,
    });
    remove(item.id);
    closeWishlist();
    openCart();
  }

  return (
    <>
      <div
        className={`ul-sidebar-overlay${isOpen ? ' active' : ''}`}
        onClick={closeWishlist}
      />
      <aside className={`ul-sidebar ul-wishlist-sidebar${isOpen ? ' active' : ''}`}>
        <div className="ul-sidebar-header">
          <h5 className="ul-sidebar-title">Wishlist ({items.length})</h5>
          <button className="ul-sidebar-closer" onClick={closeWishlist}>
            <i className="flaticon-close" />
          </button>
        </div>

        <div className="ul-sidebar-body">
          {items.length === 0 ? (
            <div className="text-center py-5">
              <i className="flaticon-heart" style={{ fontSize: 48, opacity: 0.3 }} />
              <p className="mt-3 text-muted">Your wishlist is empty</p>
              <button className="ul-btn ul-btn-primary mt-3" onClick={closeWishlist}>
                Browse Products
              </button>
            </div>
          ) : (
            <ul className="ul-cart-items">
              {items.map((item) => (
                <li key={item.id} className="ul-cart-item">
                  <div className="ul-cart-item-img">
                    <img src={item.image} alt={item.name} width={80} height={80} style={{ objectFit: 'cover', borderRadius: 8 }} />
                  </div>
                  <div className="ul-cart-item-info">
                    <Link href={`/shop/${item.slug}`} onClick={closeWishlist} className="ul-cart-item-name">
                      {item.name}
                    </Link>
                    <div className="ul-cart-item-bottom">
                      <span className="ul-cart-item-price">{formatGHSRaw(item.price)}</span>
                    </div>
                    <button
                      className="ul-btn ul-btn-sm ul-btn-primary mt-2"
                      onClick={() => moveToCart(item)}
                    >
                      Move to Cart
                    </button>
                  </div>
                  <button
                    className="ul-cart-item-remove"
                    onClick={() => remove(item.id)}
                    aria-label="Remove"
                  >
                    <i className="flaticon-close" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="ul-sidebar-footer">
            <Link href="/wishlist" className="ul-btn ul-btn-outline w-100" onClick={closeWishlist}>
              View Full Wishlist
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
