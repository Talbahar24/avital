"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";

export function LookbookAdmin({
  photos,
  products,
}: {
  photos: { id: string; path: string; alt: string }[];
  products: { id: string; name: string }[];
}) {
  const router = useRouter();

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const files = (form.elements.namedItem("files") as HTMLInputElement).files;
    if (!files?.length) return;
    const upload = new FormData();
    Array.from(files).forEach((file) => upload.append("files", file));
    const uploaded = await fetch("/api/admin/upload", { method: "POST", body: upload }).then((res) => res.json());
    const data = new FormData(form);
    await fetch("/api/admin/lookbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: uploaded.paths[0],
        alt: data.get("alt"),
        productId: data.get("productId") || null,
      }),
    });
    router.refresh();
  }

  return (
    <div>
      <form className="admin-form" onSubmit={onSubmit}>
        <label>
          תמונה
          <input className="field" type="file" name="files" accept="image/*" required />
        </label>
        <label>
          alt
          <input className="field" name="alt" required />
        </label>
        <label>
          מוצר מקושר
          <select className="field" name="productId">
            <option value="">ללא</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>
        <button className="btn" type="submit">
          הוספה
        </button>
      </form>
      <div className="thumb-list" style={{ marginTop: 24 }}>
        {photos.map((photo) => (
          <div key={photo.id}>
            <img src={photo.path} alt={photo.alt} />
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/admin/lookbook", {
                  method: "DELETE",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: photo.id }),
                });
                router.refresh();
              }}
            >
              מחיקה
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
