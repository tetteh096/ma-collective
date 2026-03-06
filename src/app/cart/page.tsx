'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { items, total, removeItem, updateQty, clear } = useCart();
  const delivery = total >= 500 ? 0 : 80;
  const grandTotal = total + delivery;

  return (
    <>
      <main>
        <div style={{ background: '#f8f4f0', padding: '28px 0' }}>
          <div className="ul-container">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link href="/">Home</Link></li>
              <li className="breadcrumb-item active">Cart</li>
            </ol>
          </div>
        </div>

        <div style={{ padding: '56px 0 80px' }}>
          <div className="ul-container">
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 40 }}>Shopping Cart</h1>

            {items.length === 0 ? (
              <div className="text-center py-5">
                <i className="flaticon-shopping-bag" style={{ fontSize: 64, color: '#ddd' }} />
                <h4 style={{ marginTop: 24, color: '#555' }}>Your cart is empty</h4>
                <Link href="/shop" className="ul-btn ul-btn-primary" style={{ display: 'inline-block', marginTop: 20, padding: '12px 32px', background: '#e85d04', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="row g-5">
                {/* Cart Table */}
                <div className="col-lg-8">
                  <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,.06)', background: '#fff' }}>
                    {/* Header */}
                    <div className="d-none d-md-grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr auto', padding: '16px 24px', background: '#f8f8f8', fontWeight: 600, fontSize: 13, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, gap: 16 }}>
                      <span>Product</span>
                      <span>Price</span>
                      <span>Qty</span>
                      <span>Total</span>
                      <span />
                    </div>

                    {items.map((item) => {
                      const key = `${item.id}-${item.size ?? ''}-${item.color ?? ''}`;
                      return (
                        <div key={key} style={{ padding: '20px 24px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
                          {/* Image */}
                          <div style={{ width: 80, height: 80, borderRadius: 8, overflow: 'hidden', background: '#f5f5f5', flexShrink: 0 }}>
                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          {/* Name */}
                          <div style={{ flex: '2 1 160px' }}>
                            <Link href={`/shop/${item.slug}`} style={{ fontWeight: 600, color: '#222', textDecoration: 'none', fontSize: 15 }}>
                              {item.name}
                            </Link>
                            {item.size && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#aaa' }}>Size: {item.size}</p>}
                            {item.color && <p style={{ margin: '2px 0 0', fontSize: 12, color: '#aaa' }}>Color: {item.color}</p>}
                          </div>
                          {/* Price */}
                          <div style={{ flex: '1 0 80px', color: '#555', fontSize: 14 }}>GH₵{item.price.toFixed(2)}</div>
                          {/* Qty */}
                          <div style={{ flex: '1 0 100px', display: 'flex', alignItems: 'center', border: '1px solid #eee', borderRadius: 8, overflow: 'hidden', width: 'fit-content' }}>
                            <button onClick={() => updateQty(item.id, item.quantity - 1, item.size, item.color)} style={{ width: 32, height: 36, background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: 16 }}>−</button>
                            <span style={{ width: 36, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{item.quantity}</span>
                            <button onClick={() => updateQty(item.id, item.quantity + 1, item.size, item.color)} style={{ width: 32, height: 36, background: '#f5f5f5', border: 'none', cursor: 'pointer', fontSize: 16 }}>+</button>
                          </div>
                          {/* Total */}
                          <div style={{ flex: '1 0 90px', fontWeight: 700, color: '#e85d04' }}>GH₵{(item.price * item.quantity).toFixed(2)}</div>
                          {/* Remove */}
                          <button onClick={() => removeItem(item.id, item.size, item.color)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', padding: 4 }} aria-label="Remove">
                            <i className="flaticon-close" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-4 flex-wrap gap-3">
                    <Link href="/shop" style={{ color: '#e85d04', fontWeight: 600, textDecoration: 'none', fontSize: 14 }}>
                      ← Continue Shopping
                    </Link>
                    <button onClick={clear} style={{ background: 'none', border: '1px solid #ddd', borderRadius: 8, padding: '8px 20px', fontSize: 13, cursor: 'pointer', color: '#888' }}>
                      Clear Cart
                    </button>
                  </div>
                </div>

                {/* Totals */}
                <div className="col-lg-4">
                  <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 16px rgba(0,0,0,.06)', position: 'sticky', top: 100 }}>
                    <h5 style={{ fontWeight: 700, marginBottom: 24 }}>Order Summary</h5>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, color: '#555' }}>
                      <span>Subtotal</span>
                      <span>GH₵{total.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 14, color: '#555' }}>
                      <span>Delivery</span>
                      <span style={{ color: delivery === 0 ? '#2e7d32' : undefined }}>{delivery === 0 ? 'Free' : `GH₵${delivery.toFixed(2)}`}</span>
                    </div>
                    {delivery > 0 && (
                      <p style={{ fontSize: 12, color: '#e85d04', marginBottom: 12 }}>
                        Add GH₵{(500 - total).toFixed(2)} more for free delivery!
                      </p>
                    )}
                    <div style={{ borderTop: '1px solid #eee', paddingTop: 16, marginTop: 8, display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 17 }}>
                      <span>Total</span>
                      <span style={{ color: '#e85d04' }}>GH₵{grandTotal.toFixed(2)}</span>
                    </div>

                    <Link
                      href="/checkout"
                      style={{ display: 'block', background: '#e85d04', color: '#fff', textAlign: 'center', borderRadius: 8, padding: '14px 0', fontWeight: 700, fontSize: 15, textDecoration: 'none', marginTop: 24 }}
                    >
                      Proceed to Checkout
                    </Link>

                    <div style={{ marginTop: 24, textAlign: 'center' }}>
                      <p style={{ fontSize: 12, color: '#aaa', marginBottom: 12 }}>Accepted payments</p>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                        {['MTN MoMo', 'Vodafone', 'AirtelTigo', 'Visa/MC'].map((m) => (
                          <span key={m} style={{ fontSize: 11, background: '#f5f5f5', padding: '4px 10px', borderRadius: 4, color: '#666' }}>{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
