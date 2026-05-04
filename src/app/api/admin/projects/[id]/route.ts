import { db } from "@/db";
import { projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { admins } from "@/db/schema";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("mesoflix_admin_session")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [admin] = await db.select().from(admins).where(eq(admins.magicKey, token)).limit(1);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    
    // Whitelist valid update fields for lifecycle tracking
    const updateData: any = {};
    if (body.domainStatus !== undefined) updateData.domainStatus = body.domainStatus;
    if (body.devStatus !== undefined) updateData.devStatus = body.devStatus;
    if (body.deployStatus !== undefined) updateData.deployStatus = body.deployStatus;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.githubRepo !== undefined) updateData.githubRepo = body.githubRepo;

    await db.update(projects).set(updateData).where(eq(projects.id, id));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Project Update Error:", error);
    return NextResponse.json({ error: "Update failure." }, { status: 500 });
  }
}
