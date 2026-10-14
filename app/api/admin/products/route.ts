import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { DEFAULT_CARE } from "@/lib/constants";

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json();
  if (!body.name || !body.priceAgorot || !body.category) {
    return NextResponse.json({ error: "חסרים שם, מחיר או קטגוריה" }, { status: 400 });
  }
  if (body.status === "active" && (!body.images?.length || !body.priceAgorot)) {
    return NextResponse.json({ error: "אי אפשר לפרסם בלי תמונה ומחיר" }, { status: 400 });
  }
  const inventoryMode = body.inventoryMode || "one_piece";
  const stockQty = inventoryMode === "one_piece" ? 1 : Number(body.stockQty || 1);
  const slugBase = slugify(body.slug || body.name);
  let slug = slugBase;
  let i = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${i++}`;
  }
  const product = await prisma.product.create({
    data: {
      slug,
      name: body.name,
      description: body.description || "",
      care: body.care || DEFAULT_CARE,
      priceAgorot: Number(body.priceAgorot),
      compareAtAgorot: body.compareAtAgorot ? Number(body.compareAtAgorot) : null,
      category: body.category,
      inventoryMode,
      stockQty,
      status: body.status || "draft",
      stone: body.stone || "",
      meaning: body.meaning || "",
      metal: body.metal || "",
      isFeatured: Boolean(body.isFeatured),
      showInLookbook: Boolean(body.showInLookbook),
      seoTitle: body.seoTitle || body.name,
      seoDescription: body.seoDescription || body.description || "",
      images: {
        create: (body.images || []).map((image: { path: string; alt?: string }, index: number) => ({
          path: image.path,
          alt: image.alt || body.name,
          sort: index,
          isPrimary: index === 0,
        })),
      },
    },
  });
  return NextResponse.json({ id: product.id });
}
