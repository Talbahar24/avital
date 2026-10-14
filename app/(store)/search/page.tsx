import Link from "next/link";
import { ProductGrid } from "@/components/ProductCard";
import { DEFAULT_POPULAR_SEARCHES } from "@/lib/constants";
import { getSettingList } from "@/lib/settings";
import { searchProducts } from "@/lib/products";

export const metadata = { title: "חיפוש" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const popular = await getSettingList("popular_searches", DEFAULT_POPULAR_SEARCHES);
  const products = q.trim().length >= 2 ? await searchProducts(q) : [];

  return (
    <section className="section wrap">
      <h1>חיפוש</h1>
      <form action="/search">
        <input className="field" name="q" defaultValue={q} placeholder="שם, אבן או משמעות" />
      </form>
      {q.trim().length < 2 ? (
        <div className="chips">
          {popular.map((term) => (
            <Link key={term} className="chip" href={`/search?q=${encodeURIComponent(term)}`}>
              {term}
            </Link>
          ))}
        </div>
      ) : products.length ? (
        <div style={{ marginTop: 24 }}>
          <ProductGrid products={products} />
        </div>
      ) : (
        <div className="empty">
          <p>אין פריטים לחיפוש הזה.</p>
        </div>
      )}
    </section>
  );
}
