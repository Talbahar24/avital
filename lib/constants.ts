export const SITE = {
  name: "אביטל וטניק",
  brand: "Avital Jewellery",
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "https://www.instagram.com/avital_jewellery/",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "972509054860",
  email: "hello@avitaljewellery.co.il",
  orderEmail: "avitalvatnik@gmail.com",
  phone: "050-905-4860",
  legalName: "אביטל וטניק",
  hours: "ימים א׳–ה׳, 10:00–18:00",
};

export const DEFAULT_CARE =
  "שמרו את התכשיט בקופסה או בשקית בד, הרחק ממים, בשמים וקרמים. נגבו בעדינות במטלית רכה אחרי שימוש.";

export const CATEGORIES = [
  { slug: "rings", label: "טבעות", singular: "טבעת" },
  { slug: "earrings", label: "עגילים", singular: "עגילים" },
  { slug: "necklaces", label: "שרשראות", singular: "שרשרת" },
  { slug: "bracelets", label: "צמידים", singular: "צמיד" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const NAV = [
  { href: "/shop", label: "החנות" },
  { href: "/shop/rings", label: "טבעות" },
  { href: "/shop/earrings", label: "עגילים" },
  { href: "/shop/necklaces", label: "שרשראות" },
  { href: "/shop/bracelets", label: "צמידים" },
  { href: "/meaning", label: "משמעות" },
  { href: "/lookbook", label: "על הגוף" },
  { href: "/workshops", label: "סדנאות" },
] as const;

export const STONES = [
  "אמטיסט",
  "קוורץ",
  "טורקיז",
  "ירקן",
  "רוז קוורץ",
  "סיטרין",
  "לפיס",
  "המטייט",
  "אקוומרין",
  "פנינה",
  "מונסטון",
  "ג'ספר",
] as const;

export const METALS = ["כסף 925", "גולדפילד", "ציפוי זהב", "אחר"] as const;

export const INVENTORY_MODES = [
  { value: "one_piece", label: "פריט יחיד (one piece)" },
  { value: "made_to_order", label: "לפי מידה" },
  { value: "stock", label: "מלאי רגיל" },
] as const;

export const PRODUCT_STATUSES = [
  { value: "draft", label: "טיוטה" },
  { value: "active", label: "פעיל" },
  { value: "reserved", label: "שמור לתשלום" },
  { value: "sold", label: "נמכר" },
  { value: "hidden", label: "מוסתר" },
] as const;

export const SHIPPING_METHODS = [
  { value: "courier", label: "שליח עד הבית" },
  { value: "pickup_point", label: "נקודת איסוף" },
  { value: "studio_pickup", label: "איסוף מהסטודיו" },
] as const;

export const FULFILLMENT = [
  { value: "new", label: "חדשה" },
  { value: "packing", label: "באריזה" },
  { value: "shipped", label: "נשלחה" },
  { value: "delivered", label: "נמסרה" },
  { value: "cancelled", label: "בוטלה" },
] as const;

export const DEFAULT_SHIPPING = {
  courierAgorot: 3500,
  pickupPointAgorot: 2000,
  studioAgorot: 0,
  freeThresholdAgorot: 35000,
};

export const DEFAULT_POPULAR_SEARCHES = ["טבעת", "אמטיסט", "אומץ"];

export const SEO_BLURBS: Record<string, string> = {
  shop: "תכשיטי אבני חן בעבודת יד, כל פריט יחיד בעולם. נולד בסטודיו של אביטל וטניק ולא חוזר אחרי שנמכר.",
  rings: "טבעות one piece מאבני חן טבעיות, כל אחת עם כוונה. נמכרות פעם אחת בלבד.",
  earrings: "עגילים בעבודת יד מאבני חן. כל זוג הוא פריט יחיד, עם משמעות שנבחרה לאבן.",
  necklaces: "שרשראות קמע מאבני חן טבעיות. פריט אחד בעולם, נוצר בסטודיו ולא משוכפל.",
  bracelets: "צמידי אבני חן בעבודת יד, כל אחד נולד פעם אחת ומוצא בית אחד.",
  new: "מה שנולד עכשיו בסטודיו. פריטים חדשים, עדיין מחכים למי שייקח אותם הביתה.",
};

export function categoryLabel(slug: string) {
  return CATEGORIES.find((item) => item.slug === slug)?.label ?? slug;
}

export function categorySingular(slug: string) {
  return CATEGORIES.find((item) => item.slug === slug)?.singular ?? slug;
}
