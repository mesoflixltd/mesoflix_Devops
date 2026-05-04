export const dynamic = "force-dynamic";

import { db } from "@/db";
import { leads, projects } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import DashboardUI from "./DashboardUI";
import { Rocket, ShieldAlert } from "lucide-react";

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ auth_token?: string; token?: string }> }) {
  const awaitedParams = await searchParams;
  const token = awaitedParams?.token || awaitedParams?.auth_token;
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("mesoflix_session")?.value;

  // 1. Intercept URL parameter attempts and reroute them through the Auth API strictly
  // Loop-breaker: Only redirect if the URL token is different from the current session token
  if (token && token !== sessionToken) {
    redirect(`/api/auth/verify?token=${token}`);
  }

  // 2. Initial Gatekeeper Check (Only reads the secure session cookie)
  if (!sessionToken) {
    return <UnauthorizedView />;
  }

  try {
    // 3. Database Identity Verification
    const [lead] = await db.select().from(leads).where(eq(leads.magicKey, sessionToken)).limit(1);

    if (!lead) {
      return <UnauthorizedView />;
    }

    // Fetch contextual Project ecosystem details
    const [project] = await db.select().from(projects).where(eq(projects.leadId, lead.id)).limit(1);

    // 4. Pass validated identity layer and project context to the interactive client UI
    return <DashboardUI lead={lead} project={project || null} />;
  } catch (error) {
    console.error("Database connection error during SSR:", error);
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-red-500 animate-pulse" />
        <h1 className="text-2xl font-black uppercase text-red-500">Database Connection Failed</h1>
        <p className="text-sm text-white/50 max-w-md">
          The dashboard could not connect to the database. If you just deployed to Netlify, make sure you have added the <span className="text-white font-bold bg-white/10 px-2 py-1 rounded">DATABASE_URL</span> environment variable in your Netlify site settings.
        </p>
      </div>
    );
  }
}

function UnauthorizedView() {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center font-inter p-6 space-y-6">
      <div className="w-16 h-16 rounded-[1.5rem] bg-accent/10 border border-accent/20 flex items-center justify-center shadow-[0_0_40px_rgba(255,68,79,0.2)]">
        <ShieldAlert className="w-8 h-8 text-accent animate-pulse" />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-white/90">Authentication Required</h1>
        <p className="text-foreground/50 text-sm font-bold max-w-sm mx-auto leading-relaxed">
          This secure dashboard instance requires a biometric puzzle key. Please check your system initialization email to access your infrastructure.
        </p>
      </div>
    </div>
  );
}
