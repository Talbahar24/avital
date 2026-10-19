import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { notifyNewOrder } from "@/lib/order-mail";
import { releaseExpiredReservations, releaseProducts, reserveProducts } from "@/lib/inventory";
import { shippingConfig, shippingCost } from "@/lib/shipping";

const optionalText = z.preprocess((value) => (typeof value === "string" ? value : ""), z.string());

const schema = z.object({
  fullName: z.string().min(2, "חסר שם"),
  phone: z.string().min(6, "חסר טלפון"),
  email: z.string().email("חסר אימייל תקין"),
  shippingMethod: z.enum(["courier", "pickup_point", "studio_pickup"]),
  city: optionalText,
  street: optionalText,
  streetNumber: optionalText,
  apartment: optionalText,
  note: optionalText,
  items: z.array(z.object({ productId: z.string(), qty: z.number().int().min(1).max(1) })).min(1),
});

function isPublicNumberConflict(error: unknown) {
  if (typeof error !== "object" || error === null || !("code" in error)) return false;
  return error.code === "P2002" && JSON.stringify("meta" in error ? error.meta : "").includes("publicNumber");
}

async function allocatePublicNumber() {
  const rows = await prisma.order.findMany({ select: { publicNumber: true } });
  const max = rows.reduce((highest, row) => {
    const value = Number(row.publicNumber.replace(/^AV-/, ""));
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 1000);
  return `AV-${max + 1}`;
}

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message;
    const safe = message && /[\u0590-\u05FF]/.test(message) ? message : "בדקו את הפרטים";
    return NextResponse.json({ error: safe }, { status: 400 });
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
    let order: { id: string; publicNumber: string; viewToken: string | null } | null = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        order = await prisma.order.create({
          data: {
            publicNumber: await allocatePublicNumber(),
            viewToken: randomBytes(32).toString("base64url"),
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
        break;
      } catch (error) {
        if (attempt < 2 && isPublicNumberConflict(error)) continue;
        throw error;
      }
    }
    if (!order?.viewToken) {
      throw new Error("order was not created");
    }
    await notifyNewOrder({
      id: order.id,
      publicNumber: order.publicNumber,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      shippingMethod: data.shippingMethod,
      city: data.city,
      street: data.street,
      streetNumber: data.streetNumber,
      apartment: data.apartment,
      note: data.note,
      subtotalAgorot: subtotal,
      shippingAgorot: shipping,
      totalAgorot: subtotal + shipping,
      items: products.map((product) => ({
        nameSnapshot: product.name,
        unitPriceAgorot: product.priceAgorot,
      })),
    });
    return NextResponse.json({ viewToken: order.viewToken });
  } catch (error) {
    await releaseProducts(ids);
    console.error(error);
    return NextResponse.json({ error: "לא הצלחנו לשמור את ההזמנה" }, { status: 500 });
  }
}
