import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = { isFeatured: true };
    if (category) where.category = category;

    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        uuid: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        gallery: true,
        sellingPrice: true,
        originalPrice: true,
        discountPercent: true,
        isFeatured: true,
        isOnSale: true,
        inStock: true,
        rating: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Convert Decimal fields to numbers for JSON serialization
    const productsWithNumbers = products.map(p => ({
      ...p,
      sellingPrice: Number(p.sellingPrice),
      originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
    }));

    return NextResponse.json({ products: productsWithNumbers }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productIds } = body;

    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json(
        { error: 'Product IDs array required' },
        { status: 400 }
      );
    }

    // Mark products as featured
    const products = await prisma.product.updateMany({
      where: { id: { in: productIds } },
      data: { isFeatured: true },
    });

    return NextResponse.json({ message: 'Products marked as featured', products }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
