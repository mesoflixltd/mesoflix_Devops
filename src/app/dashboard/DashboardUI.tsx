"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  Circle, 
  Settings, 
  ShieldCheck, 
  Activity, 
  Database,
  Globe,
  Terminal,
  LayoutDashboard,
  Bell,
  LogOut,
  Code2,
  Menu,
  X,
  MessageSquare,
  BookOpen,
  User,
  Zap,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Clock as ClockIcon,
  ChevronRight
} from "lucide-react";

export default function DashboardUI({ lead, project }: { lead: any, project: any }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Dynamic Progress Matrix
  const PROGRESS_STEPS = [
    { id: "account", label: "Account Created", completed: true, date: "Apr 26" },
    { id: "client_id", label: "Client ID Verified", completed: !!lead?.clientId, date: lead?.clientId ? "Apr 26" : null },
    { id: "domain", label: "Domain Setup", completed: false, date: null }, 
    { id: "dev", label: "Development", completed: false, date: null },
    { id: "deploy", label: "Cloud Deployment", completed: false, date: null }
  ];

  const completedCount = PROGRESS_STEPS.filter(s => s.completed).length;
  const progressPercentage = Math.round((completedCount / PROGRESS_STEPS.length) * 100);

  const switchTab = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-inter selection:bg-violet-500/30 overflow-hidden">
      
      {/* 🔝 TOP BAR (Clean + Functional) */}
      <TopBar lead={lead} setIsMobileOpen={setIsMobileOpen} isMobileOpen={isMobileOpen} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* 📂 SIDEBAR (Desktop) */}
        <aside className="w-64 border-r border-white/[0.05] bg-[#020617]/80 backdrop-blur-3xl hidden lg:flex flex-col z-20">
          <SidebarNav activeTab={activeTab} switchTab={switchTab} />
        </aside>

        {/* 📂 SIDEBAR (Mobile Overlay) */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 h-full w-64 bg-[#020617]/95 backdrop-blur-3xl border-r border-white/[0.05] flex flex-col z-50 lg:hidden shadow-[0_0_50px_rgba(139,92,246,0.15)]"
            >
              <SidebarNav activeTab={activeTab} switchTab={switchTab} />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* 🧩 MAIN DASHBOARD CONTENT AREA */}
        <main className="flex-1 overflow-y-auto w-full relative z-10 scroll-smooth">
          {/* Subtle Global Glow Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-violet-600/5 blur-[150px] pointer-events-none rounded-full" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="p-4 md:p-8 lg:p-12 pb-32 min-h-full"
            >
              {activeTab === "overview" && <ViewOverview lead={lead} project={project} progressPercentage={progressPercentage} steps={PROGRESS_STEPS} switchTab={switchTab} />}
              {activeTab === "status" && <ViewStatus project={project} steps={PROGRESS_STEPS} />}
              {activeTab === "domain" && <ViewDomain lead={lead} project={project} />}
              {activeTab === "trading" && <ViewTrading lead={lead} />}
              {activeTab === "settings" && <ViewSettings lead={lead} />}
              {activeTab === "vault" && <ViewVault lead={lead} />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------------------
// COMPONENTS
// --------------------------------------------------------------------------------------

function TopBar({ lead, setIsMobileOpen, isMobileOpen }: { lead: any, setIsMobileOpen: any, isMobileOpen: boolean }) {
  return (
    <header className="h-16 border-b border-white/[0.05] bg-[#020617]/70 backdrop-blur-2xl flex items-center justify-between px-4 lg:px-8 shrink-0 relative z-30 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* Bottom Glow Line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
      
      <div className="flex items-center gap-4">
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden text-white/50 hover:text-white transition-colors">
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-900 border border-violet-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-sm uppercase tracking-tighter italic hidden sm:block">Mesoflix DevOps</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-colors cursor-default group">
        <Globe className="w-3.5 h-3.5 text-violet-400 group-hover:text-violet-300 transition-colors animate-pulse" />
        <span className="text-[10px] font-black tracking-widest uppercase text-white/70">{lead.domainName}</span>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <a href="https://wa.me/" target="_blank" className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#25D366]/80 hover:text-[#25D366] transition-all transform hover:scale-105 active:scale-95">
          <MessageSquare className="w-4 h-4" />
          <span>Support</span>
        </a>
        <button className="relative text-white/50 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-violet-500 rounded-full border border-[#020617] animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
        </button>
        <div className="h-6 w-px bg-white/[0.1]" />
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black uppercase tracking-tighter text-white/90 leading-none group-hover:text-violet-400 transition-colors">{lead.name}</p>
            <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mt-1">Institutional Lead</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500/20 to-transparent border border-violet-500/30 flex items-center justify-center group-hover:border-violet-400 transition-all transform group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]">
            <span className="text-xs font-black text-violet-400">{lead.name.charAt(0)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function SidebarNav({ activeTab, switchTab }: { activeTab: string, switchTab: (id: string) => void }) {
  const MENU = [
    { id: "overview", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "status", label: "Project Status", icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: "domain", label: "Domain Setup", icon: <Globe className="w-4 h-4" /> },
    { id: "trading", label: "Trading Setup", icon: <Code2 className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
    { id: "vault", label: "Security Vault", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <>
      <div className="flex-1 px-4 py-8 space-y-2 overflow-y-auto scrollbar-hide">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-3 mb-6">Main Terminal</p>
        {MENU.map((item) => (
          <button
            key={item.id}
            onClick={() => switchTab(item.id)}
            className={`w-full h-11 px-4 rounded-xl flex items-center gap-3 transition-all duration-300 relative group overflow-hidden ${
              activeTab === item.id 
                ? "bg-violet-500/10 text-violet-400" 
                : "text-foreground/40 hover:bg-white/[0.03] hover:text-white"
            }`}
          >
            {activeTab === item.id && (
              <>
                <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-6 bg-violet-500 rounded-r-full shadow-[0_0_15px_rgba(139,92,246,1)]" />
                <div className="absolute inset-0 bg-violet-500/5 animate-pulse" />
              </>
            )}
            <span className={`transition-transform duration-500 ${activeTab === item.id ? "scale-110" : "group-hover:scale-110 group-hover:rotate-6"}`}>
              {item.icon}
            </span>
            <span className={`text-[11px] font-black uppercase tracking-widest ${activeTab === item.id ? "text-violet-300" : ""}`}>
              {item.label}
            </span>
            {activeTab === item.id && (
              <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
            )}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-white/[0.05] space-y-3">
        <button className="w-full h-10 px-4 rounded-xl flex items-center gap-3 text-white/40 hover:text-white hover:bg-white/[0.03] transition-all group">
          <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Priority Support</span>
        </button>
        <button className="w-full h-10 px-4 rounded-xl flex items-center gap-3 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all group">
          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
        </button>
      </div>
    </>
  );
}

function ViewOverview({ lead, project, progressPercentage, steps, switchTab }: any) {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Personalized Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2 leading-none">
            G'day, <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">{lead.name.split(" ")[0]}</span>
          </h1>
          <p className="text-white/30 font-bold text-sm">System integrity nominal. Your infrastructure nodes are currently scaling.</p>
        </div>
        <div className="flex items-center gap-6 pb-2">
          <div className="text-right">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Local Time</p>
             <p className="text-sm font-black text-white italic">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-violet-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SECTION 1: PROJECT OVERVIEW CARD */}
        <div className="lg:col-span-2 p-8 md:p-12 rounded-[3rem] bg-[#020617] border border-white/[0.08] relative overflow-hidden group shadow-2xl">
          {/* Animated Background Mesh */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/10 blur-[120px] -z-10 group-hover:bg-violet-600/20 transition-all duration-1000 animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600/10 blur-[100px] -z-10 animate-pulse" />
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-8 mb-16 relative z-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,1)]" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em] text-violet-400 leading-none">Active Build Cluster</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">{lead.domainName}</h2>
              <p className="text-xs font-bold text-white/40 mt-4 flex items-center gap-2">
                <ClockIcon className="w-3.5 h-3.5 text-violet-400" /> System update: <span className="text-white/60">2 hours ago — Kernel Patch 2.4</span>
              </p>
            </div>
            <div className="px-6 py-3 bg-violet-500/10 border border-violet-500/30 rounded-2xl flex items-center gap-3 backdrop-blur-md shadow-xl">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
              </span>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-300 italic">In Development</span>
            </div>
          </div>

          {/* SECTION 2: PROGRESS TRACKER */}
          <div className="space-y-8 relative z-10">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-white/50">Infrastructure Timeline</h3>
                <p className="text-[10px] font-bold text-white/20">Current status: {project?.status || "Processing"}</p>
              </div>
              <div className="text-right">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-4xl font-black text-violet-400 leading-none tabular-nums"
                >
                  {progressPercentage}%
                </motion.span>
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">Node Verified</p>
              </div>
            </div>
            
            {/* Animated Progress Bar */}
            <div className="h-3 w-full bg-white/[0.05] rounded-full overflow-hidden shadow-inner border border-white/[0.08] p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 2, ease: "circOut" }}
                className="h-full bg-gradient-to-r from-violet-700 via-indigo-500 to-violet-400 rounded-full relative"
              >
                <motion.div 
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-white/30 w-1/4 skew-x-[45deg] blur-md" 
                />
              </motion.div>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 pt-4">
              {steps.map((step: any, idx: number) => (
                <div key={idx} className="flex flex-col gap-3 group/step">
                  <div className={`h-1.5 w-full rounded-full transition-all duration-1000 relative ${step.completed ? 'bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.6)]' : 'bg-white/10'}`}>
                    {step.completed && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -right-1 -top-1 w-3 h-3 bg-white rounded-full flex items-center justify-center border-2 border-violet-500"
                      >
                         <Check className="w-1.5 h-1.5 text-violet-600 stroke-[4px]" />
                      </motion.div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest block transition-colors ${step.completed ? 'text-violet-300' : 'text-white/20'}`}>{step.label}</span>
                    {step.date ? (
                      <span className="text-[9px] font-bold text-white/30 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-violet-500/50" /> {step.date}
                      </span>
                    ) : (
                      <span className="text-[8px] font-black text-white/10 uppercase tracking-tighter italic">Awaiting...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 4: ACTIVITY LOG */}
        <div className="p-8 md:p-10 rounded-[3rem] bg-[#020617] border border-white/[0.08] flex flex-col shadow-2xl relative overflow-hidden">
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-violet-600/5 blur-3xl -z-10" />
          
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/40 mb-10 flex items-center gap-3">
            <Terminal className="w-4 h-4 text-violet-500" /> Execution Logs
          </h3>
          <div className="space-y-8 flex-1">
            <ActivityItem text="Awaiting DNS zone synchronization" time="Just now" active />
            <ActivityItem text="Project root created in Postgres cluster" time="2 hours ago" />
            <ActivityItem text="Institutional OAuth key validated" time="5 hours ago" />
            <ActivityItem text="Security vault device limit enforced" time="6 hours ago" />
            <ActivityItem text="Welcome protocol dispatched to inbox" time="Apr 26" />
          </div>
          
          <div className="mt-10 pt-6 border-t border-white/5">
             <button onClick={() => switchTab("status")} className="w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors flex items-center justify-center gap-3 border border-white/5 rounded-2xl hover:bg-white/[0.02]">
                View Full Lifecycle <ArrowRight className="w-3.5 h-3.5" />
             </button>
          </div>
        </div>

      </div>

      {/* SECTION 3: CONNECTION STATUS MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Domain Card */}
        <StatusCard 
          icon={<Globe className="w-6 h-6" />}
          title="Domain Setup"
          desc="Your custom URL is awaiting DNS cluster routing."
          statusText="NOT CONNECTED"
          statusType="error"
          actionText="Configure DNS"
          onClick={() => switchTab("domain")}
        />

        {/* Trading Card */}
        <StatusCard 
          icon={<Code2 className="w-6 h-6" />}
          title="Trading Grid"
          desc="System authenticated with the binary execution core."
          statusText="ACTIVE LINK"
          statusType="success"
          actionText="View API Payload"
          onClick={() => switchTab("trading")}
        />
        
        {/* Support Card */}
        <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-[#4F46E5]/40 via-[#020617] to-[#020617] border border-white/[0.08] group hover:border-[#818CF8]/40 transition-all shadow-2xl relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -z-10 group-hover:bg-indigo-500/20 transition-colors" />
          
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-8 shadow-[0_0_40px_rgba(79,70,229,0.5)] group-hover:scale-110 transition-transform duration-500">
            <Zap className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black mb-3 text-white italic uppercase tracking-tighter">Priority Tunnel</h3>
          <p className="text-xs text-white/40 font-bold mb-10 leading-relaxed">Direct encrypted access to our senior DevOps engineering channel.</p>
          
          <div className="mt-auto">
            <a href="https://wa.me/" target="_blank" className="inline-flex items-center gap-3 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-indigo-900/40 transform hover:scale-105 active:scale-95">
              <MessageSquare className="w-4 h-4" /> Message Support
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatusCard({ icon, title, desc, statusText, statusType, actionText, onClick }: any) {
  const isError = statusType === "error";
  
  return (
    <div className="p-10 rounded-[2.5rem] bg-[#020617] border border-white/[0.08] hover:border-white/20 transition-all group cursor-pointer shadow-2xl flex flex-col" onClick={onClick}>
      <div className="flex justify-between items-start mb-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${isError ? 'bg-white/5 text-white/30 group-hover:bg-red-500/10 group-hover:text-red-500' : 'bg-violet-500/10 text-violet-400 group-hover:scale-110'}`}>
          {icon}
        </div>
        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border backdrop-blur-md shadow-lg ${isError ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'}`}>
          {statusText}
        </div>
      </div>
      <h3 className="text-2xl font-black mb-3 text-white uppercase italic tracking-tighter">{title}</h3>
      <p className="text-xs text-white/30 font-bold leading-relaxed mb-10">{desc}</p>
      
      <div className="mt-auto flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-violet-400 transition-colors">
        {actionText} <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------------------
// VIEW: DOMAIN SETUP
// --------------------------------------------------------------------------------------
function ViewDomain({ lead }: any) {
  const provider = lead.domainProvider || "GoDaddy";
  
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <header>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-[1.5rem] bg-violet-600/10 flex items-center justify-center border border-violet-500/20">
            <Globe className="w-8 h-8 text-violet-400" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-violet-400 leading-none mb-2">Cluster Config</p>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Domain Routing</h1>
          </div>
        </div>
        <p className="text-white/30 font-bold text-sm max-w-2xl px-1">Connect your institutional URL to our edge delivery network via DNS Zone delegation.</p>
      </header>

      <div className="p-10 md:p-14 rounded-[3.5rem] bg-[#020617] border border-white/[0.08] shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/5 blur-[150px] -z-10" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-14 border-b border-white/[0.05] pb-10">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-4">
            <span className="text-white">Active Node:</span> 
            <span className="text-violet-400 uppercase italic tracking-tighter">{provider}</span>
          </h2>
          <div className="flex items-center gap-4 px-6 py-3 bg-red-500/5 border border-red-500/20 rounded-[2rem]">
             <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_15px_#ef4444]" />
             <span className="text-[11px] uppercase font-black tracking-[0.3em] text-red-500 italic">DNS Conflict / Redirect</span>
          </div>
        </div>
        
        <div className="space-y-14">
          <DnsStep 
            num="1" 
            title="Access DNS Command Control" 
            desc={`Sign into your ${provider} account and navigate to the "DNS Management" zone for ${lead.domainName}.`} 
          />
          
          <div className="space-y-6">
            <DnsStep 
              num="2" 
              title="Deploy Cluster A-Record" 
              desc="Create an institutional link pointing your primary domain root to our global server cluster." 
            />
            <div className="ml-16 bg-white/[0.01] border border-white/[0.05] rounded-[2.5rem] p-8 md:p-12 space-y-10 shadow-inner">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
                <DnsValue label="Record Type" value="A" />
                <DnsValue label="Host / Name" value="@" />
                <DnsValue label="Value / Target" value="76.76.21.21" copyable />
                <DnsValue label="TTL Settings" value="3600 (Auto)" />
              </div>
              <div className="pt-10 border-t border-white/[0.05]">
                <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-end">
                   <div className="flex-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4 italic">Secondary Sub-Domain Alias (CNAME)</p>
                      <div className="flex items-center justify-between p-6 bg-black/40 rounded-2xl border border-white/5">
                        <code className="text-lg font-black text-white">www</code>
                        <ChevronRight className="w-4 h-4 text-white/20" />
                        <code className="text-lg font-black text-violet-400 italic">cname.mesoflix.site</code>
                      </div>
                   </div>
                   <button className="px-6 py-3 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-white/30 hover:bg-white/10 transition-all">Copy Target</button>
                </div>
              </div>
            </div>
          </div>
          
          <DnsStep 
            num="3" 
            title="Execute Network Verification" 
            desc="Our bots will attempt to resolve the DNS path globally every 15 minutes." 
          />
        </div>

        <div className="mt-16 flex flex-col md:flex-row gap-6">
          <button className="flex-1 px-10 py-5 bg-violet-600 hover:bg-violet-500 text-white rounded-[1.5rem] font-black uppercase tracking-[0.3em] text-[12px] transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl shadow-violet-900/50 flex items-center justify-center gap-4 italic group">
             <Activity className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" /> Verify Cluster Health
          </button>
          <a href="#" className="px-10 py-5 bg-white/[0.03] hover:bg-white/[0.06] text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] transition-all border border-white/5 flex items-center justify-center gap-3">
            Read Instruction Manual <BookOpen className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

function DnsStep({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="flex gap-8 group">
      <div className="w-10 h-10 md:w-12 md:h-12 rounded-[1.25rem] bg-violet-600 flex items-center justify-center shrink-0 shadow-xl shadow-violet-900/40 group-hover:scale-110 transition-transform duration-500">
        <span className="text-sm font-black text-white italic">{num}</span>
      </div>
      <div className="pt-1.5">
        <h3 className="text-base md:text-lg font-black uppercase tracking-widest text-white mb-2 italic tracking-tight">{title}</h3>
        <p className="text-xs md:text-sm text-white/30 font-bold leading-relaxed max-w-2xl">{desc}</p>
      </div>
    </div>
  );
}

function DnsValue({ label, value, copyable = false }: { label: string, value: string, copyable?: boolean }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10 mb-3 italic">{label}</p>
      <div className={`group flex items-center justify-between gap-3 p-3 rounded-xl border border-transparent transition-all ${copyable ? 'cursor-pointer hover:bg-violet-500/5 hover:border-violet-500/20' : ''}`} onClick={copyable ? handleCopy : undefined}>
        <code className={`text-base md:text-lg font-black tracking-widest ${copyable ? 'text-violet-400 group-hover:text-violet-300' : 'text-white/60'}`}>{value}</code>
        {copyable && (
          <div className={`${copied ? 'text-green-400' : 'text-white/10 group-hover:text-violet-400'} transition-colors`}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </div>
        )}
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------------------
// VIEW: TRADING SETUP
// --------------------------------------------------------------------------------------
function ViewTrading({ lead }: any) {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <header>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-[1.5rem] bg-cyan-600/10 flex items-center justify-center border border-cyan-500/20">
            <Code2 className="w-8 h-8 text-cyan-400" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400 leading-none mb-2">Protocol</p>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Trading Core</h1>
          </div>
        </div>
        <p className="text-white/30 font-bold text-sm max-w-2xl px-1">Institutional OAuth identifiers are vaulted and synchronized with the binary execution environment.</p>
      </header>

      <div className="p-10 md:p-14 rounded-[3.5rem] bg-[#020617] border border-white/[0.08] shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-cyan-600/5 blur-[150px] -z-10 group-hover:bg-cyan-600/10 transition-all duration-1000" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-14 border-b border-white/[0.05] pb-10 gap-8">
          <h2 className="text-2xl font-black uppercase tracking-tighter italic text-cyan-400">Identity Payload</h2>
          <div className="flex items-center gap-4 px-6 py-3 bg-cyan-400/5 border border-cyan-400/20 rounded-[2rem] shadow-xl">
            <Shield className="w-4 h-4 text-cyan-400" /> 
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-cyan-400 italic">Secure OAuth Tunnel</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-4 italic">Registered App ID (Read-Only)</p>
              <div className="bg-black/60 border border-white/5 rounded-3xl p-8 flex items-center justify-between shadow-inner group/token">
                <code className="text-3xl md:text-4xl font-black tracking-[0.1em] text-white">{lead.clientId}</code>
                <CheckCircle2 className="w-8 h-8 text-cyan-400 animate-pulse" />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Badge text="Auto-Trade Validated" color="cyan" />
              <Badge text="WSS Encryption" color="cyan" />
              <Badge text="Binary Protocol v2" color="cyan" />
            </div>
          </div>

          <div className="p-10 rounded-[2.5rem] bg-white/[0.01] border border-white/[0.05] flex flex-col justify-center relative">
            <Terminal className="absolute top-6 right-6 w-5 h-5 text-white/10" />
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/30 mb-6 italic">Engineering Brief</h3>
            <p className="text-sm md:text-base font-bold text-white/50 leading-relaxed italic border-l-4 border-cyan-400 pl-8 py-2">
              "This identifier serves as the unique cryptographic bridge between your Mesoflix portal and the global trading engine. Modifications are hardware-restricted for security."
            </p>
            <div className="mt-10 pt-10 border-t border-white/5">
               <button className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-400 hover:text-cyan-300 flex items-center gap-3 transition-all transform hover:translate-x-2">
                 Modify Payload <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ text, color }: { text: string, color: "cyan" | "violet" }) {
  const styles = color === "cyan" 
    ? "text-cyan-400 bg-cyan-400/5 border-cyan-400/10" 
    : "text-violet-400 bg-violet-500/5 border-violet-500/10";
    
  return (
    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-lg ${styles}`}>
      {text}
    </span>
  );
}

// --------------------------------------------------------------------------------------
// VIEW: PROJECT STATUS (DETAILED)
// --------------------------------------------------------------------------------------
function ViewStatus({ project, steps }: any) {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <header>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600/10 flex items-center justify-center border border-indigo-500/20">
            <Terminal className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-400 leading-none mb-2">Network Layer</p>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Build Lifecycle</h1>
          </div>
        </div>
        <p className="text-white/30 font-bold text-sm max-w-2xl px-1">Complete phase-by-phase architectural breakdown of your infrastructure scaling.</p>
      </header>

      <div className="bg-[#020617] border border-white/[0.08] rounded-[3.5rem] p-2 shadow-2xl relative overflow-hidden">
        {/* Connection Line */}
        <div className="absolute left-[3.5rem] top-16 bottom-16 w-[2px] bg-gradient-to-b from-violet-600 via-indigo-600 to-transparent opacity-20" />
        
        <div className="relative z-10">
          {steps.map((step: any, index: number) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`p-10 md:p-14 flex flex-col lg:flex-row gap-10 items-start lg:items-center relative group ${index !== steps.length - 1 ? 'border-b border-white/[0.03]' : ''}`}
            >
              <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] flex items-center justify-center border-2 shrink-0 transition-all duration-700 z-10 ${
                step.completed 
                ? 'bg-violet-600 border-violet-400 text-white shadow-[0_0_30px_rgba(139,92,246,0.4)]' 
                : 'bg-[#020617] border-white/10 text-white/5'
              }`}>
                {step.completed ? (
                  <CheckCircle2 className="w-8 h-8" />
                ) : (
                  <span className="text-xl font-black italic">{index + 1}</span>
                )}
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-4">
                   <h3 className={`text-xl md:text-2xl font-black uppercase tracking-tighter italic ${step.completed ? 'text-white' : 'text-white/10'}`}>{step.label}</h3>
                   {step.date && (
                     <span className="px-3 py-1 rounded-full bg-violet-500/10 text-[10px] font-black text-violet-400 border border-violet-500/20 uppercase tracking-widest shadow-lg">
                        {step.date}
                     </span>
                   )}
                </div>
                <p className={`text-sm md:text-base font-bold leading-relaxed max-w-2xl transition-colors duration-700 ${step.completed ? 'text-white/40' : 'text-white/5'}`}>
                  {step.completed 
                    ? "Phase successfully integrated with the global build cluster. All nodes verified and reporting optimal throughput." 
                    : `Phase currently synchronized at ${index * 20}% structural threshold. Awaiting predecessor validation.`
                  }
                </p>
              </div>

              <div className="shrink-0 pt-4 lg:pt-0">
                <div className={`px-6 py-2.5 rounded-2xl border text-[11px] font-black uppercase tracking-[0.3em] italic shadow-xl transition-all duration-700 ${
                  step.completed 
                  ? 'bg-violet-500/5 text-violet-300 border-violet-500/20' 
                  : 'bg-white/[0.01] text-white/5 border-white/[0.05]'
                }`}>
                  {step.completed ? 'SUCCESS' : 'PENDING'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------------------
// VIEW: SETTINGS
// --------------------------------------------------------------------------------------
function ViewSettings({ lead }: any) {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-[1.5rem] bg-violet-600/10 flex items-center justify-center border border-violet-500/20">
            <User className="w-8 h-8 text-violet-400" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-violet-400 leading-none mb-2">Nodes</p>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Client Profile</h1>
          </div>
        </div>
        <p className="text-white/30 font-bold text-sm max-w-2xl px-1">Manage institutional credentials and secure communication tethering protocols.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 p-10 md:p-14 rounded-[3.5rem] bg-[#020617] border border-white/[0.08] shadow-2xl space-y-12">
            <h2 className="text-xl font-black uppercase tracking-tighter italic text-violet-400 flex items-center gap-4 mb-10 pb-6 border-b border-white/5">
              <span className="w-1 h-8 bg-violet-500 rounded-full" /> Institutional Parameters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <SettingsField label="Lead Authorized Identity" value={lead.name} />
               <SettingsField label="Secure Routing Address" value={lead.email} />
               <SettingsField label="Primary Network Node" value={lead.whatsapp} />
               <SettingsField label="Infrastructure Domain" value={lead.domainName} />
            </div>
            
            <div className="pt-10 flex flex-col md:flex-row gap-6">
               <button className="flex-1 px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all border border-white/5">
                 Update Local Metadata
               </button>
               <button className="flex-1 px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all shadow-xl shadow-violet-900/40">
                 Change Auth Email
               </button>
            </div>
         </div>
         
         <div className="p-10 md:p-14 rounded-[3.5rem] bg-[#020617] border border-white/[0.08] shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/5 blur-3xl -z-10" />
            
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white/20 mb-10 pb-6 border-b border-white/5">Security Protocol</h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-start p-6 rounded-[2rem] bg-orange-500/5 border border-orange-500/10">
                   <ShieldCheck className="w-8 h-8 text-orange-400 shrink-0" />
                   <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-400 mb-2 italic">Immutable Vault</p>
                      <p className="text-[11px] font-bold text-orange-200/40 leading-relaxed italic">"Primary identity signatures are pinned to the DevOps zero-trust layer. Modifications require multi-factor engineer approval."</p>
                   </div>
                </div>
                
                <div className="p-6 rounded-[2rem] bg-white/[0.01] border border-white/[0.05]">
                   <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">Auth Method</p>
                   <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-violet-400" />
                      <span className="text-xs font-black text-white italic uppercase tracking-tighter">Passwordless Magic-Key</span>
                   </div>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-14 px-8 py-4 border border-red-500/20 text-red-500/40 hover:bg-red-500/10 hover:border-red-500/40 hover:text-red-500 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all duration-500 italic">
               Disconnect Session Node 01
            </button>
         </div>
      </div>
    </div>
  );
}

function SettingsField({ label, value }: { label: string, value: string }) {
  return (
    <div className="group">
       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 mb-3 italic group-hover:text-violet-500 transition-colors">{label}</p>
       <div className="p-5 bg-black/40 border border-white/5 rounded-2xl text-base font-bold text-white/70 shadow-inner group-hover:border-white/10 transition-colors">
          {value}
       </div>
    </div>
  );
}

// --------------------------------------------------------------------------------------
// VIEW: VAULT
// --------------------------------------------------------------------------------------
function ViewVault({ }: any) {
  return (
    <div className="max-w-4xl mx-auto py-24 text-center space-y-14 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/5 blur-[150px] -z-10 rounded-full" />
      
      <div className="relative inline-block">
        <div className="w-32 h-32 md:w-36 md:h-36 rounded-[2.5rem] bg-gradient-to-br from-violet-700 to-indigo-900 border-2 border-violet-500/30 flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(139,92,246,0.3)] perspective-1000">
          <ShieldCheck className="w-14 h-14 md:w-16 md:h-16 text-white shadow-2xl" />
        </div>
        <motion.div 
           animate={{ rotate: 360 }}
           transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
           className="absolute inset-0 -m-8 border-2 border-violet-500/10 rounded-full border-dashed p-1" 
        />
        <motion.div 
           animate={{ rotate: -360 }}
           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
           className="absolute inset-0 -m-14 border border-indigo-500/5 rounded-full border-dashed" 
        />
      </div>
      
      <div className="space-y-6">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 uppercase italic leading-none">Security Vault</h1>
        <p className="text-white/30 font-bold max-w-xl mx-auto leading-relaxed text-sm md:text-base">
          Our Zero-Trust architecture continuously monitors your biometric session. Access is restricted to authorized hardware nodes only.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-3xl mx-auto">
         <VaultModule 
           icon={<Shield className="w-6 h-6" />}
           label="Active Network Node"
           value="76.76.21.21"
           color="violet"
         />
         <VaultModule 
           icon={<CheckCircle2 className="w-6 h-6" />}
           label="Node Integrity"
           value="AUTHENTICATED"
           color="cyan"
         />
      </div>
      
      <div className="max-w-lg mx-auto pt-10">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 mb-6 italic">Active Telemetry</p>
         <div className="flex justify-between items-center px-8 py-5 bg-white/[0.01] border border-white/[0.05] rounded-3xl backdrop-blur-xl">
            <span className="text-[11px] font-black text-white/20 uppercase tracking-widest">Authorized Device Limit</span>
            <span className="text-xl font-black text-violet-400 italic">02 / 02</span>
         </div>
      </div>
    </div>
  );
}

function VaultModule({ icon, label, value, color }: any) {
  const styles = color === "cyan" ? "text-cyan-400 bg-cyan-400/5" : "text-violet-400 bg-violet-400/5 text-shadow-glow-violet";
  const borderStyles = color === "cyan" ? "border-cyan-400/10" : "border-violet-500/10";
  
  return (
    <div className={`p-8 rounded-[2.5rem] bg-[#020617] border ${borderStyles} flex items-center gap-6 shadow-2xl relative overflow-hidden group`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-3xl -z-10 group-hover:bg-white/10 transition-all" />
      <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center shrink-0 border ${borderStyles} ${styles}`}>
         {icon}
      </div>
      <div>
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-1">{label}</p>
         <p className={`text-lg font-black italic tracking-tighter ${styles.split(' ')[0]}`}>{value}</p>
      </div>
    </div>
  );
}

function ActivityItem({ text, time, active = false }: { text: string, time: string, active?: boolean }) {
  return (
    <div className="flex gap-5 items-start">
      <div className="mt-1.5 relative flex items-center justify-center p-1">
        <div className={`w-2.5 h-2.5 rounded-full ${active ? 'bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,1)]' : 'bg-white/10'}`} />
        {active && <div className="absolute w-5 h-5 bg-violet-400/20 rounded-full animate-ping" />}
      </div>
      <div>
        <p className={`text-xs md:text-sm font-bold ${active ? 'text-white' : 'text-white/60'}`}>{text}</p>
        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mt-1">{time}</p>
      </div>
    </div>
  );
}
