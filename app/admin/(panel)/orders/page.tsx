import Link from "next/link";
import { formatDate, formatPrice } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <section>
      <h1>הזמנות</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>מספר</th>
            <th>תאריך</th>
            <th>לקוחה</th>
            <th>סכום</th>
            <th>תשלום</th>
            <th>משלוח</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.publicNumber}</td>
              <td>{formatDate(order.createdAt)}</td>
              <td>{order.fullName}</td>
              <td>{formatPrice(order.totalAgorot)}</td>
              <td>{order.paymentStatus}</td>
              <td>{order.fulfillmentStatus}</td>
              <td>
                <Link href={`/admin/orders/${order.id}`}>כרטיס</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
