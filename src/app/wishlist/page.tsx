'use client';

import Link from 'next/link';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

export default function WishlistPage() {
  const { items, remove } = useWishlist();
  const { addItem, openCart } = useCart();

  function moveToCart(item: typeof items[0]) {
    addItem({ id: item.id, slug: item.slug, name: item.name, price: item.price, image: item.image, quantity: 1 });
    remove(item.id);
    openCart();
  }

  return (
    <>
      <main>
        <div style={{ background: '#f8f4f0', padding: '28px 0' }}>
          <div className="ul-container">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link href="/">Home</Link></li>
              <li className="breadcrumb-item active">Wishlist</li>
            </ol>
          </div>
        </div>

        <div style={{ padding: '56px 0 80px' }}>
          <div className="ul-container">
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 40 }}>My Wishlist ({items.length})</h1>

            {items.length === 0 ? (
              <div className="text-center py-5">
                <i className="flaticon-heart" style={{ fontSize: 64, color: '#ddd' }} />
                <h4 style={{ marginTop: 24, color: '#555' }}>Your wishlist is empty</h4>
                <Link href="/shop" style={{ display: 'inline-block', marginTop: 20, padding: '12px 32px', background: '#e85d04', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="row g-4">
                {items.map((item) => (
                  <div key={item.id} className="col-sm-6 col-lg-4 col-xl-3">
                    <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.06)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ position: 'relative', background: '#f5f5f5' }}>
                        <Link href={`/shop/${item.slug}`}>
                          <img src={item.image} alt={item.name} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }} />
                        </Link>
                        <button onClick={() => remove(item.id)} aria-label="Remove from wishlist"
                          style={{ position: 'absolute', top: 10, right: 10, background: '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,.12)', color: '#888' }}>
                          <i className="flaticon-close" style={{ fontSize: 10 }} />
                        </button>
                      </div>
                      <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <Link href={`/shop/${item.slug}`} style={{ fontWeight: 600, fontSize: 15, color: '#222', textDecoration: 'none', marginBottom: 8, display: 'block' }}>
                          {item.name}
                        </Link>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 16 }}>
                          <span style={{ fontWeight: 700, color: '#e85d04', fontSize: 16 }}>GH₵{item.price.toFixed(2)}</span>
                          {item.originalPrice && (
                            <span style={{ textDecoration: 'line-through', color: '#aaa', fontSize: 13 }}>GH₵{item.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                        <button onClick={() => moveToCart(item)}
                          style={{ marginTop: 'auto', background: '#222', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 600, fontSize: 13, cursor: 'pointer', width: '100%' }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#e85d04')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = '#222')}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
