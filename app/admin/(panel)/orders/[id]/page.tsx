import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/format";
import { FULFILLMENT } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { OrderActions } from "@/components/OrderActions";

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();
  return (
    <section>
      <h1>{order.publicNumber}</h1>
      <p>
        {order.fullName} · {order.phone} · {order.email}
      </p>
      <p>
        {order.shippingMethod}
        {order.city ? ` · ${order.street} ${order.streetNumber}, ${order.city}` : ""}
      </p>
      <ul>
        {order.items.map((item) => (
          <li key={item.id}>
            {item.nameSnapshot} · {formatPrice(item.unitPriceAgorot)}
          </li>
        ))}
      </ul>
      <p>סה״כ כולל מע״מ: {formatPrice(order.totalAgorot)}</p>
      <OrderActions
        id={order.id}
        fulfillmentStatus={order.fulfillmentStatus}
        trackingNumber={order.trackingNumber}
        statuses={FULFILLMENT}
      />
    </section>
  );
}
