import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const where = activeOnly ? { isActive: true } : {};

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: { id: true, uuid: true, email: true, isActive: true, createdAt: true },
    });

    return NextResponse.json({ subscribers }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { message: 'Already subscribed', subscriber: existing },
          { status: 200 }
        );
      }
      // Reactivate if previously unsubscribed
      const reactivated = await prisma.newsletterSubscriber.update({
        where: { email },
        data: { isActive: true },
        select: { id: true, uuid: true, email: true, isActive: true },
      });
      return NextResponse.json(
        { message: 'Resubscribed successfully', subscriber: reactivated },
        { status: 200 }
      );
    }

    // Create new subscriber
    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email },
      select: { id: true, uuid: true, email: true, isActive: true },
    });

    return NextResponse.json(
      { message: 'Subscribed successfully', subscriber },
      { status: 201 }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
