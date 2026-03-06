import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Number(searchParams.get("limit") ?? "20"));
    const skip = (page - 1) * limit;
    const search = searchParams.get("search") ?? "";

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
            { phone: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [total, customers] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: { _count: { select: { orders: true } } },
      }),
    ]);

    return NextResponse.json({
      data: customers.map((c) => ({
        id: c.id,
        uuid: c.uuid,
        name: c.name,
        email: c.email,
        phone: c.phone,
        city: c.city,
        address: c.address,
        totalOrders: c._count.orders,
        totalSpent: Number(c.totalSpent),
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("GET /api/customers", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
