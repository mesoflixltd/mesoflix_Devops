import { db } from "@/db";
import { notifications, leads, admins } from "@/db/schema";
import { sendSystemNotificationEmail } from "@/lib/email";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { eq, desc, isNull } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("mesoflix_admin_session")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const [admin] = await db.select().from(admins).where(eq(admins.magicKey, token)).limit(1);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { leadId, title, message, type } = await req.json(); // type: 'web', 'email', 'both'

    // 1. Log to DB for Web Notifications
    if (type === "web" || type === "both") {
      await db.insert(notifications).values({
        leadId: leadId || null, // null = broadcast
        title,
        message,
        type
      });
    }

    // 2. Dispatch Emails
    if (type === "email" || type === "both") {
      if (leadId) {
        // Single User
        const [target] = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
        if (target) {
          await sendSystemNotificationEmail({ email: target.email, title, message });
        }
      } else {
        // Broadcast (Be careful with rate limits if leads table is huge)
        const allLeads = await db.select().from(leads);
        for (const target of allLeads) {
          await sendSystemNotificationEmail({ email: target.email, title, message });
        }
      }
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Notification Error:", error);
    return NextResponse.json({ error: "Broadcast failure." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const leadId = url.searchParams.get("leadId");
    
    // Check for Admin Session
    const cookieStore = await cookies();
    const token = cookieStore.get("mesoflix_admin_session")?.value;
    let isAdmin = false;
    
    if (token) {
      const [admin] = await db.select().from(admins).where(eq(admins.magicKey, token)).limit(1);
      if (admin) isAdmin = true;
    }

    if (isAdmin && !leadId) {
      // Admin view: Fetch ALL recent notifications
      const allNotifications = await db.select()
        .from(notifications)
        .orderBy(desc(notifications.createdAt))
        .limit(50);
        
      return NextResponse.json({ notifications: allNotifications });
    }

    if (!leadId) return NextResponse.json({ notifications: [] });

    // Fetch notifications for specific user + global broadcasts
    const userNotifications = await db.select()
      .from(notifications)
      .where(eq(notifications.leadId, leadId))
      .orderBy(desc(notifications.createdAt));
      
    const broadcasts = await db.select()
      .from(notifications)
      .where(isNull(notifications.leadId))
      .orderBy(desc(notifications.createdAt));

    return NextResponse.json({ 
      notifications: [...broadcasts, ...userNotifications].sort((a,b) => 
        new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime()
      )
    });

  } catch (error) {
    console.error("Fetch Notifications Error:", error);
    return NextResponse.json({ error: "Fetch failure." }, { status: 500 });
  }
}
