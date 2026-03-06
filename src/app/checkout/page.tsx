'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import LocationPicker from '@/components/LocationPicker';

const PAYMENT_METHODS = [
  { id: 'mtn',       label: 'MTN Mobile Money',    icon: '📱' },
  { id: 'vodafone',  label: 'Vodafone Cash',        icon: '📲' },
  { id: 'airteltigo',label: 'AirtelTigo Money',     icon: '💳' },
  { id: 'card',      label: 'Visa / Mastercard',    icon: '💳' },
];

const DELIVERY_FEE = 80; // flat placeholder shown to customer; actual rider fee may vary

interface AppliedCoupon {
  id: number;
  code: string;
  description: string | null;
  discountType: string;
  discountValue: number;
  discountAmount: number;
}

export default function CheckoutPage() {
  const { items, total, clear } = useCart();

  // ── Fulfillment ──────────────────────────────────────────────────────────────
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('delivery');

  // ── Contact form ─────────────────────────────────────────────────────────────
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', area: '', landmark: '', houseNumber: '', notes: '',
  });

  // ── Payment ──────────────────────────────────────────────────────────────────
  const [paymentMethod, setPaymentMethod] = useState('mtn');
  const [momoNumber,    setMomoNumber]    = useState('');

  // ── Coupon ───────────────────────────────────────────────────────────────────
  const [couponCode,     setCouponCode]     = useState('');
  const [couponApplying, setCouponApplying] = useState(false);
  const [couponError,    setCouponError]    = useState<string | null>(null);
  const [appliedCoupon,  setAppliedCoupon]  = useState<AppliedCoupon | null>(null);
  const couponInputRef = useRef<HTMLInputElement>(null);

  // ── Order state ──────────────────────────────────────────────────────────────
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  // ── Totals ───────────────────────────────────────────────────────────────────
  const deliveryFee    = fulfillment === 'pickup' ? 0 : DELIVERY_FEE;
  const discountAmount = appliedCoupon?.discountAmount ?? 0;
  const grandTotal     = Math.max(0, total + deliveryFee - discountAmount);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  // ── Coupon validation ────────────────────────────────────────────────────────
  async function handleApplyCoupon() {
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      setCouponError('Enter a coupon code first.');
      couponInputRef.current?.focus();
      return;
    }
    setCouponApplying(true);
    setCouponError(null);
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(code)}&subtotal=${total}`);
      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon(data.coupon as AppliedCoupon);
        setCouponError(null);
      } else {
        setAppliedCoupon(null);
        setCouponError(data.reason ?? 'Invalid coupon code.');
      }
    } catch {
      setCouponError('Could not check coupon. Please try again.');
    } finally {
      setCouponApplying(false);
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError(null);
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const customerName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();

      const deliveryParts = fulfillment === 'delivery'
        ? [
            form.area        && `Area: ${form.area}`,
            form.houseNumber && `House/Building: ${form.houseNumber}`,
            form.address     && `Street: ${form.address}`,
            form.landmark    && `Landmark: ${form.landmark}`,
          ].filter(Boolean)
        : [];

      const momoPart = (paymentMethod === 'mtn' || paymentMethod === 'vodafone' || paymentMethod === 'airteltigo') && momoNumber
        ? `MoMo: ${momoNumber}`
        : null;
      const notesPart = form.notes ? `Notes: ${form.notes}` : null;

      const allParts = [...deliveryParts, momoPart, notesPart].filter(Boolean);
      const notes    = allParts.length > 0 ? allParts.join(' | ') : undefined;

      const payLabel =
        paymentMethod === 'mtn'        ? 'MTN Mobile Money'    :
        paymentMethod === 'vodafone'   ? 'Vodafone Cash'       :
        paymentMethod === 'airteltigo' ? 'AirtelTigo Money'    :
                                          'Visa / Mastercard';

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName:    customerName || undefined,
          customerEmail:   form.email?.trim() || undefined,
          customerPhone:   form.phone?.trim() || undefined,
          cartSubtotal:    total,
          totalAmount:     grandTotal,
          discountAmount:  discountAmount,
          couponCode:      appliedCoupon?.code ?? undefined,
          fulfillmentType: fulfillment,
          paymentMethod:   payLabel,
          notes,
          items: items.map((item) => ({
            productId:    /^\d+$/.test(String(item.id)) ? Number(item.id) : null,
            productName:  item.name,
            quantity:     item.quantity,
            costPrice:    item.price,
            sellingPrice: item.price,
          })),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Order failed (${res.status})`);
      }
      clear();
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not place order. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── Success screen ───────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <main style={{ padding: '80px 0 120px' }}>
        <div className="ul-container text-center">
          <div style={{ maxWidth: 480, margin: '0 auto', background: '#fff', borderRadius: 16, padding: 48, boxShadow: '0 4px 24px rgba(0,0,0,.08)' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontWeight: 800, marginBottom: 12 }}>Order Placed!</h2>
            <p style={{ color: '#666', lineHeight: 1.7, marginBottom: 8 }}>
              Thank you, <strong>{form.firstName}</strong>! Your order has been received.
              {form.email && <> We&apos;ll send a confirmation to <strong>{form.email}</strong>.</>}
            </p>
            {fulfillment === 'pickup' ? (
              <p style={{ color: '#888', fontSize: 14 }}>
                You can collect your order from our store. We&apos;ll be in touch shortly.
              </p>
            ) : (
              <p style={{ color: '#888', fontSize: 14 }}>
                Your order will be dispatched via a third-party rider. Estimated delivery: 1–3 business days.
              </p>
            )}
            <div style={{ marginTop: 32, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/" style={{ padding: '12px 28px', background: '#e85d04', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>
                Back to Home
              </Link>
              <Link href="/shop" style={{ padding: '12px 28px', background: '#f5f5f5', color: '#333', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ── Checkout form ────────────────────────────────────────────────────────────
  return (
    <main>
      <div style={{ background: '#f8f4f0', padding: '28px 0' }}>
        <div className="ul-container">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item"><Link href="/">Home</Link></li>
            <li className="breadcrumb-item"><Link href="/cart">Cart</Link></li>
            <li className="breadcrumb-item active">Checkout</li>
          </ol>
        </div>
      </div>

      <div style={{ padding: '56px 0 80px' }}>
        <div className="ul-container">
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 40 }}>Checkout</h1>

          {items.length === 0 ? (
            <div className="text-center py-5">
              <p style={{ color: '#888' }}>Your cart is empty.</p>
              <Link href="/shop" style={{ display: 'inline-block', marginTop: 16, padding: '12px 28px', background: '#e85d04', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>
                Browse Products
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="row g-5">

                {/* ── Left column ──────────────────────────────────────────── */}
                <div className="col-lg-7">

                  {/* ── Step 1: Fulfillment type ─────────────────────────── */}
                  <div style={cardStyle}>
                    <h5 style={sectionTitle}>How do you want to receive your order?</h5>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      {(['delivery', 'pickup'] as const).map((type) => {
                        const active = fulfillment === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            onClick={() => setFulfillment(type)}
                            style={{
                              border: `2px solid ${active ? '#e85d04' : '#e0e0e0'}`,
                              borderRadius: 12,
                              background: active ? '#fef3ec' : '#fafafa',
                              padding: '16px 12px',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all .15s',
                            }}
                          >
                            <div style={{ fontSize: 28, marginBottom: 6 }}>{type === 'delivery' ? '🛵' : '🏪'}</div>
                            <div style={{ fontWeight: 700, fontSize: 14, color: active ? '#e85d04' : '#333' }}>
                              {type === 'delivery' ? 'Delivery' : 'Pick-up in store'}
                            </div>
                            <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
                              {type === 'delivery'
                                ? `+GH₵${DELIVERY_FEE.toFixed(2)} rider fee`
                                : 'Free – collect yourself'}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {fulfillment === 'delivery' && (
                      <p style={{ marginTop: 12, marginBottom: 0, fontSize: 13, color: '#666', background: '#fff7ed', borderRadius: 8, padding: '10px 14px', border: '1px solid #fed7aa' }}>
                        🛵 Delivery is handled by a third-party rider service. The fee shown is an estimate and may vary by area. You will be contacted to confirm your delivery slot.
                      </p>
                    )}
                    {fulfillment === 'pickup' && (
                      <p style={{ marginTop: 12, marginBottom: 0, fontSize: 13, color: '#065f46', background: '#ecfdf5', borderRadius: 8, padding: '10px 14px', border: '1px solid #6ee7b7' }}>
                        🏪 You can collect your order from our store: 21 Oxford Street, Osu, Accra. We&apos;ll call you when it&apos;s ready.
                      </p>
                    )}
                  </div>

                  {/* ── Step 2: Contact + Address ────────────────────────── */}
                  <div style={cardStyle}>
                    <h5 style={sectionTitle}>Your Details</h5>
                    <div className="row g-3">
                      <div className="col-6">
                        <label style={labelStyle}>First Name *</label>
                        <input required name="firstName" value={form.firstName} onChange={handleChange} style={inputStyle} placeholder="Kwame" />
                      </div>
                      <div className="col-6">
                        <label style={labelStyle}>Last Name *</label>
                        <input required name="lastName" value={form.lastName} onChange={handleChange} style={inputStyle} placeholder="Asante" />
                      </div>
                      <div className="col-12">
                        <label style={labelStyle}>Email Address *</label>
                        <input required type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle} placeholder="kwame@example.com" />
                      </div>
                      <div className="col-12">
                        <label style={labelStyle}>Phone Number *</label>
                        <input required name="phone" value={form.phone} onChange={handleChange} style={inputStyle} placeholder="+233 244 000 000" />
                      </div>

                      {/* Address – only for delivery */}
                      {fulfillment === 'delivery' && (
                        <div className="col-12">
                          <LocationPicker
                            address={form.address}
                            area={form.area}
                            landmark={form.landmark}
                            houseNumber={form.houseNumber}
                            onAddressChange={(val) => setForm((f) => ({ ...f, address: val }))}
                            onAreaChange={(val)    => setForm((f) => ({ ...f, area: val }))}
                            onLandmarkChange={(val) => setForm((f) => ({ ...f, landmark: val }))}
                            onHouseNumberChange={(val) => setForm((f) => ({ ...f, houseNumber: val }))}
                          />
                        </div>
                      )}

                      <div className="col-12">
                        <label style={labelStyle}>Order Notes (optional)</label>
                        <textarea name="notes" value={form.notes} onChange={handleChange}
                          style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
                          placeholder={fulfillment === 'pickup' ? 'Anything you want us to know before pickup?' : 'Any special delivery instructions?'} />
                      </div>
                    </div>
                  </div>

                  {/* ── Step 3: Payment ──────────────────────────────────── */}
                  <div style={cardStyle}>
                    <h5 style={sectionTitle}>Payment Method</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                      {PAYMENT_METHODS.map((m) => (
                        <label key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderRadius: 8, border: paymentMethod === m.id ? '2px solid #e85d04' : '1px solid #e0e0e0', cursor: 'pointer', background: paymentMethod === m.id ? '#fef3ec' : '#fff' }}>
                          <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={(e) => setPaymentMethod(e.target.value)} style={{ accentColor: '#e85d04' }} />
                          <span style={{ fontSize: 18 }}>{m.icon}</span>
                          <span style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</span>
                        </label>
                      ))}
                    </div>
                    {(paymentMethod === 'mtn' || paymentMethod === 'vodafone' || paymentMethod === 'airteltigo') && (
                      <div>
                        <label style={labelStyle}>Mobile Money Number *</label>
                        <input required value={momoNumber} onChange={(e) => setMomoNumber(e.target.value)} style={inputStyle} placeholder="0244 000 000" />
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Right column: Order Summary ────────────────────────── */}
                <div className="col-lg-5">
                  <div style={{ background: '#fff', borderRadius: 12, padding: 28, boxShadow: '0 2px 16px rgba(0,0,0,.06)', position: 'sticky', top: 100 }}>
                    <h5 style={{ fontWeight: 700, marginBottom: 20 }}>Order Summary</h5>

                    {/* Cart items */}
                    <div style={{ maxHeight: 280, overflowY: 'auto', marginBottom: 20 }}>
                      {items.map((item) => (
                        <div key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                          <div style={{ position: 'relative', width: 56, height: 56 }}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.image} alt={item.name} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 6 }} />
                            <span style={{ position: 'absolute', top: -6, right: -6, background: '#e85d04', color: '#fff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700 }}>
                              {item.quantity}
                            </span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: '#222' }}>{item.name}</p>
                            {item.size && <p style={{ margin: '2px 0 0', fontSize: 11, color: '#aaa' }}>Size: {item.size}</p>}
                          </div>
                          <span style={{ fontWeight: 700, fontSize: 13, color: '#e85d04' }}>GH₵{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Coupon input */}
                    <div style={{ marginBottom: 16 }}>
                      {appliedCoupon ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#ecfdf5', border: '1px solid #6ee7b7', borderRadius: 10 }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: 13, color: '#065f46' }}>
                              🏷️ <strong>{appliedCoupon.code}</strong>
                              {appliedCoupon.description && <span style={{ fontWeight: 400 }}> — {appliedCoupon.description}</span>}
                            </div>
                            <div style={{ fontSize: 12, color: '#047857', marginTop: 2 }}>
                              {appliedCoupon.discountType === 'percentage'
                                ? `${appliedCoupon.discountValue}% off`
                                : `GH₵${appliedCoupon.discountValue.toFixed(2)} off`}
                              {' '}(saves GH₵{appliedCoupon.discountAmount.toFixed(2)})
                            </div>
                          </div>
                          <button type="button" onClick={handleRemoveCoupon} style={{ border: 'none', background: 'transparent', fontSize: 18, cursor: 'pointer', color: '#065f46', lineHeight: 1 }} aria-label="Remove coupon">×</button>
                        </div>
                      ) : (
                        <>
                          <label style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, display: 'block', color: '#555' }}>Have a coupon code?</label>
                          <div style={{ display: 'flex', gap: 8 }}>
                            <input
                              ref={couponInputRef}
                              type="text"
                              value={couponCode}
                              onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(null); }}
                              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyCoupon(); } }}
                              placeholder="Enter code"
                              style={{ ...inputStyle, flex: 1, textTransform: 'uppercase' }}
                            />
                            <button
                              type="button"
                              onClick={handleApplyCoupon}
                              disabled={couponApplying}
                              style={{ padding: '10px 16px', background: '#222', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: couponApplying ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', opacity: couponApplying ? 0.6 : 1 }}
                            >
                              {couponApplying ? '…' : 'Apply'}
                            </button>
                          </div>
                          {couponError && (
                            <p style={{ margin: '6px 0 0', fontSize: 12, color: '#b91c1c' }}>{couponError}</p>
                          )}
                        </>
                      )}
                    </div>

                    {/* Totals */}
                    <div style={{ borderTop: '1px solid #eee', paddingTop: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#666', marginBottom: 10 }}>
                        <span>Subtotal</span><span>GH₵{total.toFixed(2)}</span>
                      </div>

                      {appliedCoupon && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#065f46', marginBottom: 10 }}>
                          <span>Discount ({appliedCoupon.code})</span>
                          <span>−GH₵{discountAmount.toFixed(2)}</span>
                        </div>
                      )}

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#666', marginBottom: 16 }}>
                        <span>Delivery</span>
                        {fulfillment === 'pickup' ? (
                          <span style={{ color: '#2e7d32', fontWeight: 600 }}>Free (pick-up)</span>
                        ) : (
                          <span>GH₵{deliveryFee.toFixed(2)} <span style={{ fontSize: 11, color: '#aaa' }}>(est.)</span></span>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: 18 }}>
                        <span>Total</span>
                        <span style={{ color: '#e85d04' }}>GH₵{grandTotal.toFixed(2)}</span>
                      </div>
                    </div>

                    {error && (
                      <p style={{ marginTop: 16, padding: 12, background: '#fef2f2', color: '#b91c1c', borderRadius: 8, fontSize: 14 }}>
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      style={{ marginTop: 24, width: '100%', padding: '14px 0', background: loading ? '#aaa' : '#e85d04', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                      {loading ? 'Placing Order…' : `Place Order — GH₵${grandTotal.toFixed(2)}`}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 12 }}>
                      🔒 Secure checkout — your data is protected
                    </p>
                  </div>
                </div>

              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 12, padding: 32,
  boxShadow: '0 2px 16px rgba(0,0,0,.06)', marginBottom: 24,
};
const sectionTitle: React.CSSProperties = { fontWeight: 700, marginBottom: 20 };
const labelStyle: React.CSSProperties   = { fontSize: 13, fontWeight: 600, marginBottom: 6, display: 'block' };
const inputStyle: React.CSSProperties  = {
  width: '100%', padding: '10px 14px', border: '1px solid #e0e0e0',
  borderRadius: 8, fontSize: 14, outline: 'none', background: '#fafafa',
};
