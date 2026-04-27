import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      const fallbackUrl = new URL("/ms/staff/admin", req.url);
      fallbackUrl.search = "";
      return NextResponse.redirect(fallbackUrl);
    }

    const [admin] = await db.select().from(admins).where(eq(admins.magicKey, token)).limit(1);

    if (!admin) {
      const fallbackUrl = new URL("/ms/staff/admin", req.url);
      fallbackUrl.search = "";
      return NextResponse.redirect(fallbackUrl);
    }

    // Success - Set Admin Session
    const cookieStore = await cookies();
    cookieStore.set("mesoflix_admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours for admin
      sameSite: "lax",
    });

    const successUrl = new URL("/ms/staff/admin", req.url);
    successUrl.search = "";
    return NextResponse.redirect(successUrl);

  } catch (error) {
    console.error("Admin Auth Error:", error);
    return NextResponse.json({ error: "Institutional auth failure." }, { status: 500 });
  }
}
