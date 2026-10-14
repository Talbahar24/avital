import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "אישור הזמנה" };

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { publicNumber: id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <section className="section wrap prose">
      <p className="script">תודה</p>
      <h1>ההזמנה נקלטה</h1>
      <p>
        מספר הזמנה: <strong>{order.publicNumber}</strong>
      </p>
      {order.paymentStatus === "paid" ? <p>התשלום אושר בסביבת הבדיקה. הפריט ננעל ולא יחזור למלאי.</p> : <p>ההזמנה ממתינה לתשלום.</p>}
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
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
