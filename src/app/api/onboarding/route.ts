import { db } from "@/db";
import { leads } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { sendWelcomeEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, clientId, domainName, domainProvider, apiConfig, whatsapp } = body;

    if (!name || !email || !clientId || !domainName || !domainProvider || !apiConfig || !whatsapp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1. Prevent Duplication Spam
    const existing = await db.select().from(leads).where(eq(leads.email, email)).limit(1);
    if (existing.length > 0) {
      return NextResponse.json({ error: "DUPLICATE: This email or profile is already registered." }, { status: 409 });
    }

    const [newLead] = await db.insert(leads).values({
      name,
      email,
      clientId,
      domainName,
      domainProvider,
      apiConfig,
      whatsapp,
    }).returning();

    // AWAIT the Welcome Email so the serverless function doesn't instantly terminate
    await sendWelcomeEmail({
      name: newLead.name,
      email: newLead.email,
      domainName: newLead.domainName,
      magicKey: newLead.magicKey
    });

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    console.error("Onboarding Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
