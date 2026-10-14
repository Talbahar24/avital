import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_POPULAR_SEARCHES } from "@/lib/constants";
import { meaningLabel } from "@/lib/meanings";
import { primaryImage, searchProducts } from "@/lib/products";
import { getSettingList } from "@/lib/settings";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") || "";
  const popular = await getSettingList("popular_searches", DEFAULT_POPULAR_SEARCHES);
  if (request.nextUrl.searchParams.get("popular")) {
    return NextResponse.json({ popular });
  }
  const products = await searchProducts(q);
  return NextResponse.json({
    popular,
    products: products.map((product) => ({
      slug: product.slug,
      name: product.name,
      priceAgorot: product.priceAgorot,
      meaning: product.meaning,
      meaningLabel: product.meaning ? meaningLabel(product.meaning) : "",
      image: primaryImage(product)?.path ?? null,
    })),
  });
}
