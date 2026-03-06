import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { isEmailConfigured, sendEmail } from '@/lib/email';
import { renderOrderAdminEmail, renderOrderCustomerEmail } from '@/lib/emailTemplates';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page      = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit     = Math.min(50, parseInt(searchParams.get('limit') ?? '20'));
  const status    = searchParams.get('status') ?? undefined;
  const search    = (searchParams.get('search') ?? '').trim();
  const dateFrom  = searchParams.get('dateFrom') ?? undefined;
  const dateTo    = searchParams.get('dateTo') ?? undefined;

  const where: Record<string, unknown> = {};
  if (status) where.status = status;

  if (dateFrom || dateTo) {
    const createdAt: Record<string, Date> = {};
    if (dateFrom) { const d = new Date(dateFrom); d.setHours(0,0,0,0); createdAt.gte = d; }
    if (dateTo)   { const d = new Date(dateTo);   d.setHours(23,59,59,999); createdAt.lte = d; }
    where.createdAt = createdAt;
  }

  if (search) {
    where.OR = [
      { uuid:          { contains: search, mode: 'insensitive' } },
      { customerName:  { contains: search, mode: 'insensitive' } },
      { customerEmail: { contains: search, mode: 'insensitive' } },
      { customerPhone: { contains: search, mode: 'insensitive' } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { items: true },
    }),
    prisma.order.count({ where }),
  ]);

  // Convert Decimal fields to numbers for JSON serialization
  const ordersWithNumbers = orders.map(o => ({
    ...o,
    totalAmount: Number(o.totalAmount),
    discountAmount: Number(o.discountAmount),
    items: o.items.map(i => ({
      ...i,
      costPrice: Number(i.costPrice),
      sellingPrice: Number(i.sellingPrice),
      subtotal: Number(i.subtotal),
    }))
  }));

  return NextResponse.json({ orders: ordersWithNumbers, total, page, limit });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const totalAmount = Number(body.totalAmount ?? 0);
    const cartSubtotal = Number(body.cartSubtotal ?? totalAmount);
    if (!Number.isFinite(totalAmount) || totalAmount < 0) {
      return NextResponse.json({ error: 'Invalid totalAmount' }, { status: 400 });
    }

    const fulfillmentType = (body.fulfillmentType ?? 'delivery') as 'delivery' | 'pickup';

    const order = await prisma.$transaction(async (tx) => {
      // ── Resolve coupon (server truth) ───────────────────────────────────────
      const couponCode = (body.couponCode ?? '').trim().toUpperCase() || null;
      let couponId: number | null = null;
      let discountAmount = Number(body.discountAmount ?? 0);

      if (couponCode) {
        const coupon = await tx.coupon.findFirst({
          where: { code: { equals: couponCode, mode: 'insensitive' }, isActive: true },
        });
        if (coupon) {
          const maxUses = coupon.maxUses;
          const usedCount = coupon.usedCount;
          const expired = coupon.expiresAt && coupon.expiresAt < new Date();
          if (!expired && (maxUses === null || usedCount < maxUses)) {
            couponId = coupon.id;
            const dv = Number(coupon.discountValue);
            let serverDiscount = coupon.discountType === 'percentage'
              ? (cartSubtotal * dv) / 100
              : dv;
            if (coupon.maxDiscountAmount !== null) serverDiscount = Math.min(serverDiscount, Number(coupon.maxDiscountAmount));
            serverDiscount = Math.min(serverDiscount, cartSubtotal);
            discountAmount = Math.round(serverDiscount * 100) / 100;
          } else {
            discountAmount = 0;
          }
        } else {
          discountAmount = 0;
        }
      }

      // ── Upsert Customer (orders can be guest) ───────────────────────────────
      const emailRaw = (body.customerEmail ?? '').trim();
      const email = emailRaw ? emailRaw.toLowerCase() : '';
      const name = String(body.customerName ?? '').trim() || (email ? email.split('@')[0] : 'Customer');
      const phone = String(body.customerPhone ?? '').trim() || null;

      const customer = email
        ? await tx.customer.upsert({
            where: { email },
            update: {
              name,
              phone,
              totalOrders: { increment: 1 },
              totalSpent: { increment: totalAmount },
            },
            create: {
              email,
              name,
              phone,
              totalOrders: 1,
              totalSpent: totalAmount,
            },
          })
        : null;

      const couponCodeStored = couponCode ?? null;

      // ── Create Order ───────────────────────────────────────────────────────
      const created = await tx.order.create({
        data: {
          customerId:    customer?.id ?? null,
          customerName:  body.customerName  ?? null,
          customerEmail: emailRaw || null,
          customerPhone: body.customerPhone ?? null,
          couponId,
          couponCode: couponCodeStored,
          discountAmount,
          totalAmount,
          paymentMethod: body.paymentMethod ?? null,
          notes: [
            fulfillmentType === 'pickup' ? 'FULFILLMENT: Pick-up in store' : 'FULFILLMENT: Delivery',
            body.notes,
          ].filter(Boolean).join(' | ') || null,
          items: {
            create: (body.items ?? []).map((item: {
              productId?: number; productName: string;
              quantity: number; costPrice: number; sellingPrice: number;
            }) => ({
              productId:    item.productId ?? null,
              productName:  item.productName,
              quantity:     item.quantity,
              costPrice:    item.costPrice,
              sellingPrice: item.sellingPrice,
              subtotal:     item.sellingPrice * item.quantity,
            })),
          },
        },
        include: { items: true },
      });

      // ── Increment coupon usage ─────────────────────────────────────────────
      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      return created;
    });

    // Convert Decimal fields to numbers for JSON serialization
    const orderWithNumbers = {
      ...order,
      totalAmount: Number(order.totalAmount),
      items: order.items.map(i => ({
        ...i,
        costPrice: Number(i.costPrice),
        sellingPrice: Number(i.sellingPrice),
        subtotal: Number(i.subtotal),
      }))
    };

    // Email notifications (optional; never block order creation)
    try {
      const adminTo = (process.env.MAIL_ADMIN_TO ?? '').trim();
      const customerTo = (order.customerEmail ?? '').trim();

      if (isEmailConfigured()) {
        const lines = orderWithNumbers.items
          .map((i) => `- ${i.productName} x${i.quantity} = GHS ${Number(i.subtotal).toFixed(2)}`)
          .join('\n');

        const baseText =
          `Order ID: ${orderWithNumbers.uuid}\n` +
          `Customer: ${orderWithNumbers.customerName ?? 'N/A'}\n` +
          `Email: ${orderWithNumbers.customerEmail ?? 'N/A'}\n` +
          `Phone: ${orderWithNumbers.customerPhone ?? 'N/A'}\n` +
          `Payment: ${orderWithNumbers.paymentMethod ?? 'N/A'}\n` +
          `Total: GHS ${Number(orderWithNumbers.totalAmount).toFixed(2)}\n` +
          (orderWithNumbers.notes ? `Notes: ${orderWithNumbers.notes}\n` : '') +
          `\nItems:\n${lines}\n`;

        const tasks: Promise<unknown>[] = [];

        if (adminTo) {
          tasks.push(
            sendEmail({
              to: adminTo,
              subject: `New order received — GHS ${Number(orderWithNumbers.totalAmount).toFixed(2)}`,
              text: baseText,
              html: renderOrderAdminEmail({
                orderId: orderWithNumbers.uuid,
                totalAmount: Number(orderWithNumbers.totalAmount),
                customerName: orderWithNumbers.customerName,
                customerEmail: orderWithNumbers.customerEmail,
                customerPhone: orderWithNumbers.customerPhone,
                paymentMethod: orderWithNumbers.paymentMethod,
                notes: orderWithNumbers.notes,
                items: orderWithNumbers.items.map((i) => ({
                  productName: i.productName,
                  quantity: i.quantity,
                  subtotal: Number(i.subtotal),
                })),
              }),
            })
          );
        }

        if (customerTo) {
          tasks.push(
            sendEmail({
              to: customerTo,
              subject: `Order received — MA Collective (${orderWithNumbers.uuid})`,
              text:
                `Thanks for your order!\n\n` +
                baseText +
                `We will contact you shortly to confirm delivery.\n`,
              html: renderOrderCustomerEmail({
                customerName: orderWithNumbers.customerName,
                orderId: orderWithNumbers.uuid,
                totalAmount: Number(orderWithNumbers.totalAmount),
                paymentMethod: orderWithNumbers.paymentMethod,
                notes: orderWithNumbers.notes,
                items: orderWithNumbers.items.map((i) => ({
                  productName: i.productName,
                  quantity: i.quantity,
                  subtotal: Number(i.subtotal),
                })),
              }),
            })
          );
        }

        if (tasks.length > 0) await Promise.allSettled(tasks);
      }
    } catch (err) {
      console.error('Order email failed', err);
    }

    return NextResponse.json({ order: orderWithNumbers }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
