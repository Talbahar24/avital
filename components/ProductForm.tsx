"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, INVENTORY_MODES, METALS, PRODUCT_STATUSES, STONES } from "@/lib/constants";
import { MEANINGS } from "@/lib/meanings";
import { agorotToShekelsInput, shekelsToAgorot } from "@/lib/format";

type ImageRow = { path: string; alt: string };

export function ProductForm({
  product,
}: {
  product?: {
    id: string;
    name: string;
    description: string;
    care: string;
    priceAgorot: number;
    compareAtAgorot: number | null;
    category: string;
    inventoryMode: string;
    stockQty: number;
    status: string;
    stone: string;
    meaning: string;
    metal: string;
    isFeatured: boolean;
    showInLookbook: boolean;
    images: ImageRow[];
  };
}) {
  const router = useRouter();
  const [images, setImages] = useState<ImageRow[]>(product?.images ?? []);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState(product?.inventoryMode || "one_piece");

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const prepared = await Promise.all(Array.from(files).map(shrinkImage));
      const data = new FormData();
      prepared.forEach((file) => data.append("files", file));
      const res = await fetch("/api/admin/upload", { method: "POST", body: data });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.paths?.length) {
        setError(json.error || "העלאת התמונה נכשלה. נסו שוב.");
        return;
      }
      setImages((current) => [...current, ...json.paths.map((path: string) => ({ path, alt: "" }))]);
    } catch {
      setError("העלאת התמונה נכשלה. נסו שוב.");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const data = new FormData(event.currentTarget);
    const payload = {
      name: data.get("name"),
      priceAgorot: shekelsToAgorot(String(data.get("price") || 0)),
      compareAtAgorot: data.get("compareAt") ? shekelsToAgorot(String(data.get("compareAt"))) : null,
      category: data.get("category"),
      inventoryMode: mode,
      stockQty: mode === "one_piece" ? 1 : Number(data.get("stockQty") || 1),
      stone: data.get("stone"),
      meaning: data.get("meaning"),
      metal: data.get("metal"),
      description: data.get("description"),
      care: data.get("care"),
      status: data.get("status"),
      isFeatured: data.get("isFeatured") === "on",
      showInLookbook: data.get("showInLookbook") === "on",
      images: images.map((image, index) => ({
        ...image,
        alt: index === 0 ? String(data.get("alt") || image.alt || data.get("name")) : image.alt,
      })),
    };
    if (uploading) {
      setError("התמונה עדיין עולה. חכו שתופיע למטה, ואז שמרו.");
      return;
    }
    if (payload.status === "active" && !payload.images.length) {
      setError("התמונה לא נשמרה. בחרו אותה שוב, חכו שתופיע תצוגה מקדימה, ואז שמרו.");
      return;
    }
    if (payload.status === "active" && !payload.priceAgorot) {
      setError("אי אפשר לפרסם בלי מחיר");
      return;
    }
    const url = product ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const res = await fetch(url, {
      method: product ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "שמירה נכשלה");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <label>
        שם
        <input className="field" name="name" required defaultValue={product?.name} />
      </label>
      <label>
        מחיר בש״ח
        <input className="field" name="price" type="number" min="1" step="1" required defaultValue={product ? agorotToShekelsInput(product.priceAgorot) : ""} />
      </label>
      <label>
        מחיר לפני מבצע
        <input className="field" name="compareAt" type="number" min="0" step="1" defaultValue={product?.compareAtAgorot ? agorotToShekelsInput(product.compareAtAgorot) : ""} />
      </label>
      <label>
        קטגוריה
        <select className="field" name="category" defaultValue={product?.category || "rings"}>
          {CATEGORIES.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        סוג מלאי
        <select className="field" name="inventoryMode" value={mode} onChange={(e) => setMode(e.target.value)}>
          {INVENTORY_MODES.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      {mode !== "one_piece" ? (
        <label>
          כמות
          <input className="field" name="stockQty" type="number" min="0" defaultValue={product?.stockQty ?? 1} />
        </label>
      ) : (
        <p>כמות נעולה על 1 לפריט יחיד.</p>
      )}
      <label>
        אבן
        <select className="field" name="stone" defaultValue={product?.stone || ""}>
          <option value="">ללא</option>
          {STONES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label>
        משמעות
        <select className="field" name="meaning" defaultValue={product?.meaning || ""}>
          <option value="">ללא</option>
          {MEANINGS.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        מתכת
        <select className="field" name="metal" defaultValue={product?.metal || ""}>
          <option value="">ללא</option>
          {METALS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
      <label>
        תיאור
        <textarea className="area" name="description" defaultValue={product?.description} />
      </label>
      <label>
        טיפול בתכשיט
        <textarea className="area" name="care" defaultValue={product?.care} />
      </label>
      <label>
        סטטוס
        <select className="field" name="status" defaultValue={product?.status || "draft"}>
          {PRODUCT_STATUSES.filter((item) => item.value !== "reserved").map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} /> מוצג בדף הבית
      </label>
      <label>
        <input type="checkbox" name="showInLookbook" defaultChecked={product?.showInLookbook} /> לשמור בלוקבוק אחרי מכירה
      </label>
      <label>
        תמונות (לפחות אחת לפרסום)
        <input className="field" type="file" accept="image/*" multiple disabled={uploading} onChange={(e) => upload(e.target.files)} />
        <span>{uploading ? "מעלים את התמונה..." : "אחרי הבחירה התמונה צריכה להופיע כאן למטה."}</span>
      </label>
      <label>
        alt לתמונה הראשית
        <input className="field" name="alt" defaultValue={product?.images[0]?.alt} required={images.length > 0} />
      </label>
      <div className="thumb-list">
        {images.map((image, index) => (
          <div key={image.path}>
            <img src={image.path} alt="" />
            <button
              type="button"
              onClick={() => setImages((current) => current.filter((_, i) => i !== index))}
            >
              מחיקה
            </button>
          </div>
        ))}
      </div>
      {error ? <p className="error">{error}</p> : null}
      <button className="btn" type="submit" disabled={uploading}>
        {uploading ? "מעלים תמונה..." : product ? "שמירה" : "יצירת מוצר"}
      </button>
    </form>
  );
}

async function shrinkImage(file: File) {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const max = 1600;
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}
