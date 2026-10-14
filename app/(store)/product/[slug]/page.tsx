import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductGrid } from "@/components/ProductCard";
import { formatPrice, whatsappLink } from "@/lib/format";
import { categoryLabel } from "@/lib/constants";
import { meaningLabel } from "@/lib/meanings";
import { getProductBySlug, getSimilarProducts, primaryImage } from "@/lib/products";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "פריט" };
  return {
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status === "draft" || product.status === "hidden") notFound();
  const similar = await getSimilarProducts(product);
  const image = primaryImage(product);

  return (
    <section className="section wrap">
      <p>
        <Link href="/shop">החנות</Link>
        {" / "}
        <Link href={`/shop/${product.category}`}>{categoryLabel(product.category)}</Link>
      </p>
      <div className="pdp">
        <ProductGallery images={product.images} name={product.name} />
        <div>
          <h1>{product.name}</h1>
          {product.stone ? <p className="script">{product.stone}</p> : null}
          <p className="price">
            {product.compareAtAgorot ? <span className="compare">{formatPrice(product.compareAtAgorot)}</span> : null}
            {formatPrice(product.priceAgorot)}
          </p>
          {product.meaning ? <p className="meaning-line">ל{meaningLabel(product.meaning)}</p> : null}
          <AddToCart
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              priceAgorot: product.priceAgorot,
              meaning: product.meaning,
              status: product.status,
              stockQty: product.stockQty,
              inventoryMode: product.inventoryMode,
              image: image?.path ?? "/images/c/logo.png",
            }}
          />
          <p>
            כמות: 1
            {product.inventoryMode === "one_piece" ? " · נעול לפריט יחיד" : ""}
          </p>
          {product.description ? (
            <div className="pdp-block">
              <h2>על הפריט</h2>
              <p>{product.description}</p>
            </div>
          ) : null}
          <div className="pdp-block">
            <h2>חומרים</h2>
            <p>
              {product.stone ? `אבן: ${product.stone}. ` : ""}
              {product.metal ? `מתכת: ${product.metal}.` : ""}
            </p>
          </div>
          {product.care ? (
            <div className="pdp-block">
              <h2>איך שומרים</h2>
              <p>{product.care}</p>
            </div>
          ) : null}
          <div className="pdp-block">
            <h2>משלוח וביטול עסקה</h2>
            <p>
              שליח עד הבית, נקודת איסוף או איסוף מהסטודיו. ביטול לפי{" "}
              <Link href="/shipping">מדיניות המשלוחים</Link>.
            </p>
          </div>
          <p>
            <a href={whatsappLink(`היי אביטל, ראיתי את ${product.name} באתר.`)}>שיתוף בוואטסאפ</a>
          </p>
        </div>
      </div>
      {similar.length ? (
        <div className="pdp-block">
          <h2>עוד מהסטודיו</h2>
          <ProductGrid products={similar} />
        </div>
      ) : null}
    </section>
  );
}
