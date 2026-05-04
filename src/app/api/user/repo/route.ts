import { db } from "@/db";
import { leads, projects, admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

async function authenticateAndGetRepoContext() {
  const cookieStore = await cookies();
  const token = cookieStore.get("mesoflix_session")?.value;
  if (!token) throw new Error("Unauthorized");

  const [lead] = await db.select().from(leads).where(eq(leads.magicKey, token)).limit(1);
  if (!lead) throw new Error("Unauthorized");

  const [project] = await db.select().from(projects).where(eq(projects.leadId, lead.id)).limit(1);
  if (!project || !project.githubRepo) throw new Error("No repository assigned");

  const [admin] = await db.select().from(admins).where(db.sql`github_token IS NOT NULL`).limit(1);
  if (!admin || !admin.githubToken) throw new Error("System GitHub connection not established");

  return { lead, project, githubToken: admin.githubToken };
}

function validatePath(path: string) {
  if (path.includes("..")) throw new Error("Security Error: Path traversal detected");
  // Allow root path or specific public/bots paths
  if (path !== "" && path !== "/" && path !== "public/bots" && !path.startsWith("public/bots/") && !path.startsWith("bots/")) {
    throw new Error("Security Error: Access restricted exclusively to root or bots directory");
  }
}

export async function GET(req: Request) {
  try {
    const { project, githubToken } = await authenticateAndGetRepoContext();
    const url = new URL(req.url);
    const path = url.searchParams.get("path") || "";
    validatePath(path);

    const res = await fetch(`https://api.github.com/repos/${project.githubRepo}/contents/${path}`, {
      headers: {
        "Authorization": `Bearer ${githubToken}`,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    if (!res.ok) {
      if (res.status === 404) return NextResponse.json({ files: [] });
      return NextResponse.json({ error: "Failed to fetch repository" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json({ files: Array.isArray(data) ? data : [data] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(req: Request) {
  try {
    const { project, githubToken } = await authenticateAndGetRepoContext();
    const body = await req.json();
    const { path, content, message, sha } = body;
    if (!path) throw new Error("Missing path");
    validatePath(path);

    const res = await fetch(`https://api.github.com/repos/${project.githubRepo}/contents/${path}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${githubToken}`,
        "Accept": "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        message: message || "Update bot via MesoFlix User Console",
        content: content,
        sha: sha
      })
    });

    if (!res.ok) return NextResponse.json({ error: "Failed to write to repository" }, { status: res.status });
    return NextResponse.json({ success: true, data: await res.json() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { project, githubToken } = await authenticateAndGetRepoContext();
    const url = new URL(req.url);
    const path = url.searchParams.get("path");
    const sha = url.searchParams.get("sha");

    if (!path || !sha) throw new Error("Missing path or sha");
    validatePath(path);

    const res = await fetch(`https://api.github.com/repos/${project.githubRepo}/contents/${path}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${githubToken}`,
        "Accept": "application/vnd.github.v3+json"
      },
      body: JSON.stringify({
        message: `Delete ${path} via MesoFlix User Console`,
        sha: sha
      })
    });

    if (!res.ok) return NextResponse.json({ error: "Failed to delete from repository" }, { status: res.status });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
