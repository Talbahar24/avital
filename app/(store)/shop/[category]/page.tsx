import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Catalog } from "@/components/Catalog";
import { CATEGORIES, SEO_BLURBS, categoryLabel } from "@/lib/constants";
import { getCatalogProducts, getSoldProducts } from "@/lib/products";

export function generateStaticParams() {
  return [...CATEGORIES.map((c) => ({ category: c.slug })), { category: "new" }, { category: "sold" }];
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (category === "new") return { title: "חדש בסטודיו" };
  if (category === "sold") return { title: "מצאו בית" };
  return { title: categoryLabel(category) };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const known = CATEGORIES.some((item) => item.slug === category) || category === "new" || category === "sold";
  if (!known) notFound();

  if (category === "sold") {
    const products = await getSoldProducts();
    return (
      <Suspense>
        <Catalog products={products} title="פריטים שמצאו בית" blurb="ארכיון קטן של one piece שכבר יצאו מהסטודיו." />
      </Suspense>
    );
  }

  const products = await getCatalogProducts({
    category: category === "new" ? undefined : category,
  });
  const title = category === "new" ? "חדש בסטודיו" : categoryLabel(category);
  return (
    <Suspense>
      <Catalog products={products} title={title} blurb={SEO_BLURBS[category]} />
    </Suspense>
  );
}
