import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const idNum = parseInt(id);
    const body = await request.json();
    const { isActive } = body;

    const subscriber = await prisma.newsletterSubscriber.update({
      where: { id: idNum },
      data: { isActive },
    });

    return NextResponse.json({ subscriber }, { status: 200 });
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

    await prisma.newsletterSubscriber.delete({
      where: { id: idNum },
    });

    return NextResponse.json({ message: 'Subscriber removed' }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
