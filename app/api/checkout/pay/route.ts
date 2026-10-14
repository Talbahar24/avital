import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { markSold, releaseProducts } from "@/lib/inventory";

export async function POST(request: NextRequest) {
  const { orderId } = await request.json();
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) return NextResponse.json({ error: "הזמנה לא נמצאה" }, { status: 404 });
  if (order.paymentStatus === "paid") {
    return NextResponse.json({ ok: true, publicNumber: order.publicNumber });
  }

  const productIds = order.items.map((item) => item.productId);
  const reserved = await prisma.product.findMany({
    where: { id: { in: productIds }, status: "reserved" },
  });
  if (reserved.length !== productIds.length) {
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "failed" },
    });
    return NextResponse.json({ error: "הפריט בדיוק מצא בית. החיוב לא יצא." }, { status: 409 });
  }

  if (process.env.SANDBOX_PAYMENTS !== "true") {
    return NextResponse.json({ error: "ספק סליקה עדיין לא חובר" }, { status: 501 });
  }

  await prisma.$transaction(async (tx) => {
    const existing = await tx.order.findUnique({ where: { id: order.id } });
    if (existing?.paymentStatus === "paid") return;
    await tx.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: "paid",
        paidAt: new Date(),
        fulfillmentStatus: "packing",
        provider: "sandbox",
        providerPaymentId: `sandbox-${order.id}`,
      },
    });
  });
  await markSold(productIds);
  return NextResponse.json({ ok: true, publicNumber: order.publicNumber });
}

export async function PUT(request: NextRequest) {
  const { orderId } = await request.json();
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) return NextResponse.json({ error: "הזמנה לא נמצאה" }, { status: 404 });
  await releaseProducts(order.items.map((item) => item.productId));
  await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: "failed" },
  });
  return NextResponse.json({ ok: true });
}
