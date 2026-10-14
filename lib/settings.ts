import { prisma } from "./prisma";

export async function getSetting(key: string, fallback = "") {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  return row?.value ?? fallback;
}

export async function getSettingNumber(key: string, fallback: number) {
  const value = await getSetting(key);
  const n = Number(value);
  return Number.isFinite(n) && value !== "" ? n : fallback;
}

export async function getSettingList(key: string, fallback: string[]) {
  const value = await getSetting(key);
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.map(String) : fallback;
  } catch {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
}

export async function setSetting(key: string, value: string) {
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}
