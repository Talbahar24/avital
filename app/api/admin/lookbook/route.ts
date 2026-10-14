import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json();
  await prisma.lookbookPhoto.create({
    data: {
      path: body.path,
      alt: body.alt || "",
      productId: body.productId || null,
      sort: Number(body.sort || 0),
    },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await request.json();
  await prisma.lookbookPhoto.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
