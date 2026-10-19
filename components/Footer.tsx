import Link from "next/link";
import { CATEGORIES, SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <h3>{SITE.name}</h3>
          <p>תכשיטי אבני חן בעבודת יד. כל פריט יחיד בעולם.</p>
          <p>{SITE.hours}</p>
          <p>
            <a href={`https://wa.me/${SITE.whatsapp}`}>וואטסאפ</a>
            {" · "}
            <a href={SITE.instagram} target="_blank" rel="noreferrer">
              אינסטגרם
            </a>
          </p>
        </div>
        <div>
          <h3>החנות</h3>
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/shop/${cat.slug}`}>
              {cat.label}
            </Link>
          ))}
          <Link href="/shop/new">חדש בסטודיו</Link>
        </div>
        <div>
          <h3>הסטודיו</h3>
          <Link href="/meaning">אבנים ומשמעות</Link>
          <Link href="/lookbook">על הגוף</Link>
          <Link href="/about">על אביטל</Link>
          <Link href="/workshops">סדנאות</Link>
          <Link href="/contact">יצירת קשר</Link>
        </div>
        <div>
          <h3>מדיניות</h3>
          <Link href="/shipping">משלוחים והחלפות</Link>
          <Link href="/faq">שאלות נפוצות</Link>
          <Link href="/legal/privacy">פרטיות</Link>
          <Link href="/legal/terms">תקנון</Link>
          <Link href="/legal/cancellation">ביטול עסקה</Link>
          <Link href="/legal/accessibility">הצהרת נגישות</Link>
        </div>
      </div>
      <div className="legal-bar">
        <div className="wrap">
          <span>
            {SITE.legalName} · {SITE.phone} · {SITE.email}
          </span>
          <span>המחירים כוללים מע״מ</span>
        </div>
      </div>
    </footer>
  );
}
