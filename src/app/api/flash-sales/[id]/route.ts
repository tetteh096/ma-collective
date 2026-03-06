import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    const sale = await prisma.flashSale.findUnique({
      where: { id: idNum },
    });

    if (!sale) {
      return NextResponse.json({ error: 'Flash sale not found' }, { status: 404 });
    }

    return NextResponse.json({ sale }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);
    const body = await request.json();
    const { title, description, discountPercent, startTime, endTime, isActive } = body;

    const sale = await prisma.flashSale.update({
      where: { id: idNum },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(discountPercent !== undefined && { discountPercent }),
        ...(startTime !== undefined && { startTime: new Date(startTime) }),
        ...(endTime !== undefined && { endTime: new Date(endTime) }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ sale }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);

    await prisma.flashSale.delete({
      where: { id: idNum },
    });

    return NextResponse.json({ message: 'Flash sale deleted' }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
