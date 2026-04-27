import { db } from "@/db";
import { leads } from "@/db/schema";
import { NextResponse } from "next/server";

import { sendWelcomeEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, clientId, domainName, domainProvider, apiConfig, whatsapp } = body;

    if (!name || !email || !clientId || !domainName || !domainProvider || !apiConfig || !whatsapp) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

    // Fire & Forget the Welcome Email so the UI doesn't lag
    sendWelcomeEmail({
      name: newLead.name,
      email: newLead.email,
      domainName: newLead.domainName,
      magicKey: newLead.magicKey
    }).catch(err => console.error("Email Dispatch Error:", err));

    return NextResponse.json({ success: true, lead: newLead });
  } catch (error) {
    console.error("Onboarding Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
