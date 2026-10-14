"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { STONES } from "@/lib/constants";
import { MEANINGS, meaningLabel } from "@/lib/meanings";
import { ProductGrid } from "./ProductCard";

type Product = {
  slug: string;
  name: string;
  priceAgorot: number;
  compareAtAgorot: number | null;
  meaning: string;
  stone: string;
  category: string;
  status: string;
  createdAt: Date | string;
  images: { path: string; alt: string; isPrimary: boolean }[];
};

export function Catalog({
  products,
  title,
  blurb,
}: {
  products: Product[];
  title: string;
  blurb?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [drawer, setDrawer] = useState(false);

  const meaning = params.get("meaning") || "";
  const stone = params.get("stone") || "";
  const availability = params.get("availability") || "available";
  const sort = params.get("sort") || "newest";
  const max = Number(params.get("max") || 0);

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    router.replace(`${pathname}?${next.toString()}`);
  }

  const filtered = useMemo(() => {
    let list = [...products];
    if (meaning) list = list.filter((item) => item.meaning === meaning);
    if (stone) list = list.filter((item) => item.stone === stone);
    if (max) list = list.filter((item) => item.priceAgorot <= max * 100);
    if (availability === "available") list = list.filter((item) => item.status === "active");
    if (availability === "sold") list = list.filter((item) => item.status === "sold");
    list.sort((a, b) => {
      if (sort === "price_asc") return a.priceAgorot - b.priceAgorot;
      if (sort === "price_desc") return b.priceAgorot - a.priceAgorot;
      if (sort === "name") return a.name.localeCompare(b.name, "he");
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [products, meaning, stone, availability, sort, max]);

  const filters = (
    <div className="filters">
      <div>
        <h3>משמעות</h3>
        <label>
          <input type="radio" name="meaning" checked={!meaning} onChange={() => setParam("meaning", "")} />
          הכל
        </label>
        {MEANINGS.map((item) => (
          <label key={item.slug}>
            <input type="radio" name="meaning" checked={meaning === item.slug} onChange={() => setParam("meaning", item.slug)} />
            {item.label}
          </label>
        ))}
      </div>
      <div>
        <h3>אבן</h3>
        <label>
          <input type="radio" name="stone" checked={!stone} onChange={() => setParam("stone", "")} />
          הכל
        </label>
        {STONES.map((item) => (
          <label key={item}>
            <input type="radio" name="stone" checked={stone === item} onChange={() => setParam("stone", item)} />
            {item}
          </label>
        ))}
      </div>
      <div>
        <h3>מחיר עד</h3>
        <select className="field" value={max || ""} onChange={(e) => setParam("max", e.target.value)}>
          <option value="">כל המחירים</option>
          <option value="350">350 ₪</option>
          <option value="500">500 ₪</option>
          <option value="700">700 ₪</option>
        </select>
      </div>
      <div>
        <h3>זמינות</h3>
        <label>
          <input type="radio" name="availability" checked={availability === "available"} onChange={() => setParam("availability", "available")} />
          בחנות עכשיו
        </label>
        <label>
          <input type="radio" name="availability" checked={availability === "all"} onChange={() => setParam("availability", "all")} />
          כולל מה שמצא בית
        </label>
      </div>
      <button
        className="btn-secondary"
        type="button"
        onClick={() => {
          router.replace(pathname);
          setDrawer(false);
        }}
      >
        איפוס סינון
      </button>
    </div>
  );

  return (
    <section className="section wrap">
      <div className="section-head">
        <div>
          <p className="script">הסטודיו</p>
          <h1>{title}</h1>
        </div>
      </div>
      <div className="catalog-tools">
        <button className="btn-secondary filter-toggle" type="button" onClick={() => setDrawer(true)}>
          סינון
        </button>
        <span>{filtered.length} פריטים</span>
        <select className="field" style={{ width: 180 }} value={sort} onChange={(e) => setParam("sort", e.target.value)} aria-label="מיון">
          <option value="newest">חדש ביותר</option>
          <option value="price_asc">מחיר עולה</option>
          <option value="price_desc">מחיר יורד</option>
          <option value="name">שם</option>
        </select>
      </div>
      <div className="catalog-layout">
        <aside className="filters desktop">{filters}</aside>
        <div>
          {filtered.length === 0 ? (
            <div className="empty">
              <p>אין פריטים בסינון הזה</p>
              <button className="btn" type="button" onClick={() => router.replace(pathname)}>
                איפוס סינון
              </button>
            </div>
          ) : (
            <ProductGrid products={filtered} />
          )}
          {blurb ? <p className="seo-blurb">{blurb}</p> : null}
        </div>
      </div>
      {drawer ? (
        <div className="drawer-backdrop" onClick={() => setDrawer(false)}>
          <aside className="filter-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <h2>סינון</h2>
              <button className="btn-secondary" type="button" onClick={() => setDrawer(false)}>
                סגירה
              </button>
            </div>
            <div className="drawer-body">{filters}</div>
          </aside>
        </div>
      ) : null}
    </section>
  );
}

export function meaningFilterLabel(slug: string) {
  return meaningLabel(slug);
}
