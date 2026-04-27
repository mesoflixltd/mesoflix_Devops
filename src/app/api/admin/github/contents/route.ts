import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { eq } from "drizzle-orm";

async function getAuthToken() {
  const cookieStore = await cookies();
  const session = cookieStore.get("mesoflix_admin_session")?.value;
  if (!session) return null;
  const [admin] = await db.select().from(admins).where(eq(admins.magicKey, session)).limit(1);
  return admin?.githubToken;
}

// 📂 List Bot Binary Cluster (public/bot/*.xml)
export async function GET(req: Request) {
  try {
    const token = await getAuthToken();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(req.url);
    const repo = url.searchParams.get("repo"); // owner/repo-name
    if (!repo) return NextResponse.json({ error: "Repo hash required." }, { status: 400 });

    const path = "public/bot";
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=master`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      }
    });

    if (!response.ok) {
       // If directory doesn't exist, return empty array instead of error
       if (response.status === 404) return NextResponse.json({ files: [] });
       return NextResponse.json({ error: "Registry access denied." }, { status: response.status });
    }

    const contents = await response.json();
    const bots = contents.filter((f: any) => f.name.endsWith(".xml")).map((f: any) => ({
      name: f.name,
      path: f.path,
      sha: f.sha,
      size: f.size,
      downloadUrl: f.download_url
    }));

    return NextResponse.json({ success: true, files: bots });

  } catch (error) {
    return NextResponse.json({ error: "Cluster retrieval failure." }, { status: 500 });
  }
}

// 📤 Deploy/Update/Rename Bot
export async function PUT(req: Request) {
  try {
    const token = await getAuthToken();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { repo, path, originalPath, content, message, sha } = await req.json();

    // If originalPath is provided and different from path, it's a rename (Delete old -> Create new)
    if (originalPath && originalPath !== path) {
       // Delete old
       await fetch(`https://api.github.com/repos/${repo}/contents/${originalPath}`, {
         method: "DELETE",
         headers: {
           "Authorization": `Bearer ${token}`,
           "Accept": "application/vnd.github+json",
           "X-GitHub-Api-Version": "2022-11-28"
         },
         body: JSON.stringify({
           message: `Institutional Rename: Purging legacy path ${originalPath}`,
           sha: sha,
           branch: "master"
         })
       });
       // Proceed to create the new one (nullify sha for create)
    }

    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      },
      body: JSON.stringify({
        message: message || "Institutional Bot Deployment: Syncing to Master Registry",
        content: btoa(content), // Content must be Base64
        sha: originalPath && originalPath !== path ? undefined : sha, // Use sha only for updates, not for new path in rename
        branch: "master"
      })
    });

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json({ error: err.message || "Registry push failed." }, { status: response.status });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("GitHub File Error:", error);
    return NextResponse.json({ error: "Registry handshake failure." }, { status: 500 });
  }
}

// 🗑️ Purge Bot from Registry
export async function DELETE(req: Request) {
  try {
    const token = await getAuthToken();
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { repo, path, sha } = await req.json();

    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28"
      },
      body: JSON.stringify({
        message: `Institutional Deletion: Purging node ${path}`,
        sha: sha,
        branch: "master"
      })
    });

    if (!response.ok) return NextResponse.json({ error: "Purge failed." }, { status: response.status });

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: "Registry purge failure." }, { status: 500 });
  }
}
