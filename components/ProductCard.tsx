import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { meaningLabel } from "@/lib/meanings";
import { primaryImage } from "@/lib/product-media";

type Product = {
  slug: string;
  name: string;
  priceAgorot: number;
  compareAtAgorot: number | null;
  meaning: string;
  status: string;
  isFeatured?: boolean;
  createdAt?: Date | string;
  images: { path: string; alt: string; isPrimary: boolean }[];
};

export function ProductCard({ product, tag }: { product: Product; tag?: string }) {
  const main = primaryImage(product);
  const hover = product.images.find((img) => !img.isPrimary) ?? null;
  const sold = product.status === "sold";
  const badge = tag ?? (product.compareAtAgorot ? "מבצע" : product.meaning ? `ל${meaningLabel(product.meaning)}` : "");

  return (
    <Link className="product-card" href={`/product/${product.slug}`}>
      <div className="thumb">
        {main ? <img src={main.path} alt={main.alt || product.name} /> : <div style={{ aspectRatio: 1, background: "#fff" }} />}
        {hover ? <img className="hover" src={hover.path} alt="" /> : null}
        {badge && !sold ? <span className="tag">{badge}</span> : null}
        {sold ? <span className="sold-stamp">מצא בית</span> : null}
      </div>
      <h3>{product.name}</h3>
      <div className="price">
        {product.compareAtAgorot ? <span className="compare">{formatPrice(product.compareAtAgorot)}</span> : null}
        {formatPrice(product.priceAgorot)}
      </div>
      {product.meaning && !sold ? <div className="meaning-line">ל{meaningLabel(product.meaning)}</div> : null}
    </Link>
  );
}

export function ProductGrid({ products, tag }: { products: Product[]; tag?: string }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.slug} product={product} tag={tag} />
      ))}
    </div>
  );
}
