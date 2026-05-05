import { db } from "@/db";
import { leads, videos } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");

    if (!domain) return NextResponse.json({ error: "Domain required" }, { status: 400 });

    // Find lead by domain
    const [lead] = await db.select().from(leads).where(eq(leads.domainName, domain)).limit(1);
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    const items = await db.select()
      .from(videos)
      .where(eq(videos.leadId, lead.id))
      .orderBy(desc(videos.createdAt));

    // Allow CORS for the public endpoint
    const response = NextResponse.json({ videos: items });
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type");
    
    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  const response = new NextResponse(null, { status: 204 });
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}
