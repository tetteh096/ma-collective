import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

/** GET: public (active only) or all when ?all=1 for admin */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all') === '1';

    const where = all ? {} : { isActive: true };

    const items = await prisma.announcement.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ items }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('GET /api/announcements', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/** POST: create announcement (admin) */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, sortOrder = 0, isActive = true } = body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const created = await prisma.announcement.create({
      data: {
        message: message.trim(),
        sortOrder: Number(sortOrder) || 0,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error('POST /api/announcements', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
