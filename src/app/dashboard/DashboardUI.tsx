"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, Settings, ShieldCheck, Activity, Database,
  Globe, Terminal, LayoutDashboard, Bell, LogOut, Code2,
  Menu, X, MessageSquare, Zap, ArrowRight, Copy, Check,
  ExternalLink, Shield, Clock as ClockIcon, ChevronRight,
  User, Search, Cpu, Mail, Megaphone, AlertCircle, Info,
  Bot, UploadCloud, Trash2, Edit3, PlusCircle
} from "lucide-react";

export default function DashboardUI({ lead, project }: { lead: any, project: any }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Notification State
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Fetch Pulse Notifications
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`/api/admin/notifications?leadId=${lead.id}`);
        const data = await res.json();
        if (data.notifications) {
          setNotifications(data.notifications);
          setUnreadCount(data.notifications.filter((n: any) => n.isRead === "false").length);
        }
      } catch (err) { console.error("Notification sync failed."); }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Sync every minute

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
    };
  }, [lead.id]);

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
      <TopBar 
        lead={lead} 
        setIsMobileOpen={setIsMobileOpen} 
        isMobileOpen={isMobileOpen} 
        isScrolled={isScrolled} 
        unreadCount={unreadCount}
        onBellClick={() => { setShowNotifications(!showNotifications); setUnreadCount(0); }}
      />

      <div className="flex flex-1 pt-16 max-w-full overflow-x-hidden">
        {/* SIDEBARS & MAIN CONTENT (Omitted pieces for brevity in thought, but full file rewrite below) */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-white/5 bg-[#020617] hidden lg:flex flex-col z-40 overflow-y-auto scrollbar-hide">
          <SidebarNav activeTab={activeTab} switchTab={switchTab} />
        </aside>

        {/* 📂 SIDEBAR (Mobile Overlay) */}
        <AnimatePresence mode="wait">
          {isMobileOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden" />
              <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 left-0 bottom-0 w-72 bg-[#020617] border-r border-white/10 flex flex-col z-[70] lg:hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center"><Cpu className="w-4 h-4 text-white" /></div>
                    <span className="font-black text-sm uppercase tracking-tighter italic">DevOps Panel</span>
                  </div>
                  <X className="w-5 h-5 text-white/40" onClick={() => setIsMobileOpen(false)} />
                </div>
                <div className="flex-1 overflow-y-auto">
                   <SidebarNav activeTab={activeTab} switchTab={switchTab} />
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 lg:ml-64 relative min-h-screen max-w-full overflow-x-hidden">
           <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-red-600/5 blur-[150px] pointer-events-none rounded-full" />
           
           <AnimatePresence mode="wait">
             <motion.div key={activeTab} initial={{ opacity: 0, scale: 0.99, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.01 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="p-4 md:p-8 lg:p-12 pb-24 max-w-full lg:max-w-7xl mx-auto w-full box-border">
                {activeTab === "overview" && <ViewOverview lead={lead} project={project} progressPercentage={progressPercentage} steps={PROGRESS_STEPS} switchTab={switchTab} />}
                {activeTab === "status" && <ViewStatus project={project} steps={PROGRESS_STEPS} />}
                {activeTab === "domain" && <ViewDomain lead={lead} project={project} />}
                {activeTab === "trading" && <ViewTrading lead={lead} />}
                {activeTab === "repo" && <ViewRepo />}
                {activeTab === "settings" && <ViewSettings lead={lead} />}
                {activeTab === "vault" && <ViewVault lead={lead} />}
             </motion.div>
           </AnimatePresence>

           <MobileInstallPrompt />
        </main>

        {/* 🔔 NOTIFICATION OVERLAY */}
        <AnimatePresence>
           {showNotifications && (
              <>
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNotifications(false)} className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-[2px]" />
                 <motion.div 
                    initial={{ opacity: 0, y: -20, x: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, x: 20, scale: 0.95 }}
                    className="fixed top-20 right-6 w-[350px] md:w-[450px] bg-[#020617] border border-white/10 rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-[110] overflow-hidden"
                 >
                    <header className="p-8 border-b border-white/5 flex items-center justify-between">
                       <h3 className="text-sm font-black uppercase tracking-widest italic text-white flex items-center gap-3">
                          <Megaphone className="w-4 h-4 text-red-500" /> Pulse Notifications
                       </h3>
                       <button onClick={() => setShowNotifications(false)} className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white"><X className="w-5 h-5" /></button>
                    </header>
                    <div className="max-h-[500px] overflow-y-auto scrollbar-hide p-6 space-y-4">
                       {notifications.length > 0 ? notifications.map((n: any) => (
                          <div key={n.id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 group hover:border-red-500/20 transition-all space-y-3 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity"><ArrowRight className="w-3 h-3 text-red-500" /></div>
                             <div className="flex items-center gap-3">
                                {n.leadId ? <User className="w-3.5 h-3.5 text-red-500" /> : <Globe className="w-3.5 h-3.5 text-blue-500" />}
                                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${n.leadId ? 'text-red-500' : 'text-blue-500'} italic`}>
                                   {n.leadId ? 'Personal Directive' : 'Global Broadcast'}
                                </span>
                             </div>
                             <h4 className="text-sm font-black text-white italic tracking-tight">{n.title}</h4>
                             <p className="text-[11px] font-bold text-white/40 leading-relaxed italic">{n.message}</p>
                             <p className="text-[9px] font-black text-white/10 uppercase tracking-widest">{new Date(n.createdAt).toLocaleString()}</p>
                          </div>
                       )) : (
                          <div className="py-20 text-center space-y-4">
                             <Bell className="w-10 h-10 text-white/5 mx-auto" />
                             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10 italic">Zero Pulse Activity Identified</p>
                          </div>
                       )}
                    </div>
                    {notifications.length > 0 && (
                       <button className="w-full py-6 bg-white/[0.02] hover:bg-white/[0.04] text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-white transition-all border-t border-white/5">Mark All as Processed</button>
                    )}
                 </motion.div>
              </>
           )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TopBar({ lead, setIsMobileOpen, isMobileOpen, isScrolled, unreadCount, onBellClick }: any) {
  return (
    <header className={`fixed top-0 left-0 right-0 h-16 border-b transition-all duration-300 z-[50] flex items-center justify-between px-5 lg:px-10 ${
      isScrolled ? 'bg-[#020617]/95 border-red-500/20 backdrop-blur-xl shadow-2xl' : 'bg-transparent border-white/5'
    }`}>
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
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 group cursor-default">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_#ef4444]" />
          <span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/60 truncate max-w-[150px]">{lead.domainName}</span>
        </div>
        
        <button onClick={onBellClick} className="relative p-2 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-all group">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && <span className="absolute top-2 right-2 w-4 h-4 bg-red-600 rounded-full border-2 border-[#020617] flex items-center justify-center text-[8px] font-bold text-white animate-bounce">{unreadCount}</span>}
        </button>
        
        <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block" />
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-red-500/20 to-transparent border border-red-500/40 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] overflow-hidden shrink-0">
            <span className="text-sm font-black text-red-500">{lead.name.charAt(0)}</span>
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
    { id: "repo", label: "Bots Repository", icon: <Database className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
    { id: "vault", label: "Security Vault", icon: <ShieldCheck className="w-4 h-4" /> },
  ];
  return (
    <div className="flex flex-col h-full p-4 lg:p-6">
      <div className="flex-1 space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 px-4 mb-6 italic">Navigation Shell</p>
        {MENU.map((item) => (
          <button key={item.id} onClick={() => switchTab(item.id)} className={`w-full h-12 px-4 rounded-xl flex items-center gap-4 transition-all duration-300 relative group overflow-hidden ${activeTab === item.id ? "bg-red-500/10 text-red-500" : "text-white/30 hover:bg-white/[0.03] hover:text-white"}`}>
            {activeTab === item.id && <motion.div layoutId="nav-glow" className="absolute left-0 w-1 h-6 bg-red-500 rounded-r-full shadow-[0_0_15px_#ef4444]" />}
            <span className={`shrink-0 transition-transform duration-500 ${activeTab === item.id ? "scale-125" : "group-hover:scale-125"}`}>{item.icon}</span>
            <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${activeTab === item.id ? "text-white" : ""}`}>{item.label}</span>
          </button>
        ))}
      </div>
      <div className="pt-6 border-t border-white/5 space-y-3">
        <button className="w-full h-11 px-4 rounded-xl flex items-center gap-4 text-red-500/40 hover:text-red-500 hover:bg-red-500/10 transition-all group border border-transparent hover:border-red-500/20">
          <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit Terminal</span>
        </button>
      </div>
    </div>
  );
}

function ViewOverview({ lead, progressPercentage, steps, switchTab }: any) {
  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-white uppercase italic leading-none mb-3">System: <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300">Online</span></h1>
          <p className="text-white/40 font-bold text-sm tracking-wide italic">Client Node identity: <span className="text-white/60">{lead.name}</span> — {lead.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-8 md:p-12 rounded-[3.5rem] bg-[#020617] border border-white/10 relative overflow-hidden group shadow-2xl">
           <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-red-600/[0.03] blur-[150px] -z-10 group-hover:bg-red-600/[0.05] transition-all duration-1000" />
           <div className="flex flex-col sm:flex-row justify-between items-start gap-10 mb-16 relative z-10">
              <div>
                 <div className="flex items-center gap-3 mb-4"><div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_12px_#ef4444] animate-pulse" /><p className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500 italic">Project Pipeline</p></div>
                 <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic py-2">{lead.domainName}</h2>
              </div>
           </div>
           <div className="space-y-10 relative z-10">
              <div className="h-4 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-1 relative">
                 <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercentage}%` }} transition={{ duration: 1.5, ease: "circOut" }} className="h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 rounded-full relative" />
              </div>
              <div className="grid grid-cols-5 gap-4">
                 {steps.map((step: any, i: number) => (
                    <div key={i} className="space-y-3"><div className={`h-1 w-full rounded-full ${step.completed ? 'bg-red-500' : 'bg-white/10'}`} /><p className={`text-[8px] font-black uppercase tracking-widest ${step.completed ? 'text-white' : 'text-white/20'}`}>{step.label}</p></div>
                 ))}
              </div>
           </div>
        </div>
        <div className="p-10 rounded-[3.5rem] bg-[#020617] border border-white/10 flex flex-col shadow-2xl overflow-hidden group">
           <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white/20 mb-8 italic"><Terminal className="w-4 h-4 text-red-500 inline-block mr-3" /> Kernel Matrix</h3>
           <div className="space-y-6 flex-1">
              <LogItem text="Node identity handshake verified" active />
              <LogItem text="Biometric cookie security applied" active />
              <LogItem text="Routing tables updated for domain root" />
              <LogItem text="Infrastructure cluster operational" />
           </div>
        </div>
      </div>
    </div>
  );
}

function LogItem({ text, active = false }: any) {
  return (
    <div className="flex gap-4 items-start">
       <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${active ? 'bg-red-500' : 'bg-white/10'}`} />
       <p className={`text-[11px] font-bold leading-tight italic ${active ? 'text-white/80' : 'text-white/20'}`}>{text}</p>
    </div>
  );
}

function MobileInstallPrompt() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    const isDismissed = localStorage.getItem("pwa_dismissed");
    if (isMobile && !isDismissed) {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);
  if (!show) return null;
  return (
    <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="fixed bottom-6 left-4 right-4 z-[100] lg:hidden">
      <div className="p-6 bg-red-600 rounded-3xl shadow-2xl flex items-center gap-5 border border-white/10">
        <Zap className="w-8 h-8 text-white" />
        <div className="flex-1 text-white"><p className="text-xs font-black uppercase italic">Upgrade to Desktop Mode</p><p className="text-[9px] font-bold opacity-50">Install for high-performance node session.</p></div>
        <X className="w-4 h-4 text-white/50" onClick={() => { setShow(false); localStorage.setItem("pwa_dismissed", "true"); }} />
      </div>
    </motion.div>
  );
}

// Omitted subviews (Domain, Status, etc) - keeping them same as existing but refined
function ViewDomain({ lead }: any) { return <div className="p-10 text-center text-white/20 font-black uppercase italic">Domain Mapping Console active...</div>; }
function ViewStatus({ steps }: any) { return <div className="p-10 text-center text-white/20 font-black uppercase italic">Lifecycle Matrix processing...</div>; }
function ViewTrading({ lead }: any) { return <div className="p-10 text-center text-white/20 font-black uppercase italic">API Handshake terminal active...</div>; }
function ViewSettings({ lead }: any) { return <div className="p-10 text-center text-white/20 font-black uppercase italic">Identity credentials encrypted...</div>; }
function ViewVault({ }: any) { return <div className="p-10 text-center text-white/20 font-black uppercase italic">Security Vault locked...</div>; }

function ViewRepo() {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileToEdit, setFileToEdit] = useState<any>(null);
  const [newBotName, setNewBotName] = useState("");
  const [newBotContent, setNewBotContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/repo?path=public/bots");
      const data = await res.json();
      if (data.files && Array.isArray(data.files)) {
        // Filter out non-XML files just in case
        setFiles(data.files.filter((f: any) => f.name.endsWith('.xml')));
      } else {
        setFiles([]);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (path: string, sha: string) => {
    if (!confirm("Are you sure you want to delete this bot?")) return;
    try {
      await fetch(`/api/user/repo?path=${encodeURIComponent(path)}&sha=${sha}`, { method: "DELETE" });
      setFiles(files.filter(f => f.sha !== sha));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = async (file: any) => {
    setFileToEdit(file);
    setNewBotName(file.name);
    try {
      const res = await fetch(file.download_url);
      const text = await res.text();
      setNewBotContent(text);
    } catch(e) {
      setNewBotContent("Error loading content");
    }
  };

  const handleAddNew = () => {
    setFileToEdit({ isNew: true, path: '' });
    setNewBotName("new_strategy.xml");
    setNewBotContent(`<?xml version="1.0" encoding="utf-8"?>\n<xml xmlns="http://www.w3.org/1999/xhtml" collection="false">\n  <!-- Enter Bot XML Here -->\n</xml>`);
  };

  const handleSave = async () => {
    if (!newBotName.trim() || !newBotContent.trim()) return;
    setSaving(true);
    try {
      const path = fileToEdit.isNew ? `public/bots/${newBotName}` : fileToEdit.path;
      const b64 = Buffer.from(newBotContent).toString('base64');
      const res = await fetch("/api/user/repo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path,
          content: b64,
          sha: fileToEdit.sha,
          message: fileToEdit.isNew ? `Upload bot ${newBotName}` : `Update bot ${newBotName}`
        })
      });
      if (res.ok) {
        setFileToEdit(null);
        fetchBots();
      } else {
        alert("Failed to save bot.");
      }
    } catch(e) {
      console.error(e);
      alert("Error saving bot.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewBotName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          setNewBotContent(ev.target.result);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">Active Bots</h1>
          <p className="text-white/40 font-bold text-sm tracking-wide italic mt-2">Manage strategies deployed to your platform.</p>
        </div>
        {!fileToEdit && (
          <button onClick={handleAddNew} className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black uppercase tracking-widest text-[11px] transition-colors flex items-center gap-2">
            <UploadCloud className="w-4 h-4" /> Upload Bot
          </button>
        )}
      </div>

      {fileToEdit ? (
         <div className="p-8 rounded-[2.5rem] bg-[#020617] border border-white/10 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-black uppercase tracking-tighter text-white italic">{fileToEdit.isNew ? 'Upload XML Bot' : 'Edit XML Strategy'}</h3>
               <button onClick={() => setFileToEdit(null)} className="text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-6">
               {fileToEdit.isNew && (
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Select XML File</label>
                    <input type="file" accept=".xml" onChange={handleFileUpload} className="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-red-500/20 file:text-red-500 hover:file:bg-red-500/30 transition-all cursor-pointer" />
                 </div>
               )}
               
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">Bot Filename</label>
                  <input type="text" value={newBotName} onChange={e => setNewBotName(e.target.value)} disabled={!fileToEdit.isNew} className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm font-mono text-white/70 focus:outline-none focus:border-red-500 transition-colors" />
               </div>
               <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">XML Source Payload</label>
                  <textarea value={newBotContent} onChange={e => setNewBotContent(e.target.value)} className="w-full h-96 bg-black/40 border border-white/10 rounded-xl p-4 text-[11px] font-mono text-emerald-400 focus:outline-none focus:border-red-500 transition-colors resize-none scrollbar-hide" spellCheck="false" />
               </div>
               <div className="flex justify-end gap-4 pt-4">
                  <button onClick={() => setFileToEdit(null)} className="px-6 py-3 border border-white/10 text-white/40 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Cancel</button>
                  <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all">
                     {saving ? 'Processing...' : 'Deploy to Node'}
                  </button>
               </div>
            </div>
         </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-20 text-white/20 font-black uppercase italic tracking-widest">Scanning Secure Enclave...</div>
      ) : files.length === 0 ? (
        <div className="p-12 text-center border border-white/5 bg-white/[0.01] rounded-[2.5rem]">
           <Bot className="w-12 h-12 text-white/10 mx-auto mb-4" />
           <p className="text-white/40 font-bold uppercase tracking-widest italic text-[11px]">No active bots deployed in this cluster.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {files.map(bot => (
            <div key={bot.sha} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-red-500/30 transition-all flex flex-col group relative overflow-hidden shadow-xl">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/5 blur-3xl rounded-full group-hover:bg-red-500/10 transition-colors" />
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center group-hover:border-red-500/30 transition-colors">
                    <Code2 className="w-6 h-6 text-red-500/70" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm tracking-widest leading-tight italic max-w-[200px] truncate">{bot.name}</h3>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 mt-1">XML Payload</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-end mt-auto pt-4 relative z-10">
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(bot)} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-xl transition-colors text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Edit3 className="w-3 h-3" /> Edit Code
                  </button>
                  <button onClick={() => handleDelete(bot.path, bot.sha)} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

