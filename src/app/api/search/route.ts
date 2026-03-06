import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q        = searchParams.get('q') ?? '';
  const limit    = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '12')));
  const category = searchParams.get('category') ?? undefined;

  if (!q.trim()) return NextResponse.json({ items: [], total: 0 });

  const where = {
    ...(category && { category: { equals: category, mode: 'insensitive' as const } }),
    OR: [
      { name:        { contains: q, mode: 'insensitive' as const } },
      { description: { contains: q, mode: 'insensitive' as const } },
      { brand:       { contains: q, mode: 'insensitive' as const } },
      { sku:         { contains: q, mode: 'insensitive' as const } },
    ],
  };

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where, take: limit,
      orderBy: { rating: 'desc' },
      select: {
        id: true, uuid: true, name: true, slug: true,
        sellingPrice: true, originalPrice: true, currency: true,
        category: true, imageUrl: true, inStock: true,
        rating: true, reviewsCount: true, createdAt: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  // Convert Decimal fields to numbers
  const itemsWithNumbers = items.map(p => ({
    ...p,
    sellingPrice: Number(p.sellingPrice),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
  }));

  return NextResponse.json({ items: itemsWithNumbers, total });
}
