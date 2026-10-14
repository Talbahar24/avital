"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { meaningLabel } from "@/lib/meanings";
import { formatPrice } from "@/lib/format";
import { CloseIcon } from "./Icons";

type Hit = {
  slug: string;
  name: string;
  priceAgorot: number;
  meaning: string;
  image: string | null;
};

export function SearchPanel({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [popular, setPopular] = useState<string[]>(["טבעת", "אמטיסט", "אומץ"]);

  useEffect(() => {
    fetch("/api/search?popular=1")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.popular)) setPopular(data.popular);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (q.trim().length < 2) {
      setHits([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((res) => res.json())
        .then((data) => setHits(data.products ?? []))
        .catch(() => undefined);
    }, 180);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  return (
    <div className="search-backdrop" onClick={onClose}>
      <div className="search-panel" role="dialog" aria-label="חיפוש" onClick={(e) => e.stopPropagation()}>
        <div className="search-head">
          <h2>חיפוש</h2>
          <button className="icon-btn" type="button" aria-label="סגירה" onClick={onClose} style={{ color: "var(--ink)" }}>
            <CloseIcon />
          </button>
        </div>
        <div className="drawer-body">
          <input
            className="field"
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="שם, אבן או משמעות"
            aria-label="חיפוש בחנות"
          />
          {q.trim().length < 2 ? (
            <div>
              <p className="script" style={{ fontSize: "1.4rem", marginTop: 18 }}>
                חיפושים פופולריים
              </p>
              <div className="chips">
                {popular.map((term) => (
                  <button key={term} className="chip" type="button" onClick={() => setQ(term)}>
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : hits.length === 0 ? (
            <p style={{ marginTop: 18 }}>אין פריטים מתאימים לחיפוש הזה.</p>
          ) : (
            <div className="search-results">
              {hits.map((hit) => (
                <Link key={hit.slug} href={`/product/${hit.slug}`} onClick={onClose}>
                  {hit.image ? <img src={hit.image} alt="" /> : <span />}
                  <span>
                    <strong>{hit.name}</strong>
                    <br />
                    {formatPrice(hit.priceAgorot)}
                    {hit.meaning ? ` · ל${meaningLabel(hit.meaning)}` : ""}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
