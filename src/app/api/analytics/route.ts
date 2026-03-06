import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

function getPeriodStart(period: string): Date {
  const now = new Date();
  const days = period === '90d' ? 90 : period === '30d' ? 30 : 7;
  now.setDate(now.getDate() - days);
  now.setHours(0, 0, 0, 0);
  return now;
}

// GET /api/analytics/overview
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type   = searchParams.get('type') ?? 'overview';
  const period = searchParams.get('period') ?? '30d';
  const limit  = parseInt(searchParams.get('limit') ?? '10');

  // ── Overview ─────────────────────────────────────────────────────
  if (type === 'overview') {
    const REVENUE_STATUSES = ['pending', 'processing', 'shipped', 'delivered'];
    const [orders, products, pendingOrders] = await Promise.all([
      prisma.order.findMany({
        where: { status: { in: REVENUE_STATUSES } },
        select: {
          totalAmount: true,
          items: { select: { costPrice: true, quantity: true, sellingPrice: true } },
        },
      }),
      prisma.product.count(),
      prisma.order.count({ where: { status: 'pending' } }),
    ]);

    const totalRevenue = orders.reduce((s, o) => s + Number(o.totalAmount), 0);
    const totalCost = orders.reduce(
      (s, o) => s + o.items.reduce((si, i) => si + Number(i.costPrice) * i.quantity, 0),
      0
    );
    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

    return NextResponse.json({
      totalRevenue: +totalRevenue.toFixed(2),
      totalCost:    +totalCost.toFixed(2),
      totalProfit:  +totalProfit.toFixed(2),
      profitMargin: +profitMargin.toFixed(1),
      totalOrders:  orders.length,
      totalProducts: products,
      pendingOrders,
    });
  }

  // ── Sales chart ──────────────────────────────────────────────────
  if (type === 'sales') {
    const since = getPeriodStart(period);
    const REVENUE_STATUSES = ['pending', 'processing', 'shipped', 'delivered'];
    const orders = await prisma.order.findMany({
      where: { status: { in: REVENUE_STATUSES }, createdAt: { gte: since } },
      select: {
        createdAt: true,
        totalAmount: true,
        items: { select: { costPrice: true, quantity: true } },
      },
    });

    const byDay: Record<string, { revenue: number; cost: number; orders: number }> = {};
    for (const o of orders) {
      const day = o.createdAt.toISOString().slice(0, 10);
      if (!byDay[day]) byDay[day] = { revenue: 0, cost: 0, orders: 0 };
      byDay[day].revenue += Number(o.totalAmount);
      byDay[day].cost += o.items.reduce((s, i) => s + Number(i.costPrice) * i.quantity, 0);
      byDay[day].orders += 1;
    }

    const data = Object.entries(byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, v]) => ({
        date,
        revenue: +v.revenue.toFixed(2),
        cost:    +v.cost.toFixed(2),
        profit:  +(v.revenue - v.cost).toFixed(2),
        orders:  v.orders,
      }));

    return NextResponse.json({ data, period });
  }

  // ── Top products ─────────────────────────────────────────────────
  if (type === 'top-products') {
    const REVENUE_STATUSES = ['pending', 'processing', 'shipped', 'delivered'];
    const items = await prisma.orderItem.groupBy({
      by: ['productId', 'productName'],
      where: {
        order: { status: { in: REVENUE_STATUSES } }
      },
      _sum: { subtotal: true, quantity: true, costPrice: true },
      orderBy: { _sum: { subtotal: 'desc' } },
      take: limit,
    });

    const products = items.map((i) => ({
      productId:   i.productId,
      name:        i.productName,
      unitsSold:   i._sum.quantity ?? 0,
      revenue:     +(Number(i._sum.subtotal) ?? 0).toFixed(2),
      cost:        +(Number(i._sum.costPrice ?? 0) * (i._sum.quantity ?? 0)).toFixed(2),
      profit:      +((Number(i._sum.subtotal ?? 0)) - (Number(i._sum.costPrice ?? 0) * (i._sum.quantity ?? 0))).toFixed(2),
    }));

    return NextResponse.json({ products });
  }

  // ── Categories breakdown ─────────────────────────────────────────
  if (type === 'categories') {
    const items = await prisma.orderItem.findMany({
      include: { product: { select: { category: true } } },
    });

    const byCategory: Record<string, number> = {};
    for (const i of items) {
      const cat = i.product?.category ?? 'Uncategorized';
      byCategory[cat] = (byCategory[cat] ?? 0) + Number(i.subtotal);
    }

    const data = Object.entries(byCategory)
      .map(([category, revenue]) => ({ category, revenue: +revenue.toFixed(2) }))
      .sort((a, b) => b.revenue - a.revenue);

    return NextResponse.json({ data });
  }

  // ── Traffic / referrers ──────────────────────────────────────────
  if (type === 'traffic') {
    const since = getPeriodStart(period);
    
    // Group by product to show which products are being viewed
    const productViews = await prisma.productView.groupBy({
      by: ['productId'],
      where: { viewedAt: { gte: since } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: limit,
    });

    // Fetch product names
    const productIds = productViews.map(v => v.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });

    const productMap = Object.fromEntries(products.map(p => [p.id, p.name]));

    const totalViews = await prisma.productView.count({
      where: { viewedAt: { gte: since } },
    });

    const data = productViews.map((v) => ({
      productId: v.productId,
      productName: productMap[v.productId] || 'Unknown Product',
      views: v._count.id,
    }));

    return NextResponse.json({ data, totalViews, period });
  }

  return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
}

// POST /api/analytics - log a product view
export async function POST(request: NextRequest) {
  try {
    const { productId, referrer = 'direct' } = await request.json();
    if (!productId) return NextResponse.json({ ok: false });

    await Promise.all([
      prisma.productView.create({ data: { productId, referrer } }),
      prisma.product.update({
        where: { id: productId },
        data: { viewsCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
