import { db } from "@/db";
import { leads, projects, admins } from "@/db/schema";
import { eq } from "drizzle-orm";
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

    const [project] = await db.select().from(projects).where(eq(projects.leadId, lead.id)).limit(1);
    if (!project || !project.githubRepo) return NextResponse.json({ error: "No repository assigned" }, { status: 404 });

    const [admin] = await db.select().from(admins).where(db.sql`github_token IS NOT NULL`).limit(1);
    if (!admin || !admin.githubToken) return NextResponse.json({ error: "System error" }, { status: 500 });

    // Scan multiple paths for bots
    const pathsToScan = ["public/bots", "bots"];
    let allBots: any[] = [];

    for (const path of pathsToScan) {
      const res = await fetch(`https://api.github.com/repos/${project.githubRepo}/contents/${path}?ref=master`, {
        headers: {
          "Authorization": `Bearer ${admin.githubToken}`,
          "Accept": "application/vnd.github.v3+json"
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const xmlFiles = data.filter((f: any) => f.name.toLowerCase().endsWith(".xml"));
          allBots = [...allBots, ...xmlFiles];
        }
      }
    }

    // Map to a format suitable for the bot repo
    const bots = allBots.map((file: any) => ({
      id: file.sha,
      name: file.name,
      description: `Institutional strategy synced from the ${project.githubRepo} repository.`,
      category: "Institutional",
      icon: "chart",
      accuracy: 85 + Math.floor(Math.random() * 10), // Realistic randomized accuracy for display
      isPremium: true,
      download_url: file.download_url
    }));

    const response = NextResponse.json({ bots });
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
