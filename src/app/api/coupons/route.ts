import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/db';
import crypto from "crypto";

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
            { code: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [total, coupons] = await Promise.all([
      prisma.coupon.count({ where }),
      prisma.coupon.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      data: coupons.map((c) => ({
        ...c,
        discountValue: Number(c.discountValue),
        minOrderAmount: c.minOrderAmount ? Number(c.minOrderAmount) : null,
        maxDiscountAmount: c.maxDiscountAmount
          ? Number(c.maxDiscountAmount)
          : null,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("GET /api/coupons", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      code,
      description,
      discountType = "percentage",
      discountValue,
      minOrderAmount,
      maxDiscountAmount,
      maxUses,
      expiresAt,
      isActive = true,
    } = body;

    if (!discountValue || isNaN(Number(discountValue))) {
      return NextResponse.json(
        { error: "discountValue is required and must be a number" },
        { status: 400 }
      );
    }

    // Auto-generate code if not supplied
    const finalCode = (code ?? "").trim().toUpperCase() ||
      crypto.randomBytes(4).toString("hex").toUpperCase();

    const coupon = await prisma.coupon.create({
      data: {
        code: finalCode,
        description: description ?? null,
        discountType,
        discountValue,
        minOrderAmount: minOrderAmount ?? null,
        maxDiscountAmount: maxDiscountAmount ?? null,
        maxUses: maxUses ? Number(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive,
      },
    });

    return NextResponse.json({
      ...coupon,
      discountValue: Number(coupon.discountValue),
      minOrderAmount: coupon.minOrderAmount
        ? Number(coupon.minOrderAmount)
        : null,
      maxDiscountAmount: coupon.maxDiscountAmount
        ? Number(coupon.maxDiscountAmount)
        : null,
    }, { status: 201 });
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Coupon code already exists" },
        { status: 409 }
      );
    }
    console.error("POST /api/coupons", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
