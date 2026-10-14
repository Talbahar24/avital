import { prisma } from "./prisma";

const RESERVE_MINUTES = 30;

export async function releaseExpiredReservations() {
  const now = new Date();
  await prisma.product.updateMany({
    where: {
      status: "reserved",
      reservedUntil: { lte: now },
    },
    data: {
      status: "active",
      reservedUntil: null,
    },
  });
}

export async function reserveProducts(productIds: string[]) {
  const until = new Date(Date.now() + RESERVE_MINUTES * 60 * 1000);
  const reserved: string[] = [];

  for (const id of productIds) {
    const result = await prisma.product.updateMany({
      where: { id, status: "active", stockQty: { gt: 0 } },
      data: { status: "reserved", reservedUntil: until },
    });
    if (result.count !== 1) {
      if (reserved.length) {
        await prisma.product.updateMany({
          where: { id: { in: reserved } },
          data: { status: "active", reservedUntil: null },
        });
      }
      return { ok: false as const, failedId: id };
    }
    reserved.push(id);
  }

  return { ok: true as const, until };
}

export async function markSold(productIds: string[]) {
  const now = new Date();
  await prisma.product.updateMany({
    where: { id: { in: productIds } },
    data: {
      status: "sold",
      stockQty: 0,
      reservedUntil: null,
      soldAt: now,
    },
  });
}

export async function releaseProducts(productIds: string[]) {
  await prisma.product.updateMany({
    where: { id: { in: productIds }, status: "reserved" },
    data: { status: "active", reservedUntil: null },
  });
}
