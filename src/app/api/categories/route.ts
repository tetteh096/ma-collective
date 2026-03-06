import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });
  // Return both keys for backwards compatibility.
  return NextResponse.json({ items: categories, categories }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slug = (body.slug ?? body.name)
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const category = await prisma.category.create({
      data: {
        name: body.name, slug,
        imageUrl:    body.imageUrl    ?? null,
        description: body.description ?? null,
        sortOrder:   body.sortOrder   ?? 0,
      },
    });
    return NextResponse.json({ category }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
