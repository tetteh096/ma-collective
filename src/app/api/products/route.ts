import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page     = Math.max(1, parseInt(searchParams.get('page')  ?? '1'));
  const limit    = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '9')));
  const category = searchParams.get('category') ?? undefined;
  const sort     = searchParams.get('sort') ?? 'newest';
  const q        = searchParams.get('q') ?? undefined;
  const featured = searchParams.get('featured') === 'true' ? true : undefined;
  const onSale   = searchParams.get('on_sale') === 'true' ? true : undefined;
  const newArr   = searchParams.get('new_arrival') === 'true' ? true : undefined;

  const where: Prisma.ProductWhereInput = {
    ...(category && { category: { equals: category, mode: 'insensitive' } }),
    ...(featured !== undefined && { isFeatured: featured }),
    ...(onSale   !== undefined && { isOnSale: onSale }),
    ...(newArr   !== undefined && { isNewArrival: newArr }),
    ...(q && {
      OR: [
        { name:        { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { brand:       { contains: q, mode: 'insensitive' } },
      ],
    }),
  };

  const sortByDiscount = sort === 'discount-desc';

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sortByDiscount   ? { createdAt: 'desc' } :  // fetch order; we re-sort by discount in JS
    sort === 'price-asc'  ? { sellingPrice: 'asc' }  :
    sort === 'price-desc' ? { sellingPrice: 'desc' } :
    sort === 'rating'     ? { rating: 'desc' }       :
                            { createdAt: 'desc' };

  const take = sortByDiscount ? Math.min(50, limit * 3) : limit;
  const skip = sortByDiscount ? 0 : (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where, orderBy,
      skip,
      take,
      select: {
        id: true, uuid: true, name: true, slug: true,
        sellingPrice: true, costPrice: true, originalPrice: true, currency: true,
        category: true, brand: true, imageUrl: true, gallery: true,
        inStock: true, stockQty: true, isFeatured: true, isOnSale: true, isNewArrival: true,
        rating: true, reviewsCount: true, tags: true, sku: true,
        sizes: true, colors: true, createdAt: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  // Convert Decimal fields to numbers for JSON serialization
  let itemsWithNumbers = items.map(p => ({
    ...p,
    sellingPrice: Number(p.sellingPrice),
    costPrice: Number(p.costPrice),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : null,
  }));

  if (sortByDiscount) {
    const withDiscount = itemsWithNumbers.map(p => {
      const orig = p.originalPrice ?? 0;
      const sell = p.sellingPrice;
      const discount = orig > 0 && sell < orig
        ? Math.round(((orig - sell) / orig) * 100)
        : 0;
      return { p, discount };
    });
    itemsWithNumbers = withDiscount
      .filter(({ discount }) => discount > 0)
      .sort((a, b) => b.discount - a.discount)
      .slice(0, limit)
      .map(({ p }) => p);
  }

  return NextResponse.json({ items: itemsWithNumbers, total, page, limit }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const slug = (body.slug ?? body.name)
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        name: body.name, slug,
        description:   body.description   ?? null,
        costPrice:     body.costPrice      ?? 0,
        sellingPrice:  body.sellingPrice,
        originalPrice: body.originalPrice  ?? null,
        category:      body.category       ?? null,
        brand:         body.brand          ?? null,
        sizes:         body.sizes          ?? [],
        colors:        body.colors         ?? [],
        tags:          body.tags           ?? [],
        sku:           body.sku            ?? null,
        imageUrl:      body.imageUrl       ?? null,
        gallery:       body.gallery        ?? [],
        inStock:       body.inStock        ?? true,
        stockQty:      body.stockQty       ?? 0,
        isFeatured:    body.isFeatured     ?? false,
        isOnSale:      body.isOnSale       ?? false,
        isNewArrival:  body.isNewArrival   ?? true,
      },
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
