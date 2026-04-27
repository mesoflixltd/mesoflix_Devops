"use client";

import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Settings, 
  ShieldCheck, 
  Activity, 
  Database,
  Globe,
  Terminal,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";

const STATUS_ITEMS = [
  { id: 1, label: "Registered", status: "completed" },
  { id: 2, label: "Deriv Verified (OAuth)", status: "completed" },
  { id: 3, label: "Domain Setup", status: "pending" },
  { id: 4, label: "Project Development", status: "pending" },
  { id: 5, label: "Deployment", status: "pending" }
];

export default function DashboardUI({ lead }: { lead: any }) {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex font-inter selection:bg-accent/30">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 border-r border-white/[0.05] bg-[#020617]/50 backdrop-blur-xl flex flex-col items-center lg:items-start p-6">
        <div className="flex items-center gap-3 mb-12 hidden lg:flex">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-sm uppercase tracking-tighter italic">Mesoflix</span>
        </div>

        <nav className="flex-1 space-y-4 w-full">
          <SidebarItem icon={<LayoutDashboard />} label="Overview" active />
          <SidebarItem icon={<Settings />} label="Project Settings" />
          <SidebarItem icon={<ShieldCheck />} label="Security Vault" />
          <SidebarItem icon={<Terminal />} label="System Logs" />
        </nav>

        <div className="pt-8 border-t border-white/5 w-full mt-auto text-center lg:text-left">
          <div className="hidden lg:block text-[10px] font-black uppercase tracking-widest text-accent mb-1">{lead.domainName}</div>
          <div className="hidden lg:block text-xs font-bold text-foreground/40 break-all w-full">{lead.email}</div>
          <div className="w-10 h-10 rounded-full bg-white/5 mx-auto lg:hidden flex items-center justify-center">
            <span className="text-xs font-black text-accent">{lead.name.charAt(0)}</span>
          </div>
        </div>
      </aside>

      {/* Main Dashboard Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-2">Systems Online</p>
              <h1 className="text-3xl font-black tracking-tight">{lead.name}'s Command Center</h1>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-[10px] font-bold tracking-widest text-white/50 shadow-inner uppercase">
                {lead.domainName}
              </div>
              <div className="px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-[10px] font-black tracking-widest text-accent shadow-inner uppercase">
                {lead.apiConfig}
              </div>
              <div className="h-10 w-10 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-accent animate-pulse" />
              </div>
            </div>
          </header>

          {/* Project Timeline Card */}
          <section className="p-8 lg:p-12 border border-white/[0.05] bg-white/[0.01] rounded-[2rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] -z-10" />
            <div className="max-w-md">
              <h2 className="text-xl font-black mb-10 flex items-center gap-3 uppercase tracking-tighter">
                <Clock className="w-5 h-5 text-accent" />
                Project Status Timeline
              </h2>

              <div className="space-y-0">
                {STATUS_ITEMS.map((item, index) => (
                  <div key={index} className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                        item.status === "completed" 
                        ? "bg-accent border-accent text-white" 
                        : "border-white/10 text-white/10"
                      } relative z-10 transition-colors`}>
                        {item.status === "completed" ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-1 h-1 fill-current" />}
                      </div>
                      {index !== STATUS_ITEMS.length - 1 && (
                        <div className={`w-0.5 h-16 ${item.status === "completed" ? "bg-accent" : "bg-white/5"} transition-colors`} />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <span className={`text-sm font-black uppercase tracking-widest ${
                        item.status === "completed" ? "text-white" : "text-white/20"
                      } group-hover:text-amber-500/80 transition-colors`}>
                        {item.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DashCard icon={<Database className="w-5 h-5" />} label="Domain Target" value={lead.domainProvider} />
            <DashCard icon={<Code2 className="w-5 h-5" />} label="Identity Linked" value={lead.clientId} />
            <DashCard icon={<Globe className="w-5 h-5" />} label="WhatsApp Network" value={lead.whatsapp} />
          </div>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`h-12 w-full lg:px-4 rounded-lg flex items-center justify-center lg:justify-start gap-4 cursor-pointer transition-all ${
      active ? "bg-accent text-white shadow-lg shadow-accent/20" : "text-foreground/30 hover:bg-white/5 hover:text-white"
    }`}>
      <span className="w-5 h-5">{icon}</span>
      <span className="text-xs font-black uppercase tracking-widest hidden lg:block">{label}</span>
    </div>
  );
}

function DashCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="p-8 border border-white/[0.05] bg-white/[0.01] rounded-2xl">
      <div className="text-accent mb-4">{icon}</div>
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 mb-1">{label}</p>
      <p className="text-sm font-bold tracking-tight truncate w-full" title={value}>{value}</p>
    </div>
  );
}

function Code2({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}
