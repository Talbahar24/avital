import { CheckoutForm } from "@/components/CheckoutForm";
import { shippingConfig } from "@/lib/shipping";

export const metadata = { title: "תשלום" };

export default async function CheckoutPage() {
  const shipping = await shippingConfig();
  return (
    <section className="section wrap">
      <h1>תשלום</h1>
      <CheckoutForm shipping={shipping} />
    </section>
  );
}
