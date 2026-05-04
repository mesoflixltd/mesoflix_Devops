import { db } from "@/db";
import { leads } from "@/db/schema";
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
    const { passcode, autoLockTime, biometricsEnabled } = body;

    const updates: any = {};
    if (passcode !== undefined) updates.passcode = passcode;
    if (autoLockTime !== undefined) updates.autoLockTime = autoLockTime;
    if (biometricsEnabled !== undefined) updates.biometricsEnabled = biometricsEnabled;

    if (Object.keys(updates).length > 0) {
      await db.update(leads)
        .set(updates)
        .where(eq(leads.id, lead.id));
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Security Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
