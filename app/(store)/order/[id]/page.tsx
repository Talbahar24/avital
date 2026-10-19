import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "אישור הזמנה", robots: { index: false, follow: false } };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { viewToken: id },
    select: {
      publicNumber: true,
      totalAgorot: true,
      items: { select: { nameSnapshot: true, unitPriceAgorot: true } },
    },
  });
  if (!order) notFound();

  return (
    <section className="section wrap prose">
      <p className="script">תודה</p>
      <h1>ההזמנה נקלטה</h1>
      <p>
        מספר הזמנה: <strong>{order.publicNumber}</strong>
      </p>
      <ul>
        {order.items.map((item, index) => (
          <li key={`${item.nameSnapshot}-${index}`}>
            {item.nameSnapshot} · {formatPrice(item.unitPriceAgorot)}
          </li>
        ))}
      </ul>
      <p>סה״כ כולל מע״מ: {formatPrice(order.totalAgorot)}</p>
      <Link className="btn" href="/shop">
        חזרה לחנות
      </Link>
    </section>
  );
}
