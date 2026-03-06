import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

const convertOrderToJSON = (order: any) => ({
  ...order,
  totalAmount: Number(order.totalAmount),
  discountAmount: Number(order.discountAmount),
  items: order.items.map((i: any) => ({
    ...i,
    costPrice: Number(i.costPrice),
    sellingPrice: Number(i.sellingPrice),
    subtotal: Number(i.subtotal),
    product: i.product ? {
      ...i.product,
      sellingPrice: Number(i.product.sellingPrice),
      costPrice: Number(i.product.costPrice),
      originalPrice: Number(i.product.originalPrice),
    } : null,
  })),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: { items: { include: { product: true } } },
    });
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(convertOrderToJSON(order));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const allowed = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (status && !allowed.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { ...(status && { status }) },
      include: { items: { include: { product: true } } },
    });

    return NextResponse.json(convertOrderToJSON(order));
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.order.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}
