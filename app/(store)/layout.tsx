import { AnnouncementBar } from "@/components/AnnouncementBar";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { prisma } from "@/lib/prisma";
import { shippingConfig } from "@/lib/shipping";

export const dynamic = "force-dynamic";

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  const [announcements, shipping] = await Promise.all([
    prisma.announcement.findMany({ where: { active: true }, orderBy: { sort: "asc" } }),
    shippingConfig(),
  ]);

  return (
    <>
      <AnnouncementBar items={announcements.map((item) => item.text)} />
      <Header />
      <div className="sheet">
        <main id="main">{children}</main>
        <Footer />
      </div>
      <CartDrawer freeThresholdAgorot={shipping.freeThresholdAgorot} courierAgorot={shipping.courierAgorot} />
      <WhatsAppButton />
    </>
  );
}
