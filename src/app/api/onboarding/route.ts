import { db } from "@/db";
import { leads, projects } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, or } from "drizzle-orm";
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
    const existing = await db.select().from(leads).where(
      or(
        eq(leads.email, email),
        eq(leads.whatsapp, whatsapp),
        eq(leads.clientId, clientId)
      )
    ).limit(1);
    
    if (existing.length > 0) {
      if (existing[0].isBlocked) {
        return NextResponse.json({ error: "AUTHORITY BAN: You are permanently blocked from creating profiles." }, { status: 403 });
      }
      return NextResponse.json({ error: "DUPLICATE: A profile with this email, phone, or Client ID already exists." }, { status: 409 });
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

    // 2. Automatically Initialize the Project Database Space
    await db.insert(projects).values({
      leadId: newLead.id,
      title: domainName,
      status: "pending"
    });

    // AWAIT the Welcome Email so the serverless function doesn't instantly terminate
    await sendWelcomeEmail({
      name: newLead.name,
      email: newLead.email,
      domainName: newLead.domainName,
      magicKey: newLead.magicKey
    });

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error: any) {
    console.error("Onboarding Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
