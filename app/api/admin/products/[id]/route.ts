import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const body = await request.json();
  if (body.status === "active" && (!body.images?.length || !body.priceAgorot)) {
    return NextResponse.json({ error: "אי אפשר לפרסם בלי תמונה ומחיר" }, { status: 400 });
  }
  const inventoryMode = body.inventoryMode || "one_piece";
  await prisma.product.update({
    where: { id },
    data: {
      name: body.name,
      description: body.description || "",
      care: body.care || "",
      priceAgorot: Number(body.priceAgorot),
      compareAtAgorot: body.compareAtAgorot ? Number(body.compareAtAgorot) : null,
      category: body.category,
      inventoryMode,
      stockQty: inventoryMode === "one_piece" ? 1 : Number(body.stockQty || 1),
      status: body.status,
      stone: body.stone || "",
      meaning: body.meaning || "",
      metal: body.metal || "",
      isFeatured: Boolean(body.isFeatured),
      showInLookbook: Boolean(body.showInLookbook),
      seoTitle: body.seoTitle || body.name,
      seoDescription: body.seoDescription || "",
    },
  });
  if (Array.isArray(body.images)) {
    await prisma.productImage.deleteMany({ where: { productId: id } });
    await prisma.productImage.createMany({
      data: body.images.map((image: { path: string; alt?: string }, index: number) => ({
        productId: id,
        path: image.path,
        alt: image.alt || body.name,
        sort: index,
        isPrimary: index === 0,
      })),
    });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  await prisma.product.update({ where: { id }, data: { status: "hidden" } });
  return NextResponse.json({ ok: true });
}
