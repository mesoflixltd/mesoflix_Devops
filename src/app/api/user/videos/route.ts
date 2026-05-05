import { db } from "@/db";
import { leads, videos } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function getLeadFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("mesoflix_session")?.value;
  if (!token) return null;

  const [lead] = await db.select().from(leads).where(eq(leads.magicKey, token)).limit(1);
  return lead || null;
}

export async function GET(req: Request) {
  try {
    const lead = await getLeadFromSession();
    if (!lead) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const items = await db.select()
      .from(videos)
      .where(eq(videos.leadId, lead.id))
      .orderBy(desc(videos.createdAt));

    return NextResponse.json({ videos: items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const lead = await getLeadFromSession();
    if (!lead) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { title, description, youtubeUrl, botName } = body;

    if (!title || !youtubeUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert youtube link to embed link if it's a standard link
    let embedUrl = youtubeUrl;
    if (youtubeUrl.includes("watch?v=")) {
      embedUrl = youtubeUrl.replace("watch?v=", "embed/");
    } else if (youtubeUrl.includes("youtu.be/")) {
      embedUrl = youtubeUrl.replace("youtu.be/", "youtube.com/embed/");
    }

    const [newItem] = await db.insert(videos).values({
      leadId: lead.id,
      title,
      description,
      youtubeUrl: embedUrl,
      botName
    }).returning();

    return NextResponse.json({ success: true, video: newItem });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const lead = await getLeadFromSession();
    if (!lead) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await db.delete(videos).where(eq(videos.id, id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
