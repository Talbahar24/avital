import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { setSetting } from "@/lib/settings";

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json();
  if (body.settings) {
    for (const [key, value] of Object.entries(body.settings)) {
      await setSetting(key, String(value));
    }
  }
  if (Array.isArray(body.announcements)) {
    await prisma.announcement.deleteMany();
    await prisma.announcement.createMany({
      data: body.announcements.map((text: string, sort: number) => ({
        text,
        active: true,
        sort,
      })),
    });
  }
  return NextResponse.json({ ok: true });
}
