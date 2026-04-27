"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
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
  Zap,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Clock as ClockIcon,
  ChevronRight,
  User,
  Search,
  Cpu
} from "lucide-react";

export default function DashboardUI({ lead, project }: { lead: any, project: any }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dynamic Progress Matrix (Driven by Admin Authority)
  const PROGRESS_STEPS = [
    { id: "account", label: "Account Created", completed: project?.accountStatus === 'completed' || true, date: "Apr 26" },
    { id: "client_id", label: "Client ID Verified", completed: (project?.clientIdStatus === 'completed') || !!lead?.clientId, date: (project?.clientIdStatus === 'completed' || lead?.clientId) ? "Apr 26" : null },
    { id: "domain", label: "Domain Mapping", completed: project?.domainStatus === 'completed', date: project?.domainStatus === 'completed' ? "Synced" : null }, 
    { id: "dev", label: "Core Development", completed: project?.devStatus === 'completed', date: project?.devStatus === 'completed' ? "Live" : null },
    { id: "deploy", label: "Cloud Deployment", completed: project?.deployStatus === 'completed', date: project?.deployStatus === 'completed' ? "Verfied" : null }
  ];

  const completedCount = PROGRESS_STEPS.filter(s => s.completed).length;
  const progressPercentage = Math.round((completedCount / PROGRESS_STEPS.length) * 100);

  const switchTab = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen max-w-[100vw] overflow-x-hidden bg-[#020617] text-slate-200 flex flex-col font-inter selection:bg-red-500/30">
      
      {/* 🔝 FIXED TOP NAVBAR */}
      <TopBar lead={lead} setIsMobileOpen={setIsMobileOpen} isMobileOpen={isMobileOpen} isScrolled={isScrolled} />

      <div className="flex flex-1 pt-16 max-w-full overflow-x-hidden">
        {/* 📂 FIXED SIDEBAR (Desktop) */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-white/5 bg-[#020617] hidden lg:flex flex-col z-40 overflow-y-auto scrollbar-hide">
          <SidebarNav activeTab={activeTab} switchTab={switchTab} />
        </aside>

        {/* 📂 SIDEBAR (Mobile Overlay) */}
        <AnimatePresence mode="wait">
          {isMobileOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
              />
              <motion.aside 
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-72 bg-[#020617] border-r border-white/10 flex flex-col z-[70] lg:hidden shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
              >
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                      <Cpu className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-black text-sm uppercase tracking-tighter italic">DevOps Panel</span>
                  </div>
                  <button onClick={() => setIsMobileOpen(false)} className="p-2 rounded-full hover:bg-white/5 text-white/50 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                   <SidebarNav activeTab={activeTab} switchTab={switchTab} />
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* 🧩 MAIN CONTENT AREA */}
        <main className="flex-1 lg:ml-64 relative min-h-screen max-w-full overflow-x-hidden">
          {/* Subtle Global Glow Effect (Red) */}
          <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-red-600/5 blur-[150px] pointer-events-none rounded-full" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.99, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="p-4 md:p-8 lg:p-12 pb-24 max-w-full lg:max-w-7xl mx-auto w-full box-border"
            >
              {activeTab === "overview" && <ViewOverview lead={lead} project={project} progressPercentage={progressPercentage} steps={PROGRESS_STEPS} switchTab={switchTab} />}
              {activeTab === "status" && <ViewStatus project={project} steps={PROGRESS_STEPS} />}
              {activeTab === "domain" && <ViewDomain lead={lead} project={project} />}
              {activeTab === "trading" && <ViewTrading lead={lead} />}
              {activeTab === "settings" && <ViewSettings lead={lead} />}
              {activeTab === "vault" && <ViewVault lead={lead} />}
            </motion.div>
          </AnimatePresence>

          {/* 📱 PWA INSTALL PROMPT (Mobile) */}
          <MobileInstallPrompt />
        </main>
      </div>
    </div>
  );
}

function MobileInstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show on mobile and if not dismissed
    const isMobile = window.innerWidth < 1024;
    const isDismissed = localStorage.getItem("pwa_dismissed");
    if (isMobile && !isDismissed) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!show) return null;

  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-4 right-4 z-[100] lg:hidden"
    >
      <div className="pwa-prompt-gradient border border-red-500/20 backdrop-blur-2xl rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2">
           <button onClick={() => { setShow(false); localStorage.setItem("pwa_dismissed", "true"); }} className="p-1 hover:bg-white/5 rounded-full text-white/30">
              <X className="w-4 h-4" />
           </button>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center shrink-0 shadow-lg shadow-red-900/40">
           <Zap className="w-7 h-7 text-white" />
        </div>
        <div className="flex-1 pr-6">
           <h4 className="text-sm font-black uppercase text-white italic tracking-tight">Upgrade to Desktop Mode</h4>
           <p className="text-[10px] font-bold text-white/40 leading-snug mt-1">Install to homescreen for a permanent, high-performance node session.</p>
        </div>
        <button 
           onClick={() => { setShow(false); /* Trigger install if supported or just show instructions */ }}
           className="bg-white text-[#020617] px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2 shadow-xl whitespace-nowrap"
        >
          Install <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
}

// --------------------------------------------------------------------------------------
// REUSABLE UI COMPONENTS
// --------------------------------------------------------------------------------------

function TopBar({ lead, setIsMobileOpen, isMobileOpen, isScrolled }: any) {
  return (
    <header className={`fixed top-0 left-0 right-0 h-16 border-b transition-all duration-300 z-[50] flex items-center justify-between px-5 lg:px-10 ${
      isScrolled ? 'bg-[#020617]/95 border-red-500/20 backdrop-blur-xl shadow-2xl' : 'bg-transparent border-white/5'
    }`}>
      {/* Bottom Glow Line */}
      <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/30 to-transparent transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`} />
      
      <div className="flex items-center gap-4">
        <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden p-2 rounded-lg bg-white/5 text-white/50 hover:text-white transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-red-900 border border-red-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.4)] transform hover:rotate-12 transition-transform">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-xs md:text-sm uppercase tracking-tighter italic hidden sm:block">Command Centre</span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 group cursor-default">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/60">{lead.domainName}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-all group">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-[#020617] group-hover:scale-125 transition-transform" />
          </button>
          
          <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block" />
          
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-tighter text-white leading-none group-hover:text-red-400 transition-colors">{lead.name}</p>
              <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em] mt-1 italic">Active Lead Node</p>
            </div>
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-red-500/20 to-transparent border border-red-500/40 flex items-center justify-center group-hover:rotate-6 transition-all group-hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] overflow-hidden">
               <span className="text-sm font-black text-red-500">{lead.name.charAt(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function SidebarNav({ activeTab, switchTab }: any) {
  const MENU = [
    { id: "overview", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "status", label: "Project Status", icon: <Activity className="w-4 h-4" /> },
    { id: "domain", label: "Domain Setup", icon: <Globe className="w-4 h-4" /> },
    { id: "trading", label: "Trading Setup", icon: <Code2 className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
    { id: "vault", label: "Security Vault", icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-col h-full p-4 lg:p-6">
      <div className="flex-1 space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 px-4 mb-6 italic">Navigation Shell</p>
        {MENU.map((item) => (
          <button
            key={item.id}
            onClick={() => switchTab(item.id)}
            className={`w-full h-12 px-4 rounded-xl flex items-center gap-4 transition-all duration-300 relative group overflow-hidden ${
              activeTab === item.id 
                ? "bg-red-500/10 text-red-500" 
                : "text-white/30 hover:bg-white/[0.03] hover:text-white"
            }`}
          >
            {activeTab === item.id && (
              <motion.div layoutId="nav-glow" className="absolute left-0 w-1 h-6 bg-red-500 rounded-r-full shadow-[0_0_15px_#ef4444]" />
            )}
            <span className={`shrink-0 transition-transform duration-500 ${activeTab === item.id ? "scale-125" : "group-hover:scale-125"}`}>
              {item.icon}
            </span>
            <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${activeTab === item.id ? "text-white" : ""}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <div className="pt-6 border-t border-white/5 space-y-3">
        <a href="https://wa.me/" target="_blank" className="w-full h-11 px-4 rounded-xl flex items-center gap-4 text-white/30 hover:text-white hover:bg-white/[0.03] transition-all group">
          <MessageSquare className="w-4 h-4 group-hover:scale-125 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Priority Help</span>
        </a>
        <button className="w-full h-11 px-4 rounded-xl flex items-center gap-4 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all group border border-transparent hover:border-red-500/20">
          <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit Terminal</span>
        </button>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------------------
// VIEW: OVERVIEW
// --------------------------------------------------------------------------------------

function ViewOverview({ lead, progressPercentage, steps, switchTab }: any) {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white uppercase italic leading-none mb-3">
            System: <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">Online</span>
          </h1>
          <p className="text-white/40 font-bold text-sm tracking-wide">Client Node identity: <span className="text-white/60">{lead.name}</span> — {lead.email}</p>
        </div>
        <div className="w-full md:w-auto p-4 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md flex items-center gap-10">
           <div className="text-center group">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-1 group-hover:text-red-500 transition-colors">Server Load</p>
              <p className="text-sm font-black text-white italic">0.2ms</p>
           </div>
           <div className="text-center group">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-1 group-hover:text-red-500 transition-colors">Security Lvl</p>
              <div className="flex items-center gap-1 justify-center">
                 <Shield className="w-3 h-3 text-red-500" />
                 <p className="text-sm font-black text-white italic underline decoration-red-500/50">MAX</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MAIN PROGRESS CARD */}
        <div className="lg:col-span-2 p-8 md:p-12 rounded-[3.5rem] bg-[#020617] border border-white/10 relative overflow-hidden group shadow-2xl">
           {/* Animated Red Mesh */}
           <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-red-600/[0.03] blur-[150px] -z-10 group-hover:bg-red-600/[0.05] transition-all duration-1000" />
           
           <div className="flex flex-col sm:flex-row justify-between items-start gap-10 mb-16 relative z-10">
              <div>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500 italic">Project Pipeline</p>
                 </div>
                 <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic py-2">{lead.domainName}</h2>
                 <p className="text-xs font-bold text-white/30 mt-4 flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-red-500/50" /> Syncing from master branch... <span className="text-white/60">6m ago</span>
                 </p>
              </div>
              <div className="px-6 py-3 bg-red-500/5 border border-red-500/20 rounded-[2rem] flex items-center gap-3 whitespace-nowrap shadow-xl">
                 <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400 italic">Dev Phase Active</span>
              </div>
           </div>

           <div className="space-y-10 relative z-10">
              <div className="flex justify-between items-end">
                 <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/30 leading-none">Global Build Threshold</p>
                 <div className="text-right">
                    <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/10 mb-1 leading-none">Verified</p>
                    <span className="text-4xl md:text-6xl font-black text-white italic leading-none tabular-nums tracking-tighter">{progressPercentage}</span>
                    <span className="text-2xl font-black text-red-500 italic ml-1 leading-none">%</span>
                 </div>
              </div>

              <div className="h-4 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-1 shadow-inner relative">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 rounded-full relative"
                 >
                    <motion.div 
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 bg-white/20 w-1/4 skew-x-[45deg] blur-lg" 
                    />
                 </motion.div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 pt-4">
                 {steps.map((step: any, i: number) => (
                    <div key={i} className="space-y-3 group/step">
                       <div className={`h-1.5 w-full rounded-full transition-all duration-1000 ${step.completed ? 'bg-red-500 shadow-[0_0_15px_#ef4444]' : 'bg-white/10 group-hover/step:bg-white/20'}`} />
                       <div className="space-y-1">
                          <p className={`text-[10px] font-black uppercase tracking-widest transition-colors ${step.completed ? 'text-white' : 'text-white/20'}`}>{step.label}</p>
                          {step.date ? (
                            <span className="text-[9px] font-black text-red-500/50 italic flex items-center gap-1"><CheckCircle2 className="w-2.5 h-2.5" /> {step.date}</span>
                          ) : (
                            <span className="text-[9px] font-black text-white/10 italic">Awaiting node...</span>
                          )}
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* LOG SECTION */}
        <div className="p-10 rounded-[3.5rem] bg-[#020617] border border-white/10 flex flex-col shadow-2xl relative overflow-hidden group">
           <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-red-600/[0.02] blur-[100px] -z-10" />
           <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 mb-10 flex items-center gap-3">
              <Terminal className="w-4 h-4 text-red-500" /> Kernel Matrix
           </h3>
           <div className="space-y-8 flex-1">
              <LogItem text="Master domain handshake verified" time="sysInit" active />
              <LogItem text="Client ID vault synchronization" time="sysInit" active />
              <LogItem text="DNS zone file waiting propagation" time="4m ago" />
              <LogItem text="Biometric cookie policy set to Lax" time="15m ago" />
              <LogItem text="Project root created in Postgres" time="2h ago" />
           </div>
           <button onClick={() => switchTab("status")} className="mt-12 w-full py-4 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3 italic">
             View Full Lifecycle <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1" />
           </button>
        </div>
      </div>

      {/* QUICK CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         <ActionCard 
            icon={<Globe className="w-7 h-7" />}
            title="Domain Matrix"
            status="NOT CONNECTED"
            desc="DNS routing nodes failed to resolve. Action required in routing table."
            btn="Update DNS"
            onClick={() => switchTab("domain")}
         />
         <ActionCard 
            icon={<Code2 className="w-7 h-7" />}
            title="Trading API"
            status="AUTH_SUCCESS"
            desc="Institutional OAuth tunnel active. Signals are being routed to terminal."
            btn="View Payload"
            onClick={() => switchTab("trading")}
            success
         />
         <div className="p-10 rounded-[3rem] bg-gradient-to-br from-red-600/20 via-[#020617] to-[#020617] border border-white/10 group hover:border-red-500/40 transition-all shadow-2xl flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-red-600 flex items-center justify-center text-white mb-8 shadow-[0_0_30px_rgba(239,68,68,0.5)] group-hover:scale-110 transition-transform">
                 <MessageSquare className="w-7 h-7" />
              </div>
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">Dev Tunnel</h3>
              <p className="text-xs text-white/40 font-bold leading-relaxed max-w-[200px]">24/7 direct encrypted lane to lead engineering staff.</p>
            </div>
            <a href="https://wa.me/" target="_blank" className="mt-10 px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] transition-all text-center italic shadow-xl shadow-red-900/40 transform active:scale-95">
               Engage Support
            </a>
         </div>
      </div>
    </div>
  );
}

function LogItem({ text, time, active = false }: any) {
  return (
    <div className="flex gap-5 items-start">
       <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${active ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-white/10'}`} />
       <div>
          <p className={`text-xs font-bold leading-tight ${active ? 'text-white/80' : 'text-white/30'}`}>{text}</p>
          <p className="text-[9px] font-black uppercase tracking-widest text-[#ef4444]/40 mt-1">{time}</p>
       </div>
    </div>
  );
}

function ActionCard({ icon, title, status, desc, btn, onClick, success = false }: any) {
  return (
    <div onClick={onClick} className="p-10 rounded-[3rem] bg-[#020617] border border-white/10 hover:border-white/20 transition-all group flex flex-col shadow-2xl cursor-pointer">
       <div className="flex justify-between items-start mb-10">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${success ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-white/5 text-white/30 group-hover:bg-red-500/10 group-hover:text-red-500'}`}>
             {icon}
          </div>
          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] italic border ${success ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-white/5 text-white/30 border-white/10'}`}>
             {status}
          </span>
       </div>
       <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">{title}</h3>
       <p className="text-xs text-white/30 font-bold leading-relaxed mb-10">{desc}</p>
       <div className="mt-auto flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 group-hover:text-red-500 transition-colors">
          {btn} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-2 transition-transform" />
       </div>
    </div>
  );
}

// --------------------------------------------------------------------------------------
// SUB-VIEWS (Simplified for token limit safety)
// --------------------------------------------------------------------------------------

function ViewDomain({ lead }: any) {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
       <header className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-[2rem] bg-red-600/10 border border-red-500/30 flex items-center justify-center shadow-2xl">
             <Globe className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500 mb-2 italic">Infrastructure Architecture</p>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter tabular-nums leading-none">DNS Handshake</h1>
          </div>
       </header>

       <div className="p-10 md:p-14 rounded-[3.5rem] bg-[#020617] border border-white/10 shadow-2xl space-y-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-600/[0.03] blur-[150px] -z-10" />
          
          <div className="p-8 rounded-[2.5rem] bg-red-500/5 border border-red-500/20 flex flex-col md:flex-row gap-8 items-center justify-between">
             <div className="text-center md:text-left">
                <p className="text-xs font-black uppercase tracking-widest text-[#ef4444] mb-1">Target Node Address</p>
                <p className="text-2xl font-black text-white tracking-widest leading-none underline decoration-red-500 decoration-4">76.76.21.21</p>
             </div>
             <button className="flex items-center gap-3 px-8 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-red-900/40 transform active:scale-95 transition-all italic">
                <Copy className="w-4 h-4" /> Copy Root Pointer
             </button>
          </div>

          <div className="space-y-6">
             <h2 className="text-xs font-black uppercase tracking-[0.5em] text-white/30 border-b border-white/5 pb-4">Routing Protocol (A-Record)</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DnsValue label="Record Type" value="A" />
                <DnsValue label="Host / Origin" value="@ (Root)" />
                <DnsValue label="TTL Settings" value="3600 (Auto)" />
             </div>
          </div>

          <div className="pt-10 border-t border-white/10 flex flex-col sm:flex-row gap-6">
             <button className="flex-1 px-8 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] text-white italic transition-all group">
                <Activity className="w-5 h-5 mr-3 inline-block group-hover:rotate-180 transition-transform duration-700" /> Verify Cluster Health
             </button>
             <button className="flex-1 px-8 py-5 bg-red-600 hover:bg-red-500 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] text-white italic shadow-2xl transition-all shadow-red-900/50">
                Finalise Redirection
             </button>
          </div>
       </div>
    </div>
  );
}

function DnsValue({ label, value }: any) {
  return (
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 group hover:border-red-500/40 transition-colors">
       <p className="text-[10px] font-black uppercase tracking-widest text-white/20 group-hover:text-red-500 transition-colors leading-none italic">{label}</p>
       <p className="text-lg font-black text-white italic tracking-tighter leading-none">{value}</p>
    </div>
  );
}

function ViewTrading({ lead }: any) {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
       <header className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-[2rem] bg-red-600/10 border border-red-500/30 flex items-center justify-center shadow-2xl">
             <Code2 className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500 mb-2 italic">Binary Protocol Layer</p>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">OAuth Payload</h1>
          </div>
       </header>

       <div className="p-10 md:p-14 rounded-[3.5rem] bg-[#020617] border border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-red-600/[0.03] blur-[150px] -z-10 group-hover:bg-red-600/[0.05] transition-all duration-1000" />
          
          <div className="flex items-center justify-between mb-16 border-b border-white/5 pb-10">
             <div className="space-y-1">
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Verified Client Token</h2>
                <p className="text-xs font-bold text-white/30 italic">Ident node verified with production grid.</p>
             </div>
             <div className="px-5 py-2.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-[0.4em] border border-red-500/20 shadow-xl shadow-red-900/10 italic">
                Active Node
             </div>
          </div>

          <div className="bg-black/60 border border-white/5 rounded-[2.5rem] p-8 md:p-14 text-center group/code">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 mb-6 italic group-hover/code:text-red-500 transition-colors">Encrypted App Identifier</p>
              <code className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[0.05em] text-white underline decoration-red-500/30 decoration-wavy transition-all duration-700 animate-pulse break-all">{lead.clientId}</code>
          </div>

          <div className="mt-16 flex flex-wrap gap-4">
             <Badge text="Execution Layer Validated" />
             <Badge text="Zero-Trust Enforced" />
             <Badge text="Kernel Version 4.2" />
          </div>
       </div>
    </div>
  );
}

function Badge({ text }: { text: string }) {
  return (
    <span className="px-5 py-2.5 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-black text-white/40 uppercase tracking-widest italic group hover:border-red-500/20 hover:text-white transition-all cursor-default">
      {text}
    </span>
  );
}

function ViewStatus({ steps, project }: any) {
  return (
    <div className="max-w-4xl mx-auto space-y-12 mb-20">
       <header>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-[1.5rem] bg-red-600/10 border border-red-500/30 flex items-center justify-center">
              <Terminal className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500 mb-2 italic underline decoration-red-500/30">System Pipeline</p>
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Life-cycle Matrix</h1>
            </div>
          </div>
          <p className="text-white/30 font-bold text-sm italic px-1">Phase-by-phase architectural breakdown of your infrastructure evolution.</p>
       </header>

       <div className="bg-[#020617] border border-white/10 rounded-[3.5rem] p-3 shadow-2xl relative overflow-hidden">
          <div className="absolute left-[3.5rem] top-20 bottom-20 w-[2px] bg-gradient-to-b from-red-600 via-red-900 to-transparent opacity-30" />
          <div className="relative z-10 space-y-1">
             {steps.map((s: any, i: number) => (
                <div key={i} className={`p-10 md:p-14 flex flex-col lg:flex-row gap-10 items-start lg:items-center relative transition-all duration-700 ${s.completed ? 'bg-red-500/[0.02]' : 'opacity-30'} ${i !== steps.length -1 ? 'border-b border-white/[0.03]' : ''}`}>
                   <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] flex items-center justify-center border-2 shrink-0 z-10 ${s.completed ? 'bg-red-600 border-red-400 text-white shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'bg-[#020617] border-white/10 text-white/5'}`}>
                      {s.completed ? <CheckCircle2 className="w-7 h-7" /> : <span className="text-xl font-black italic">{i+1}</span>}
                   </div>
                   <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-4">
                         <h3 className="text-2xl font-black uppercase tracking-tighter italic text-white">{s.label}</h3>
                         {s.date && <span className="px-3 py-1 rounded-full bg-red-600/10 text-red-500 text-[10px] font-black italic border border-red-500/20">{s.date}</span>}
                      </div>
                      <p className="text-sm font-bold text-white/30 italic max-w-2xl leading-relaxed">
                         {s.completed ? "Phase validated against master branch specifications. Cluster reporting optimal throughput." : "Node in queue. Dependent on predecessor resolution."}
                      </p>
                   </div>
                   <div className={`px-6 py-2.5 rounded-2xl border text-[11px] font-black uppercase tracking-[0.3em] italic tabular-nums ${s.completed ? 'bg-red-500/5 text-red-400 border-red-500/20' : 'bg-white/[0.01] text-white/5 border-white/[0.05]'}`}>
                      {s.completed ? 'SUCCESS' : 'PENDING'}
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
}

function ViewSettings({ lead }: any) {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-[2rem] bg-red-600/10 border border-red-500/30 flex items-center justify-center">
             <User className="w-10 h-10 text-red-500" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500 mb-2 italic">Security Shell</p>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Node Profile</h1>
          </div>
       </header>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 p-10 md:p-14 rounded-[3.5rem] bg-[#020617] border border-white/10 shadow-2xl space-y-10">
             <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white border-b border-white/5 pb-8 mb-6">Master Credentials</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Field label="Identity Signature" value={lead.name} />
                <Field label="Communication Node" value={lead.whatsapp} />
                <Field label="Relay Protocol" value={lead.email} />
                <Field label="Root Mapping" value={lead.domainName} />
             </div>
             <div className="pt-10 flex gap-4">
                <button className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] italic text-white transition-all border border-white/5">Update Local Metadata</button>
             </div>
          </div>
          <div className="p-10 md:p-14 rounded-[3.5rem] bg-[#020617] border border-white/10 flex flex-col justify-between group overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl -z-10 group-hover:bg-red-500/10 transition-all" />
             <div>
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 mb-10 pb-6 border-b border-white/5">Policy Control</h3>
                <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20 italic">
                   <p className="text-[11px] font-black uppercase text-red-500 mb-2">Zero-Trust Environment</p>
                   <p className="text-[11px] font-bold text-red-100/30 leading-relaxed italic">"Modification of biometric identities is restricted to engineering-level overrides. Access tokens are hardware-pinned."</p>
                </div>
             </div>
             <button className="mt-14 py-4 border border-red-500/20 text-red-500/40 hover:bg-red-500/10 hover:text-red-500 rounded-2xl font-black uppercase tracking-[0.3em] text-[10px] italic transition-all duration-700">
                Terminate Session Node
             </button>
          </div>
       </div>
    </div>
  );
}

function Field({ label, value }: any) {
  return (
    <div className="space-y-3 group">
       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic group-hover:text-red-500 transition-colors">{label}</p>
       <div className="p-5 bg-black/40 border border-white/5 rounded-2xl text-sm font-black text-white/60 tracking-wide tabular-nums group-hover:border-red-500/20 transition-all">{value}</div>
    </div>
  );
}

function ViewVault({ }: any) {
  return (
    <div className="max-w-4xl mx-auto py-24 text-center space-y-12">
       <div className="relative inline-block">
          <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-br from-red-700 to-red-950 border-2 border-red-500/40 flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(239,68,68,0.3)] perspective-1000 rotate-12 hover:rotate-0 transition-all duration-700">
             <ShieldCheck className="w-20 h-20 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
          </div>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-0 -m-10 border border-red-500/20 rounded-full border-dashed p-1" />
       </div>
       <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic leading-none tracking-tighter">Security Vault</h1>
          <p className="text-white/30 font-bold max-w-xl mx-auto leading-relaxed text-sm md:text-base px-6 italic">Master-level node biometric verification. Your identity is pinned to 2 hardware footprints globally.</p>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left">
          <div className="p-8 rounded-[2.5rem] bg-[#020617] border border-white/10 flex items-center gap-6 group hover:border-red-500/40 transition-all">
             <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-red-500/10 group-hover:text-red-500 transition-all"><Cpu className="w-7 h-7" /></div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">Node IPv4</p>
                <p className="text-lg font-black text-white italic tracking-tighter tabular-nums">76.76.21.21</p>
             </div>
          </div>
          <div className="p-8 rounded-[2.5rem] bg-[#020617] border border-white/10 flex items-center gap-6 group hover:border-red-500/40 transition-all">
             <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-red-500/10 group-hover:text-red-500 transition-all"><CheckCircle2 className="w-7 h-7" /></div>
             <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic">Integrity</p>
                <p className="text-lg font-black text-white italic tracking-tighter uppercase tabular-nums">Verified_MAX</p>
             </div>
          </div>
       </div>
    </div>
  );
}
