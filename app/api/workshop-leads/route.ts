import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1),
  phone: z.string().min(6),
  eventType: z.string().optional().default(""),
  details: z.string().optional().default(""),
});

export async function POST(request: NextRequest) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "חסר שם או טלפון" }, { status: 400 });
  }
  const lead = await prisma.workshopLead.create({ data: parsed.data });
  return NextResponse.json({ id: lead.id });
}
