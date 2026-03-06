import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
  });

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  // Log view (fire-and-forget)
  prisma.productView
    .create({ data: { productId: product.id, referrer: 'direct' } })
    .catch(() => {});

  // Increment view count (fire-and-forget)
  prisma.product
    .update({ where: { id: product.id }, data: { viewsCount: { increment: 1 } } })
    .catch(() => {});

  // Convert Decimal fields to numbers for JSON serialization
  const productWithNumbers = {
    ...product,
    sellingPrice: Number(product.sellingPrice),
    costPrice: Number(product.costPrice),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
  };

  return NextResponse.json({ product: productWithNumbers });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const body = await request.json();
    const product = await prisma.product.update({
      where: { slug },
      data: {
        ...(body.name         !== undefined && { name: body.name }),
        ...(body.description  !== undefined && { description: body.description }),
        ...(body.costPrice    !== undefined && { costPrice: body.costPrice }),
        ...(body.sellingPrice !== undefined && { sellingPrice: body.sellingPrice }),
        ...(body.originalPrice !== undefined && { originalPrice: body.originalPrice }),
        ...(body.category     !== undefined && { category: body.category }),
        ...(body.brand        !== undefined && { brand: body.brand }),
        ...(body.sizes        !== undefined && { sizes: body.sizes }),
        ...(body.colors       !== undefined && { colors: body.colors }),
        ...(body.tags         !== undefined && { tags: body.tags }),
        ...(body.imageUrl     !== undefined && { imageUrl: body.imageUrl }),
        ...(body.gallery      !== undefined && { gallery: body.gallery }),
        ...(body.inStock      !== undefined && { inStock: body.inStock }),
        ...(body.stockQty     !== undefined && { stockQty: body.stockQty }),
        ...(body.isFeatured   !== undefined && { isFeatured: body.isFeatured }),
        ...(body.isOnSale     !== undefined && { isOnSale: body.isOnSale }),
        ...(body.isNewArrival !== undefined && { isNewArrival: body.isNewArrival }),
      },
    });
    return NextResponse.json({ product });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const product = await prisma.product.findUnique({ where: { slug }, select: { id: true } });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    // Delete related records before deleting the product
    await prisma.productView.deleteMany({ where: { productId: product.id } });
    await prisma.orderItem.deleteMany({ where: { productId: product.id } });

    await prisma.product.delete({ where: { id: product.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
