const MAP: Record<string, string> = {
  א: "a",
  ב: "b",
  ג: "g",
  ד: "d",
  ה: "h",
  ו: "v",
  ז: "z",
  ח: "h",
  ט: "t",
  י: "y",
  כ: "k",
  ך: "k",
  ל: "l",
  מ: "m",
  ם: "m",
  נ: "n",
  ן: "n",
  ס: "s",
  ע: "a",
  פ: "p",
  ף: "p",
  צ: "tz",
  ץ: "tz",
  ק: "k",
  ר: "r",
  ש: "sh",
  ת: "t",
};

export function slugify(input: string) {
  const mapped = Array.from(input.trim().toLowerCase())
    .map((ch) => MAP[ch] ?? ch)
    .join("");
  return mapped
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72) || `item-${Date.now()}`;
}
