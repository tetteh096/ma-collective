import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';

    const where = activeOnly ? { isActive: true } : {};

    const sales = await prisma.flashSale.findMany({
      where,
      include: {
        products: {
          include: {
            product: {
              select: {
                id: true,
                uuid: true,
                name: true,
                slug: true,
                imageUrl: true,
                sellingPrice: true,
                originalPrice: true,
              },
            },
          },
        },
      },
      orderBy: { startTime: 'desc' },
    });

    // Convert Decimal fields to numbers for JSON serialization
    const salesWithNumbers = sales.map(sale => ({
      ...sale,
      products: sale.products.map(sp => ({
        ...sp,
        product: {
          ...sp.product,
          sellingPrice: Number(sp.product.sellingPrice),
          originalPrice: sp.product.originalPrice ? Number(sp.product.originalPrice) : null,
        },
      })),
    }));

    return NextResponse.json({ sales: salesWithNumbers }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, discountPercent, startTime, endTime, productIds } = body;

    if (!title || !discountPercent || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Title, discount %, start time, and end time required' },
        { status: 400 }
      );
    }

    const sale = await prisma.flashSale.create({
      data: {
        title,
        description,
        discountPercent,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        products: {
          create: (productIds || []).map((productId: number) => ({
            productId,
          })),
        },
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json({ sale }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
