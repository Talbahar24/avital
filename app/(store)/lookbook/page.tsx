import Link from "next/link";
import { Polaroid } from "@/components/Polaroid";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "על הגוף" };

export default async function LookbookPage() {
  const photos = await prisma.lookbookPhoto.findMany({
    orderBy: { sort: "asc" },
    include: { product: true },
  });

  return (
    <section className="section wrap">
      <p className="script">איך זה יושב</p>
      <h1>על הגוף</h1>
      <p className="lead">תמונות מהסטודיו ומהחיים. אם הפריט עדיין בחנות — אפשר להגיע אליו מכאן.</p>
      <div className="look-grid">
        {photos.map((photo, index) => {
          const available = photo.product && photo.product.status === "active";
          return (
            <div key={photo.id}>
              <Polaroid src={photo.path} alt={photo.alt} rotate={["rot-1", "rot-2", "rot-3", "rot-4"][index % 4]} />
              {available ? (
                <p>
                  <Link href={`/product/${photo.product!.slug}`}>{photo.product!.name}</Link>
                </p>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
