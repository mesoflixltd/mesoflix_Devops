import { db } from "@/db";
import { leads } from "@/db/schema";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, clientId, domainProvider, whatsapp } = body;

    if (!name || !email || !clientId || !domainProvider || !whatsapp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const [newLead] = await db.insert(leads).values({
      name,
      email,
      clientId,
      domainProvider,
      whatsapp,
    }).returning();

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    console.error("Onboarding Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
