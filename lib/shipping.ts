import { DEFAULT_SHIPPING } from "./constants";
import { getSettingNumber } from "./settings";

export async function shippingConfig() {
  const [courierAgorot, pickupPointAgorot, studioAgorot, freeThresholdAgorot] = await Promise.all([
    getSettingNumber("shipping_courier_agorot", DEFAULT_SHIPPING.courierAgorot),
    getSettingNumber("shipping_pickup_point_agorot", DEFAULT_SHIPPING.pickupPointAgorot),
    getSettingNumber("shipping_studio_agorot", DEFAULT_SHIPPING.studioAgorot),
    getSettingNumber("free_shipping_threshold_agorot", DEFAULT_SHIPPING.freeThresholdAgorot),
  ]);
  return { courierAgorot, pickupPointAgorot, studioAgorot, freeThresholdAgorot };
}

export function shippingCost(
  method: string,
  subtotalAgorot: number,
  config: Awaited<ReturnType<typeof shippingConfig>>,
) {
  if (method === "studio_pickup") return 0;
  if (subtotalAgorot >= config.freeThresholdAgorot) return 0;
  if (method === "pickup_point") return config.pickupPointAgorot;
  return config.courierAgorot;
}
