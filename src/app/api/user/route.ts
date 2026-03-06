import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

// GET user profile
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const user = await prisma.customer.findUnique({
      where: { id: parseInt(userId) },
      select: {
        id: true,
        uuid: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        address: true,
        totalOrders: true,
        totalSpent: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, phone, city, address } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const user = await prisma.customer.update({
      where: { id: parseInt(userId) },
      data: {
        ...(name && { name }),
        ...(phone && { phone }),
        ...(city && { city }),
        ...(address && { address }),
      },
      select: {
        id: true,
        uuid: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        address: true,
      },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
