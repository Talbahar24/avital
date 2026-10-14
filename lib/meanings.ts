export const MEANINGS = [
  {
    slug: "courage",
    label: "אומץ",
    stoneHint: "אמטיסט",
    image: "/images/c/gem-teal.png",
    text: "לבחור קדימה גם כשיש רעד. האבן מזכירה את הצעד הראשון.",
  },
  {
    slug: "joy",
    label: "שמחה",
    stoneHint: "סיטרין",
    image: "/images/c/gem-shell.png",
    text: "אור קטן שאפשר לשאת על הגוף. תזכורת לא לצמצם את הלב.",
  },
  {
    slug: "creativity",
    label: "יצירתיות",
    stoneHint: "אמטיסט",
    image: "/images/c/gem-purple.png",
    text: "מרחב ליצור בלי לבקש רשות. התכשיט כפתח לדמיון.",
  },
  {
    slug: "connection",
    label: "חיבור",
    stoneHint: "טורקיז",
    image: "/images/c/gift-navy.png",
    text: "אל עצמך, ואל מי שחשוב. קמע של קרבה ולא של רעש.",
  },
  {
    slug: "confidence",
    label: "ביטחון",
    stoneHint: "לפיס",
    image: "/images/c/gem-mix.png",
    text: "עמדה יציבה בגוף. לא צריך להיות גדולות כדי להיות ברורות.",
  },
  {
    slug: "calm",
    label: "רוגע",
    stoneHint: "ירקן",
    image: "/images/c/gem-teal.png",
    text: "נשימה על פרק כף היד. האבן כעוגן ליום עמוס.",
  },
  {
    slug: "love",
    label: "אהבה",
    stoneHint: "רוז קוורץ",
    image: "/images/c/gem-shell.png",
    text: "אל עצמך ואל מי שלידך. רכות שאינה חולשה.",
  },
  {
    slug: "abundance",
    label: "שפע",
    stoneHint: "אקוומרין",
    image: "/images/c/gem-purple.png",
    text: "להרשות לעצמך לקבל. לא רק לתת.",
  },
  {
    slug: "protection",
    label: "הגנה",
    stoneHint: "המטייט",
    image: "/images/c/gem-mix.png",
    text: "גבול עדין סביב הגוף. שמירה בלי להיסגר.",
  },
] as const;

export type MeaningSlug = (typeof MEANINGS)[number]["slug"];

export function meaningBySlug(slug: string) {
  return MEANINGS.find((item) => item.slug === slug);
}

export function meaningLabel(slug: string) {
  return meaningBySlug(slug)?.label ?? slug;
}
