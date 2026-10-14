import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/admin";

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const form = await request.formData();
  const files = form.getAll("files").filter((item): item is File => item instanceof File);
  if (!files.length) return NextResponse.json({ error: "לא נבחרו תמונות" }, { status: 400 });

  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const paths: string[] = [];
  for (const file of files) {
    const ext = path.extname(file.name) || ".jpg";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
    paths.push(`/uploads/${name}`);
  }
  return NextResponse.json({ paths });
}
