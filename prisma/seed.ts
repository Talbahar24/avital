import { PrismaClient } from "@prisma/client";
import { DEFAULT_CARE, DEFAULT_POPULAR_SEARCHES, DEFAULT_SHIPPING } from "../lib/constants";

const prisma = new PrismaClient();

const products = [
  {
    slug: "amethyst-ring-courage",
    name: "טבעת אמטיסט לאומץ",
    description:
      "טבעת כסף 925 עם אמטיסט סגול עמוק. נוצרה כפריט יחיד, לקחת איתה כוונה של צעד קדימה.",
    priceAgorot: 48000,
    compareAtAgorot: null as number | null,
    category: "rings",
    stone: "אמטיסט",
    meaning: "courage",
    metal: "כסף 925",
    isFeatured: true,
    showInLookbook: true,
    images: [
      { path: "/images/c/ring.jpg", alt: "טבעת אמטיסט בעבודת יד" },
      { path: "/images/c/gem-purple.png", alt: "אבן אמטיסט" },
    ],
  },
  {
    slug: "quartz-earrings-joy",
    name: "עגילי קוורץ לשמחה",
    description: "זוג עגילים קלים עם קוורץ שקוף-זהוב. אור קטן לאוזן, פריט יחיד שלא יחזור.",
    priceAgorot: 32000,
    compareAtAgorot: 38000,
    category: "earrings",
    stone: "קוורץ",
    meaning: "joy",
    metal: "גולדפילד",
    isFeatured: true,
    showInLookbook: false,
    images: [
      { path: "/images/c/gem-shell.png", alt: "עגילי קוורץ" },
      { path: "/images/c/circle.jpg", alt: "עגיל מקרוב" },
    ],
  },
  {
    slug: "turquoise-necklace-connection",
    name: "שרשרת טורקיז לחיבור",
    description: "שרשרת ארוכה עם טורקיז טבעי. נועדה לשבת קרוב ללב ולהזכיר קרבה, לא רעש.",
    priceAgorot: 56000,
    compareAtAgorot: null,
    category: "necklaces",
    stone: "טורקיז",
    meaning: "connection",
    metal: "כסף 925",
    isFeatured: true,
    showInLookbook: true,
    images: [
      { path: "/images/c/necklace.jpg", alt: "שרשרת טורקיז על נייר" },
      { path: "/images/c/gem-teal.png", alt: "אבן טורקיז" },
    ],
  },
  {
    slug: "jade-bracelet-calm",
    name: "צמיד ירקן לרוגע",
    description: "צמיד עדין עם ירקן ירוק-חלב. עוגן קטן לפרק כף היד בימים עמוסים.",
    priceAgorot: 39000,
    compareAtAgorot: null,
    category: "bracelets",
    stone: "ירקן",
    meaning: "calm",
    metal: "כסף 925",
    isFeatured: true,
    showInLookbook: true,
    images: [
      { path: "/images/c/bracelet.jpg", alt: "צמיד ירקן בעבודת יד" },
      { path: "/images/c/gem-teal.png", alt: "אבן ירקן" },
    ],
  },
  {
    slug: "rose-quartz-ring-love",
    name: "טבעת רוז קוורץ לאהבה",
    description: "טבעת עם רוז קוורץ ורוד עדין. רכות שאינה חולשה, פריט אחד בעולם.",
    priceAgorot: 45000,
    compareAtAgorot: null,
    category: "rings",
    stone: "רוז קוורץ",
    meaning: "love",
    metal: "ציפוי זהב",
    isFeatured: false,
    showInLookbook: false,
    images: [
      { path: "/images/c/ring.jpg", alt: "טבעת רוז קוורץ" },
      { path: "/images/c/gem-shell.png", alt: "רוז קוורץ" },
    ],
  },
  {
    slug: "citrine-earrings-creativity",
    name: "עגילי סיטרין ליצירתיות",
    description: "עגילים עם סיטרין חם. נוצרו לפתוח מרחב ליצור בלי לבקש רשות.",
    priceAgorot: 29000,
    compareAtAgorot: null,
    category: "earrings",
    stone: "סיטרין",
    meaning: "creativity",
    metal: "גולדפילד",
    isFeatured: true,
    showInLookbook: false,
    images: [
      { path: "/images/c/gem-mix.png", alt: "עגילי סיטרין" },
      { path: "/images/c/gem-shell.png", alt: "אבן סיטרין" },
    ],
  },
  {
    slug: "lapis-necklace-confidence",
    name: "שרשרת לפיס לביטחון",
    description: "שרשרת עם לפיס לזולי כחול עמוק. עמדה יציבה בגוף, בלי להגזים.",
    priceAgorot: 62000,
    compareAtAgorot: 69000,
    category: "necklaces",
    stone: "לפיס",
    meaning: "confidence",
    metal: "כסף 925",
    isFeatured: true,
    showInLookbook: true,
    images: [
      { path: "/images/c/necklace.jpg", alt: "שרשרת לפיס" },
      { path: "/images/c/gem-purple.png", alt: "לפיס לזולי" },
    ],
  },
  {
    slug: "hematite-bracelet-protection",
    name: "צמיד המטייט להגנה",
    description: "צמיד כהה עם המטייט. גבול עדין סביב הגוף, שמירה בלי להיסגר.",
    priceAgorot: 34000,
    compareAtAgorot: null,
    category: "bracelets",
    stone: "המטייט",
    meaning: "protection",
    metal: "כסף 925",
    isFeatured: false,
    showInLookbook: false,
    images: [
      { path: "/images/c/bracelet.jpg", alt: "צמיד המטייט" },
      { path: "/images/c/gem-mix.png", alt: "המטייט" },
    ],
  },
  {
    slug: "aquamarine-ring-abundance",
    name: "טבעת אקוומרין לשפע",
    description: "טבעת עם אקוומרין בהיר. תזכורת להרשות לעצמך לקבל, לא רק לתת.",
    priceAgorot: 51000,
    compareAtAgorot: null,
    category: "rings",
    stone: "אקוומרין",
    meaning: "abundance",
    metal: "כסף 925",
    isFeatured: true,
    showInLookbook: false,
    images: [
      { path: "/images/c/ring.jpg", alt: "טבעת אקוומרין" },
      { path: "/images/c/gem-teal.png", alt: "אקוומרין" },
    ],
  },
  {
    slug: "moonstone-earrings-joy",
    name: "עגילי מונסטון לשמחה",
    description: "עגילים עם מונסטון חלבי. אור משתנה לפי היום, פריט יחיד.",
    priceAgorot: 36000,
    compareAtAgorot: null,
    category: "earrings",
    stone: "מונסטון",
    meaning: "joy",
    metal: "ציפוי זהב",
    isFeatured: false,
    showInLookbook: false,
    images: [
      { path: "/images/c/circle.jpg", alt: "עגילי מונסטון" },
      { path: "/images/c/gem-shell.png", alt: "מונסטון" },
    ],
  },
  {
    slug: "jasper-bracelet-courage",
    name: "צמיד ג'ספר לאומץ",
    description: "צמיד עם ג'ספר אדמדם. משקל קטן על היד לפני שיחה שחשובה.",
    priceAgorot: 31000,
    compareAtAgorot: null,
    category: "bracelets",
    stone: "ג'ספר",
    meaning: "courage",
    metal: "כסף 925",
    isFeatured: false,
    showInLookbook: false,
    images: [
      { path: "/images/c/bracelet.jpg", alt: "צמיד ג'ספר" },
      { path: "/images/c/gem-mix.png", alt: "ג'ספר" },
    ],
  },
  {
    slug: "pearl-necklace-connection",
    name: "שרשרת פנינה לחיבור",
    description: "שרשרת עם פנינה בודדת. הפריט הזה כבר מצא בית — נשמר בארכיון הסטודיו.",
    priceAgorot: 72000,
    compareAtAgorot: null,
    category: "necklaces",
    stone: "פנינה",
    meaning: "connection",
    metal: "גולדפילד",
    isFeatured: false,
    showInLookbook: true,
    status: "sold",
    stockQty: 0,
    images: [
      { path: "/images/c/necklace.jpg", alt: "שרשרת פנינה שמצאה בית" },
      { path: "/images/c/polaroid.png", alt: "שרשרת על הגוף" },
    ],
  },
];

async function main() {
  for (const item of products) {
    const { images, status, stockQty, ...data } = item;
    const product = await prisma.product.upsert({
      where: { slug: data.slug },
      update: {
        ...data,
        care: DEFAULT_CARE,
        status: status ?? "active",
        stockQty: stockQty ?? 1,
        inventoryMode: "one_piece",
      },
      create: {
        ...data,
        care: DEFAULT_CARE,
        status: status ?? "active",
        stockQty: stockQty ?? 1,
        inventoryMode: "one_piece",
        seoTitle: data.name,
        seoDescription: data.description,
      },
    });

    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: images.map((image, index) => ({
        productId: product.id,
        path: image.path,
        alt: image.alt,
        sort: index,
        isPrimary: index === 0,
      })),
    });
  }

  await prisma.announcement.deleteMany();
  await prisma.announcement.createMany({
    data: [
      { text: "משלוח חינם בהזמנה מעל 350 ₪", active: true, sort: 0 },
      { text: "כל תכשיט הוא פריט יחיד בעולם — נמכר פעם אחת", active: true, sort: 1 },
      { text: "אריזה עם כוונה, יוצאת מהסטודיו אליך", active: true, sort: 2 },
    ],
  });

  const featured = await prisma.product.findMany({
    where: { showInLookbook: true },
    include: { images: true },
  });
  await prisma.lookbookPhoto.deleteMany();
  const lookbook = [
    { path: "/images/c/avital-smile.png", alt: "אביטל מחייכת בסטודיו" },
    { path: "/images/c/necklace.jpg", alt: "שרשרת על נייר הסטודיו" },
    { path: "/images/c/avital-work.png", alt: "עבודה על תכשיט" },
    { path: "/images/c/bracelet.jpg", alt: "צמיד אבני חן" },
    { path: "/images/c/ring.jpg", alt: "טבעת מקרוב" },
    { path: "/images/c/avital-table.jpg", alt: "שולחן הסטודיו" },
  ];
  await prisma.lookbookPhoto.createMany({
    data: lookbook.map((photo, index) => ({
      ...photo,
      sort: index,
      productId: featured[index % featured.length]?.id ?? null,
    })),
  });

  const settings: Record<string, string> = {
    shipping_courier_agorot: String(DEFAULT_SHIPPING.courierAgorot),
    shipping_pickup_point_agorot: String(DEFAULT_SHIPPING.pickupPointAgorot),
    shipping_studio_agorot: String(DEFAULT_SHIPPING.studioAgorot),
    free_shipping_threshold_agorot: String(DEFAULT_SHIPPING.freeThresholdAgorot),
    popular_searches: JSON.stringify(DEFAULT_POPULAR_SEARCHES),
    seo_shop: "תכשיטי אבני חן בעבודת יד, כל פריט יחיד בעולם.",
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  console.log("Seeded Avital studio catalog");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
