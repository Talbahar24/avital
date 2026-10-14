import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/ProductCard";
import { MEANINGS, meaningBySlug } from "@/lib/meanings";
import { getActiveProducts } from "@/lib/products";

export function generateStaticParams() {
  return MEANINGS.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meaning = meaningBySlug(slug);
  return { title: meaning ? meaning.label : "משמעות" };
}

export default async function MeaningSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const meaning = meaningBySlug(slug);
  if (!meaning) notFound();
  const products = (await getActiveProducts()).filter((item) => item.meaning === slug);

  return (
    <section className="section wrap">
      <p className="script">{meaning.stoneHint}</p>
      <h1>{meaning.label}</h1>
      <p className="lead">{meaning.text}</p>
      {products.length ? (
        <ProductGrid products={products} />
      ) : (
        <div className="empty">
          <p>אין כרגע פריט עם הכוונה הזו בחנות.</p>
          <Link className="btn" href="/shop">
            לכל התכשיטים
          </Link>
        </div>
      )}
    </section>
  );
}
