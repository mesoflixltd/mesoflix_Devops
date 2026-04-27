import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";

// 🔐 Helper to get the saved authority token
async function getAuthToken() {
  const cookieStore = await cookies();
  const session = cookieStore.get("mesoflix_admin_session")?.value;
  if (!session) return null;
  const [admin] = await db.select().from(admins).where(eq(admins.magicKey, session)).limit(1);
  return admin?.githubToken;
}

// 📂 List Repos
export async function GET(req: Request) {
  try {
    const token = await getAuthToken();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });

    if (!response.ok) return NextResponse.json({ error: "Registry sync failed." }, { status: response.status });
    const repos = await response.json();
    return NextResponse.json({ success: true, repos: repos.map((r: any) => ({
      id: r.id,
      name: r.name,
      fullName: r.full_name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      updatedAt: r.updated_at
    })) });

  } catch (error) {
    return NextResponse.json({ error: "Cluster sync failure." }, { status: 500 });
  }
}

// 🔐 Save/Update Authority Token
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("mesoflix_admin_session")?.value;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { githubToken } = await req.json();

    await db.update(admins)
      .set({ githubToken })
      .where(eq(admins.magicKey, session));

    return NextResponse.json({ success: true, message: "Authority Token Synchronized." });

  } catch (error) {
    return NextResponse.json({ error: "Registry update failure." }, { status: 500 });
  }
}

// 🗑️ Disconnect Registry
export async function DELETE(req: Request) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("mesoflix_admin_session")?.value;
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await db.update(admins)
      .set({ githubToken: null })
      .where(eq(admins.magicKey, session));

    return NextResponse.json({ success: true, message: "Registry Disconnected." });
  } catch (error) {
    return NextResponse.json({ error: "Registry purge failure." }, { status: 500 });
  }
}
