import { put } from "@vercel/blob";
import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { requireAdmin } from "@/lib/admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const form = await request.formData();
  const files = form.getAll("files").filter((item): item is File => item instanceof File && item.size > 0);
  if (!files.length) return NextResponse.json({ error: "לא נבחרו תמונות" }, { status: 400 });

  try {
    const paths: string[] = [];
    if (process.env.BLOB_STORE_ID) {
      for (const file of files) {
        const ext = path.extname(file.name).toLowerCase() || ".jpg";
        const blob = await put(`products/${crypto.randomUUID()}${ext}`, file, {
          access: "public",
          addRandomSuffix: true,
          contentType: file.type || "image/jpeg",
        });
        paths.push(blob.url);
      }
      return NextResponse.json({ paths });
    }

    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    for (const file of files) {
      const ext = path.extname(file.name) || ".jpg";
      const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
      await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
      paths.push(`/uploads/${name}`);
    }
    return NextResponse.json({ paths });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "העלאת התמונה נכשלה. נסו שוב." }, { status: 500 });
  }
}
