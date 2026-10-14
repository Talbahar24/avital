import { Suspense } from "react";
import { Catalog } from "@/components/Catalog";
import { SEO_BLURBS } from "@/lib/constants";
import { getCatalogProducts } from "@/lib/products";

export const metadata = { title: "החנות" };

export default async function ShopPage() {
  const products = await getCatalogProducts();
  return (
    <Suspense>
      <Catalog products={products} title="כל התכשיטים" blurb={SEO_BLURBS.shop} />
    </Suspense>
  );
}
