import { db } from "@/db";
import { leads, notifications } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("mesoflix_session")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [lead] = await db.select().from(leads).where(eq(leads.magicKey, token)).limit(1);
    if (!lead) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { clientId } = body;

    if (!clientId) {
      return NextResponse.json({ error: "Client ID is required" }, { status: 400 });
    }

    // Update the lead's client ID
    await db.update(leads)
      .set({ clientId })
      .where(eq(leads.id, lead.id));

    // Send a global notification to the admin dashboard
    await db.insert(notifications).values({
      title: `Client ID Updated: ${lead.name}`,
      message: `Node ${lead.name} (${lead.email}) has updated their Client ID to ${clientId}. Please review their API configuration.`,
      type: "web",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Credentials Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
