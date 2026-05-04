import { db } from "@/db";
import { leads, admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const awaitedParams = await params;
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("mesoflix_admin_session")?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [admin] = await db.select().from(admins).where(eq(admins.magicKey, sessionToken)).limit(1);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // Support partial updates
    const updates: any = {};
    if (typeof body.isBlocked === "boolean") updates.isBlocked = body.isBlocked;

    if (Object.keys(updates).length > 0) {
      await db.update(leads)
        .set(updates)
        .where(eq(leads.id, awaitedParams.id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead Update Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
