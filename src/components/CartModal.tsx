'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatGHSRaw } from '@/lib/currency';

export default function CartModal() {
  const { items, isOpen, total, closeCart, removeItem, updateQty } = useCart();
  
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

  return (
    <>
      {/* Overlay */}
      <div
        className={`ul-sidebar-overlay${isOpen ? ' active' : ''}`}
        onClick={closeCart}
      />

      {/* Slide-in panel */}
      <aside className={`ul-sidebar ul-cart-sidebar${isOpen ? ' active' : ''}`}>
        <div className="ul-sidebar-header">
          <h5 className="ul-sidebar-title">Shopping Cart ({items.reduce((s, i) => s + i.quantity, 0)})</h5>
          <button className="ul-sidebar-closer" onClick={closeCart}>
            <i className="flaticon-close" />
          </button>
        </div>

        <div className="ul-sidebar-body">
          {items.length === 0 ? (
            <div className="text-center py-5">
              <i className="flaticon-shopping-bag" style={{ fontSize: 48, opacity: 0.3 }} />
              <p className="mt-3 text-muted">Your cart is empty</p>
              <button className="ul-btn ul-btn-primary mt-3" onClick={closeCart}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="ul-cart-items">
              {items.map((item) => {
                const key = `${item.id}-${item.size ?? ''}-${item.color ?? ''}`;
                return (
                  <li key={key} className="ul-cart-item">
                    <div className="ul-cart-item-img">
                      <img src={item.image} alt={item.name} width={80} height={80} style={{ objectFit: 'cover', borderRadius: 8 }} />
                    </div>
                    <div className="ul-cart-item-info">
                      <Link href={`/shop/${item.slug}`} onClick={closeCart} className="ul-cart-item-name">
                        {item.name}
                      </Link>
                      {item.size && <span className="ul-cart-item-meta">Size: {item.size}</span>}
                      {item.color && <span className="ul-cart-item-meta">Color: {item.color}</span>}
                      <div className="ul-cart-item-bottom">
                        <div className="ul-qty-control">
                          <button onClick={() => updateQty(item.id, item.quantity - 1, item.size, item.color)}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity + 1, item.size, item.color)}>+</button>
                        </div>
                        <span className="ul-cart-item-price">{formatGHSRaw(item.price)}</span>
                      </div>
                    </div>
                    <button
                      className="ul-cart-item-remove"
                      onClick={() => removeItem(item.id, item.size, item.color)}
                      aria-label="Remove"
                    >
                      <i className="flaticon-close" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="ul-sidebar-footer">
            <div className="ul-cart-subtotal">
              <span>Subtotal:</span>
              <strong>{formatGHSRaw(total)}</strong>
            </div>
            <div className="ul-cart-actions">
              <Link href="/cart" className="ul-btn ul-btn-outline w-100 mb-2" onClick={closeCart}>
                View Cart
              </Link>
              <Link href="/checkout" className="ul-btn ul-btn-primary w-100" onClick={closeCart}>
                Checkout
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
