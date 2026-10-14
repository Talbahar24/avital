import Link from "next/link";
import { Polaroid } from "@/components/Polaroid";
import { ProductGrid } from "@/components/ProductCard";
import { TrustBar } from "@/components/TrustBar";
import { CATEGORIES } from "@/lib/constants";
import { MEANINGS } from "@/lib/meanings";
import { prisma } from "@/lib/prisma";
import { getCatalogProducts } from "@/lib/products";

const categoryImages: Record<string, string> = {
  rings: "/images/c/ring.jpg",
  earrings: "/images/c/circle.jpg",
  necklaces: "/images/c/necklace.jpg",
  bracelets: "/images/c/bracelet.jpg",
};

export default async function HomePage() {
  const [featured, lookbook] = await Promise.all([
    getCatalogProducts({ featured: true }),
    prisma.lookbookPhoto.findMany({ orderBy: { sort: "asc" }, take: 4, include: { product: true } }),
  ]);
  const newest = featured.slice(0, 8);

  return (
    <>
      <section className="hero section wrap" id="top">
        <div className="hero-grid">
          <div>
            <h1>
              פריט אחד
              <br />
              בעולם
            </h1>
            <p className="script">נולד פעם אחת, נמכר פעם אחת</p>
            <p className="lead">
              אני אבי, מעצבת תכשיטים.
              <br />
              כל תכשיט אמור להיות יחיד ומיוחד —
              <br />
              לכן אני יוצרת רק one piece.
            </p>
            <div className="btn-row">
              <Link className="btn" href="/shop">
                לחנות
              </Link>
              <Link className="btn-secondary" href="/workshops">
                לסדנה
              </Link>
            </div>
          </div>
          <div className="hero-photos">
            <img className="arch" src="/images/c/necklace.jpg" alt="שרשרת בעבודת יד על הגוף ובסטודיו" />
            <img className="round" src="/images/c/avital-smile.png" alt="אביטל וטניק" />
          </div>
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <h2>מה נולד בסטודיו</h2>
        </div>
        <div className="cat-grid">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} className="cat-card" href={`/shop/${cat.slug}`}>
              <img src={categoryImages[cat.slug]} alt="" />
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <div>
            <p className="script">עכשיו על השולחן</p>
            <h2>חדש בסטודיו</h2>
          </div>
          <Link className="more-link" href="/shop/new">
            לכל החדשים
          </Link>
        </div>
        <ProductGrid products={newest} tag="חדש" />
      </section>

      <section className="section wrap">
        <div className="section-head">
          <div>
            <p className="script">אבן עם כוונה</p>
            <h2>משמעות</h2>
          </div>
          <Link className="more-link" href="/meaning">
            לכל האבנים
          </Link>
        </div>
        <div className="charms">
          <img className="twine" src="/images/c/twine2.png" alt="" />
          {MEANINGS.slice(0, 4).map((item) => (
            <Link key={item.slug} className="charm" href={`/shop?meaning=${item.slug}`}>
              <img src={item.image} alt="" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section wrap">
        <div className="section-head">
          <div>
            <p className="script">איך זה יושב</p>
            <h2>על הגוף</h2>
          </div>
          <Link className="more-link" href="/lookbook">
            ללוקבוק
          </Link>
        </div>
        <div className="look-row">
          {lookbook.map((photo, index) => (
            <Polaroid
              key={photo.id}
              src={photo.path}
              alt={photo.alt}
              rotate={["rot-1", "rot-2", "rot-3", "rot-4"][index]}
              href={photo.product?.status === "active" ? `/product/${photo.product.slug}` : "/lookbook"}
            />
          ))}
        </div>
      </section>

      <section className="section wrap">
        <div className="workshop-home">
          <div>
            <p className="script">גם ליצור ביחד</p>
            <h2>סדנאות אבני חן</h2>
            <p className="lead">
              חוויה שמחברת אבן, כוונה וידיים. ארבעה שלבים: היכרות, בחירה, יצירה, אריזה.
            </p>
            <div className="btn-row">
              <Link className="btn" href="/workshops">
                לתיאום סדנה
              </Link>
            </div>
          </div>
          <ol className="torn-cards">
            <li>
              <b>1</b>
              <h3>היכרות</h3>
              <p>עולם האבנים, התכונות והמשמעות של כל אחת.</p>
            </li>
            <li>
              <b>2</b>
              <h3>בחירה</h3>
              <p>כל משתתפת בוחרת אבן עם כוונה לחייה.</p>
            </li>
            <li>
              <b>3</b>
              <h3>יצירה</h3>
              <p>עיצוב התכשיט בידיים, עם ליווי צמוד.</p>
            </li>
            <li>
              <b>4</b>
              <h3>אריזה</h3>
              <p>מזכרת שנשארת על הגוף, לא במגירה.</p>
            </li>
          </ol>
        </div>
      </section>

      <TrustBar />
    </>
  );
}
