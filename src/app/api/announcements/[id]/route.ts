import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  try {
    const body = await req.json();
    const data: { message?: string; sortOrder?: number; isActive?: boolean } = {};
    if (body.message !== undefined) data.message = String(body.message).trim();
    if (body.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder) || 0;
    if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);

    const updated = await prisma.announcement.update({
      where: { id: numId },
      data,
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
  try {
    await prisma.announcement.delete({ where: { id: numId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
