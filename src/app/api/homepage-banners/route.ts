import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const where: any = {};
    if (section) where.section = section;
    if (activeOnly) where.isActive = true;

    const banners = await prisma.homepageBanner.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json({ banners }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { section, title, description, imageUrl, linkUrl, sortOrder } = body;

    const banner = await prisma.homepageBanner.create({
      data: {
        section: section || 'new-arrivals',
        title,
        description,
        imageUrl,
        linkUrl,
        sortOrder: sortOrder || 0,
      },
    });

    return NextResponse.json({ banner }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
