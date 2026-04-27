import { db } from "@/db";
import { admins, leads, projects } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { cookies } from "next/headers";
import AdminUI from "./AdminUI";
import { ShieldAlert } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("mesoflix_admin_session")?.value;

  if (!sessionToken) {
    return <AdminLoginGate />;
  }

  const [admin] = await db.select().from(admins).where(eq(admins.magicKey, sessionToken)).limit(1);

  if (!admin) {
    return <AdminLoginGate />;
  }

  // Fetch Ecosystem Data
  const allLeads = await db.select().from(leads).orderBy(desc(leads.createdAt));
  const allProjects = await db.select().from(projects);

  return <AdminUI admin={admin} leads={allLeads} projects={allProjects} />;
}

function AdminLoginGate() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 space-y-12">
      <div className="w-24 h-24 rounded-[2rem] bg-red-600/10 border border-red-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.2)]">
        <ShieldAlert className="w-12 h-12 text-red-500 animate-pulse" />
      </div>
      
      <div className="text-center max-w-sm space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">Authority Required</h1>
          <p className="text-white/40 text-sm font-bold leading-relaxed">
            Staff access restricted to authorized personnel. Use your magic key or initialize a new authority session below.
          </p>
        </div>

        <AdminOnboardingForm />
      </div>
    </div>
  );
}

import AdminOnboardingForm from "./OnboardingForm";
