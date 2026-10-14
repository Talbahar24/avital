import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const { status } = await request.json();
  await prisma.workshopLead.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true });
}
