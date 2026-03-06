import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const coupon = await prisma.coupon.findUnique({
    where: { id: Number(id) },
    include: { orders: { orderBy: { createdAt: "desc" }, take: 10 } },
  });
  if (!coupon) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({
    ...coupon,
    discountValue: Number(coupon.discountValue),
    minOrderAmount: coupon.minOrderAmount ? Number(coupon.minOrderAmount) : null,
    maxDiscountAmount: coupon.maxDiscountAmount ? Number(coupon.maxDiscountAmount) : null,
  });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await req.json();
    const updated = await prisma.coupon.update({
      where: { id: Number(id) },
      data: {
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.maxUses !== undefined && { maxUses: body.maxUses }),
        ...(body.expiresAt !== undefined && {
          expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        }),
      },
    });
    return NextResponse.json({
      ...updated,
      discountValue: Number(updated.discountValue),
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.coupon.delete({ where: { id: Number(id) } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
