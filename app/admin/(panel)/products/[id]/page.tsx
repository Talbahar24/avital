import { notFound } from "next/navigation";
import { ProductForm } from "@/components/ProductForm";
import { prisma } from "@/lib/prisma";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { sort: "asc" } } },
  });
  if (!product) notFound();
  return (
    <section>
      <h1>עריכת מוצר</h1>
      <ProductForm
        product={{
          ...product,
          images: product.images.map((image) => ({ path: image.path, alt: image.alt })),
        }}
      />
    </section>
  );
}
