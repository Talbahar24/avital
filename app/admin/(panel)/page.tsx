import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminHome() {
  const [products, orders, leads] = await Promise.all([
    prisma.product.count({ where: { status: "active" } }),
    prisma.order.count(),
    prisma.workshopLead.count({ where: { status: "new" } }),
  ]);
  return (
    <section>
      <h1>פאנל הסטודיו</h1>
      <p>מוצרים פעילים: {products} · הזמנות: {orders} · לידים חדשים: {leads}</p>
      <p>
        <Link className="btn" href="/admin/products/new">
          העלאת פריט חדש
        </Link>
      </p>
    </section>
  );
}
