import { db } from "@/db";
import { admins } from "@/db/schema";
import { sendAdminWelcomeEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import { count } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const { email, phone } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Institutional email required." }, { status: 400 });
    }

    // Check if system is bootstrapped
    const adminCount = await db.select({ value: count() }).from(admins);
    const isFirstAdmin = adminCount[0].value === 0;

    // TODO: Link with a security header or a temporary setup secret if not first admin
    // For now, only allows the first one to bootstrap, others must be invited (or logic added later)

    const magicKey = uuidv4();
    
    await db.insert(admins).values({
      email,
      phone,
      magicKey
    }).onConflictDoUpdate({
      target: admins.email,
      set: { magicKey }
    });

    await sendAdminWelcomeEmail({ email, magicKey });

    return NextResponse.json({ success: true, message: "Authority credentials dispatched." });

  } catch (error) {
    console.error("Admin Onboarding Error:", error);
    return NextResponse.json({ error: "System registration failure." }, { status: 500 });
  }
}
