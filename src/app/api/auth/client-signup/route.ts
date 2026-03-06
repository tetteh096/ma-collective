import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, city } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email required' }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.customer.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
    }

    // Create new user
    const user = await prisma.customer.create({
      data: {
        name,
        email,
        phone: phone || null,
        city: city || null,
        totalOrders: 0,
        totalSpent: '0',
      },
      select: { id: true, uuid: true, name: true, email: true, phone: true, city: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
