import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { categoryLabel } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <section>
      <div className="section-head">
        <h1>מוצרים</h1>
        <Link className="btn" href="/admin/products/new">
          מוצר חדש
        </Link>
      </div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>שם</th>
            <th>קטגוריה</th>
            <th>מחיר</th>
            <th>סטטוס</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{categoryLabel(product.category)}</td>
              <td>{formatPrice(product.priceAgorot)}</td>
              <td>{product.status}</td>
              <td>
                <Link href={`/admin/products/${product.id}`}>עריכה</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
