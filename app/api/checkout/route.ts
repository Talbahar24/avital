import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { releaseExpiredReservations, releaseProducts, reserveProducts } from "@/lib/inventory";
import { shippingConfig, shippingCost } from "@/lib/shipping";

const schema = z.object({
  fullName: z.string().min(2, "חסר שם"),
  phone: z.string().min(6, "חסר טלפון"),
  email: z.string().email("חסר אימייל תקין"),
  shippingMethod: z.enum(["courier", "pickup_point", "studio_pickup"]),
  city: z.string().optional().default(""),
  street: z.string().optional().default(""),
  streetNumber: z.string().optional().default(""),
  apartment: z.string().optional().default(""),
  note: z.string().optional().default(""),
  items: z.array(z.object({ productId: z.string(), qty: z.number().int().min(1).max(1) })).min(1),
});

function nextPublicNumber(seq: number) {
  return `AV-${1000 + seq}`;
}

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "בדקו את הפרטים" }, { status: 400 });
  }
  const data = parsed.data;
  if (data.shippingMethod !== "studio_pickup" && (!data.city || !data.street || !data.streetNumber)) {
    return NextResponse.json({ error: "חסרה כתובת למשלוח" }, { status: 400 });
  }

  await releaseExpiredReservations();
  const ids = data.items.map((item) => item.productId);
  const products = await prisma.product.findMany({ where: { id: { in: ids } } });
  if (products.length !== ids.length) {
    return NextResponse.json({ error: "פריט בסל כבר לא קיים" }, { status: 400 });
  }

  const reserved = await reserveProducts(ids);
  if (!reserved.ok) {
    const failed = products.find((item) => item.id === reserved.failedId);
    return NextResponse.json(
      { error: failed ? `הפריט ${failed.name} בדיוק מצא בית` : "הפריט כבר נמכר" },
      { status: 409 },
    );
  }

  try {
    const subtotal = products.reduce((sum, item) => sum + item.priceAgorot, 0);
    const shipping = shippingCost(data.shippingMethod, subtotal, await shippingConfig());
    const count = await prisma.order.count();
    const order = await prisma.order.create({
      data: {
        publicNumber: nextPublicNumber(count + 1),
        email: data.email,
        phone: data.phone,
        fullName: data.fullName,
        shippingMethod: data.shippingMethod,
        city: data.city,
        street: data.street,
        streetNumber: data.streetNumber,
        apartment: data.apartment,
        note: data.note,
        subtotalAgorot: subtotal,
        shippingAgorot: shipping,
        totalAgorot: subtotal + shipping,
        cancellationAccepted: true,
        items: {
          create: products.map((product) => ({
            productId: product.id,
            nameSnapshot: product.name,
            unitPriceAgorot: product.priceAgorot,
            qty: 1,
          })),
        },
      },
    });
    return NextResponse.json({ orderId: order.id, publicNumber: order.publicNumber });
  } catch (error) {
    await releaseProducts(ids);
    console.error(error);
    return NextResponse.json({ error: "לא הצלחנו לשמור את ההזמנה" }, { status: 500 });
  }
}
