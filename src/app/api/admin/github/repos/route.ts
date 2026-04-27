import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("mesoflix_admin_session")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const [admin] = await db.select().from(admins).where(eq(admins.magicKey, token)).limit(1);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { githubToken } = await req.json();

    if (!githubToken) return NextResponse.json({ error: "GitHub Token required." }, { status: 400 });

    const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
      headers: {
        "Authorization": `Bearer ${githubToken}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json({ error: err.message || "GitHub API Error" }, { status: response.status });
    }

    const repos = await response.json();
    
    // Map high-fidelity repo data
    const formattedRepos = repos.map((r: any) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      visibility: r.visibility,
      updatedAt: r.updated_at,
      stars: r.stargazers_count
    }));

    return NextResponse.json({ success: true, repos: formattedRepos });

  } catch (error) {
    console.error("GitHub Fetch Error:", error);
    return NextResponse.json({ error: "Internal registry failure." }, { status: 500 });
  }
}
