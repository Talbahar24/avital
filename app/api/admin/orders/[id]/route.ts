import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const body = await request.json();
  await prisma.order.update({
    where: { id },
    data: {
      ...(body.fulfillmentStatus ? { fulfillmentStatus: body.fulfillmentStatus } : {}),
      ...(body.paymentStatus ? { paymentStatus: body.paymentStatus } : {}),
      ...(typeof body.trackingNumber === "string" ? { trackingNumber: body.trackingNumber } : {}),
    },
  });
  return NextResponse.json({ ok: true });
}
