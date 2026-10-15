import { prisma } from "./prisma";
import { releaseExpiredReservations } from "./inventory";
import { meaningLabel } from "./meanings";

export type ProductWithImages = Awaited<ReturnType<typeof getActiveProducts>>[number];

const imageOrder = { images: { orderBy: [{ isPrimary: "desc" as const }, { sort: "asc" as const }] } };

export async function getActiveProducts() {
  await releaseExpiredReservations();
  return prisma.product.findMany({
    where: { status: { in: ["active", "reserved"] } },
    include: imageOrder,
    orderBy: { createdAt: "desc" },
  });
}

export async function getCatalogProducts(options?: {
  category?: string;
  featured?: boolean;
  includeSold?: boolean;
}) {
  await releaseExpiredReservations();
  const status = options?.includeSold
    ? { in: ["active", "reserved", "sold"] }
    : { in: ["active", "reserved"] };

  return prisma.product.findMany({
    where: {
      status,
      ...(options?.category ? { category: options.category } : {}),
      ...(options?.featured ? { isFeatured: true } : {}),
    },
    include: imageOrder,
    orderBy: { createdAt: "desc" },
  });
}

export async function getSoldProducts() {
  return prisma.product.findMany({
    where: { status: "sold" },
    include: imageOrder,
    orderBy: { soldAt: "desc" },
  });
}

export async function getProductBySlug(slug: string) {
  await releaseExpiredReservations();
  return prisma.product.findUnique({
    where: { slug },
    include: imageOrder,
  });
}

export async function getSimilarProducts(product: {
  id: string;
  category: string;
  meaning: string;
}) {
  await releaseExpiredReservations();
  const sameMeaning = product.meaning
    ? await prisma.product.findMany({
        where: {
          id: { not: product.id },
          status: { in: ["active", "reserved"] },
          meaning: product.meaning,
        },
        include: imageOrder,
        take: 4,
      })
    : [];

  if (sameMeaning.length >= 4) return sameMeaning;

  const extra = await prisma.product.findMany({
    where: {
      id: { notIn: [product.id, ...sameMeaning.map((item) => item.id)] },
      status: { in: ["active", "reserved"] },
      category: product.category,
    },
    include: imageOrder,
    take: 4 - sameMeaning.length,
  });

  return [...sameMeaning, ...extra];
}

export async function searchProducts(query: string) {
  await releaseExpiredReservations();
  const q = query.trim();
  if (q.length < 2) return [];
  const all = await getActiveProducts();
  const needle = q.toLowerCase();
  return all.filter((product) => {
    const hay = [product.name, product.stone, product.meaning, meaningLabel(product.meaning), product.description]
      .join(" ")
      .toLowerCase();
    return hay.includes(needle);
  });
}

export { isPurchasable, primaryImage } from "./product-media";
