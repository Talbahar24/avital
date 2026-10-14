import { prisma } from "@/lib/prisma";
import { DEFAULT_POPULAR_SEARCHES, DEFAULT_SHIPPING } from "@/lib/constants";
import { getSetting, getSettingList } from "@/lib/settings";
import { SettingsForm } from "@/components/SettingsForm";

export default async function AdminSettingsPage() {
  const [announcements, popular, courier, pickup, studio, free] = await Promise.all([
    prisma.announcement.findMany({ orderBy: { sort: "asc" } }),
    getSettingList("popular_searches", DEFAULT_POPULAR_SEARCHES),
    getSetting("shipping_courier_agorot", String(DEFAULT_SHIPPING.courierAgorot)),
    getSetting("shipping_pickup_point_agorot", String(DEFAULT_SHIPPING.pickupPointAgorot)),
    getSetting("shipping_studio_agorot", String(DEFAULT_SHIPPING.studioAgorot)),
    getSetting("free_shipping_threshold_agorot", String(DEFAULT_SHIPPING.freeThresholdAgorot)),
  ]);
  return (
    <section>
      <h1>הודעות והגדרות</h1>
      <SettingsForm
        announcements={announcements.map((item) => item.text)}
        popular={popular}
        shipping={{
          courier: Number(courier) / 100,
          pickup: Number(pickup) / 100,
          studio: Number(studio) / 100,
          free: Number(free) / 100,
        }}
      />
    </section>
  );
}
