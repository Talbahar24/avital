export function primaryImage(product: { images: { path: string; alt: string; isPrimary: boolean }[] }) {
  return product.images.find((img) => img.isPrimary) ?? product.images[0] ?? null;
}

export function isPurchasable(product: { status: string; stockQty: number }) {
  return product.status === "active" && product.stockQty > 0;
}
