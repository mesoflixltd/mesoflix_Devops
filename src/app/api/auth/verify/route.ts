import { db } from "@/db";
import { leads, devices } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      const dashboardUrl = new URL("/dashboard", req.url);
      dashboardUrl.search = "";
      return NextResponse.redirect(dashboardUrl);
    }

    // Identify the user based on the Magic Key
    const matchedLeads = await db.select().from(leads).where(eq(leads.magicKey, token)).limit(1);
    const user = matchedLeads[0];

    if (!user) {
      // Invalid token, drop them at the auth gate
      const dashboardUrl = new URL("/dashboard", req.url);
      dashboardUrl.search = "";
      return NextResponse.redirect(dashboardUrl);
    }

    if (user.isBlocked) {
      return new NextResponse(`
        <html>
          <body style="background-color: #000; color: #ff444f; font-family: monospace; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; margin: 0; text-align: center; padding: 20px;">
            <h1 style="font-size: 2rem; border-bottom: 2px solid #ff444f; padding-bottom: 10px;">ACCESS DENIED</h1>
            <p style="font-size: 1.2rem; color: #fff;">This node profile has been suspended by the institutional authority.</p>
          </body>
        </html>
      `, { status: 403, headers: { "Content-Type": "text/html" }});
    }

    // Capture telemetry securely
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Throttle enforcement logic
    const userDevices = await db.select().from(devices).where(eq(devices.leadId, user.id));
    
    // Check if this exact device footprint has logged in before
    const existingDevice = userDevices.find((d: any) => d.ipAddress === ipAddress && d.userAgent === userAgent);

    if (existingDevice) {
      // Refresh the last active timestamp
      await db.update(devices)
        .set({ lastActive: sql`now()` })
        .where(eq(devices.id, existingDevice.id));
    } else {
      // It's a new device profile. Enforce the limit logic!
      if (userDevices.length >= 2) {
        // Limit Exceeded - Deny Entry
        return new NextResponse(`
          <html>
            <body style="background-color: #000; color: #ff444f; font-family: monospace; display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; margin: 0; text-align: center; padding: 20px;">
              <h1 style="font-size: 2rem; border-bottom: 2px solid #ff444f; padding-bottom: 10px;">SECURITY BREACH DEFEATED</h1>
              <p style="font-size: 1.2rem; color: #fff;">Access strictly denied. Your puzzle key has reached the maximum institutional allowance of two (2) distinct devices/IP nodes.</p>
              <p style="color: #666;">Current Access IP: ${ipAddress}</p>
              <a href="/" style="color: #ff444f; margin-top: 20px; font-weight: bold; text-decoration: none; border: 1px solid #ff444f; padding: 10px 20px;">RETURN TO SAFETY</a>
            </body>
          </html>
        `, { status: 403, headers: { "Content-Type": "text/html" }});
      }

      // Safe to insert the new device footprint
      await db.insert(devices).values({
        leadId: user.id,
        ipAddress,
        userAgent
      });
    }

    // Success - Encrypt the session securely
    const cookieStore = await cookies();
    cookieStore.set("mesoflix_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: "lax",
    });

    // Force redirection to a CLEAN dashboard enclosure (no tokens in URL)
    const dashboardUrl = new URL("/dashboard", req.url);
    dashboardUrl.search = ""; 
    return NextResponse.redirect(dashboardUrl);

  } catch (error) {
    console.error("Auth Interceptor Error:", error);
    return NextResponse.json({ error: "Authentication system failure." }, { status: 500 });
  }
}
