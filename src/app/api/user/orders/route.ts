import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET user orders
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const orders = await prisma.order.findMany({
      where: { customerId: parseInt(userId) },
      include: {
        items: {
          select: {
            id: true,
            productName: true,
            quantity: true,
            sellingPrice: true,
            subtotal: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format decimal values
    const formattedOrders = orders.map((order) => ({
      ...order,
      totalAmount: parseFloat(order.totalAmount.toString()),
      discountAmount: parseFloat(order.discountAmount.toString()),
      items: order.items.map((item) => ({
        ...item,
        sellingPrice: parseFloat(item.sellingPrice.toString()),
        subtotal: parseFloat(item.subtotal.toString()),
      })),
    }));

    return NextResponse.json({ orders: formattedOrders }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
