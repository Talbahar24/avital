import { prisma } from "@/lib/prisma";
import { LookbookAdmin } from "@/components/LookbookAdmin";

export default async function AdminLookbookPage() {
  const [photos, products] = await Promise.all([
    prisma.lookbookPhoto.findMany({ orderBy: { sort: "asc" } }),
    prisma.product.findMany({ select: { id: true, name: true }, orderBy: { createdAt: "desc" } }),
  ]);
  return (
    <section>
      <h1>על הגוף</h1>
      <LookbookAdmin photos={photos} products={products} />
    </section>
  );
}
