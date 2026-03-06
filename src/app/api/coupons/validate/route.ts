import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

/** Public endpoint: validate a coupon code against an order subtotal.
 *  GET /api/coupons/validate?code=EASTER20&subtotal=450
 *  Returns:
 *    200 { valid: true, coupon: { id, code, discountType, discountValue, description, discountAmount } }
 *    200 { valid: false, reason: "..." }
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get('code') ?? '').trim().toUpperCase();
  const subtotal = Number(searchParams.get('subtotal') ?? '0');

  if (!code) {
    return NextResponse.json({ valid: false, reason: 'Please enter a coupon code.' });
  }

  const coupon = await prisma.coupon.findFirst({
    where: { code: { equals: code, mode: 'insensitive' } },
  });

  if (!coupon) {
    return NextResponse.json({ valid: false, reason: 'Coupon code not found.' });
  }
  if (!coupon.isActive) {
    return NextResponse.json({ valid: false, reason: 'This coupon is no longer active.' });
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ valid: false, reason: 'This coupon has expired.' });
  }
  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ valid: false, reason: 'This coupon has reached its usage limit.' });
  }
  if (coupon.minOrderAmount !== null && subtotal < Number(coupon.minOrderAmount)) {
    return NextResponse.json({
      valid: false,
      reason: `Minimum order of GH₵${Number(coupon.minOrderAmount).toFixed(2)} required for this coupon.`,
    });
  }

  const discountValue = Number(coupon.discountValue);
  let discountAmount = 0;
  if (coupon.discountType === 'percentage') {
    discountAmount = (subtotal * discountValue) / 100;
    if (coupon.maxDiscountAmount !== null) {
      discountAmount = Math.min(discountAmount, Number(coupon.maxDiscountAmount));
    }
  } else {
    discountAmount = discountValue;
  }
  discountAmount = Math.min(discountAmount, subtotal);

  return NextResponse.json({
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue,
      discountAmount: Math.round(discountAmount * 100) / 100,
    },
  });
}
