import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id: Number(id) },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
    },
  });
  if (!customer)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...customer,
    totalSpent: Number(customer.totalSpent),
    orders: customer.orders.map((o) => ({
      ...o,
      totalAmount: Number(o.totalAmount),
      discountAmount: Number(o.discountAmount),
      items: o.items.map((i) => ({
        ...i,
        costPrice: Number(i.costPrice),
        sellingPrice: Number(i.sellingPrice),
        subtotal: Number(i.subtotal),
      })),
    })),
  });
}
