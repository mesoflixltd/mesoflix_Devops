"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Cpu, 
  ShieldCheck, 
  Search, 
  Bell, 
  Filter, 
  ArrowRight,
  Database,
  Globe,
  Menu,
  X,
  Zap,
  Activity,
  Loader2,
  CheckCircle2
} from "lucide-react";

export default function AdminUI({ admin, leads, projects: initialProjects }: { admin: any, leads: any[], projects: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [projects, setProjects] = useState(initialProjects);
  const [saving, setSaving] = useState(false);

  // Derive active project for selected lead
  const activeProject = selectedLead ? projects.find(p => p.leadId === selectedLead.id) : null;
  const [localStatuses, setLocalStatuses] = useState<any>(null);

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.domainName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openController = (lead: any) => {
    setSelectedLead(lead);
    const p = projects.find(proj => proj.leadId === lead.id);
    if (p) {
      setLocalStatuses({
        domainStatus: p.domainStatus || 'pending',
        devStatus: p.devStatus || 'pending',
        deployStatus: p.deployStatus || 'pending',
        status: p.status || 'pending'
      });
    } else {
      setLocalStatuses(null);
    }
  };

  const handleSave = async () => {
    if (!activeProject || !localStatuses) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/projects/${activeProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(localStatuses)
      });
      if (res.ok) {
        setProjects(projects.map(p => p.id === activeProject.id ? { ...p, ...localStatuses } : p));
        setSelectedLead(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-inter selection:bg-red-500/30">
      
      {/* 🔝 ADMIN TOP BAR */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden p-2 text-white/50 hover:text-white"><Menu className="w-5 h-5" /></button>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40">
                <Cpu className="w-5 h-5 text-white" />
             </div>
             <span className="text-xs font-black uppercase tracking-[0.2em] italic hidden sm:block">Institutional Master Console</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Node: {admin.email}</span>
           </div>
           <button className="relative p-2 text-white/40 hover:text-white transition-colors"><Bell className="w-5 h-5" /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" /></button>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* 📂 ADMIN SIDEBAR */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 border-r border-white/5 bg-[#020617] hidden lg:flex flex-col p-6 space-y-8 z-40">
           <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 px-4 mb-4 italic">Management Shell</p>
              <SidebarItem active icon={<Users className="w-4 h-4" />} label="Lead Library" />
              <SidebarItem icon={<Database className="w-4 h-4" />} label="Infra Registry" />
              <SidebarItem icon={<Globe className="w-4 h-4" />} label="DNS Cluster" />
              <SidebarItem icon={<ShieldCheck className="w-4 h-4" />} label="Auth Policies" />
           </div>
        </aside>

        {/* 🧩 ADMIN MAIN CONTENT */}
        <main className="flex-1 lg:ml-64 p-5 md:p-10 max-w-7xl mx-auto w-full space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total User Nodes" value={leads.length} icon={<Users className="text-red-500" />} />
              <StatCard label="Active Builds" value={projects.filter(p => p.status === 'active' || p.status === 'completed').length} icon={<Zap className="text-amber-500" />} />
              <StatCard label="Pending Mapping" value={projects.filter(p => p.domainStatus === 'pending').length} icon={<Globe className="text-blue-500" />} />
              <StatCard label="System Integrity" value="OPTIMAL" icon={<Activity className="text-emerald-500" />} />
           </div>

           <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">Lead Library</h1>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="relative group">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-red-500 transition-colors" />
                       <input 
                         type="text" 
                         placeholder="Search hash, email, domain..." 
                         className="bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-xs font-bold text-white focus:outline-none focus:border-red-500/50 min-w-[300px]"
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                       />
                    </div>
                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white"><Filter className="w-4 h-4" /></button>
                 </div>
              </div>

              <div className="bg-[#020617] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="border-b border-white/5 bg-white/[0.01]">
                          <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Client Node</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Infrastructure</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 text-center">Lifecycle</th>
                          <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 text-right">Access</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                       {filteredLeads.map((lead) => {
                          const p = projects.find(proj => proj.leadId === lead.id);
                          return (
                            <tr key={lead.id} onClick={() => openController(lead)} className="group hover:bg-white/[0.02] cursor-pointer transition-all">
                               <td className="p-6">
                                  <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600/20 to-transparent border border-red-500/20 flex items-center justify-center font-black text-xs text-red-500">
                                        {lead.name.charAt(0)}
                                     </div>
                                     <div>
                                        <p className="text-sm font-black text-white group-hover:text-red-500 transition-colors italic">{lead.name}</p>
                                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-0.5">{lead.email}</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="p-6">
                                  <div className="space-y-1">
                                     <p className="text-xs font-black text-white/60 tracking-tight italic">{lead.domainName}</p>
                                     <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{lead.domainProvider}</p>
                                  </div>
                               </td>
                               <td className="p-6 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                     <Dot active={p?.domainStatus === 'completed'} />
                                     <Dot active={p?.devStatus === 'completed'} />
                                     <Dot active={p?.deployStatus === 'completed'} />
                                  </div>
                               </td>
                               <td className="p-6 text-right">
                                  <button className="p-2 text-white/10 group-hover:text-red-500 transition-colors"><ArrowRight className="w-4 h-4" /></button>
                               </td>
                            </tr>
                          );
                       })}
                    </tbody>
                 </table>
              </div>
           </div>
        </main>
      </div>

      {/* 🔮 DETAIL OVERLAY */}
      <AnimatePresence>
         {selectedLead && localStatuses && (
           <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLead(null)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]" />
              <motion.div 
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                className="fixed top-0 right-0 bottom-0 w-full lg:w-[500px] bg-[#020617] border-l border-white/10 z-[110] shadow-[-50px_0_100px_rgba(0,0,0,0.5)] overflow-y-auto"
              >
                 <div className="p-8 space-y-12 pb-24">
                    <header className="flex items-center justify-between">
                       <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Node Controller</h2>
                       <button onClick={() => setSelectedLead(null)} className="p-2 text-white/20 hover:text-white"><X className="w-6 h-6" /></button>
                    </header>

                    <section className="space-y-6">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500 italic pb-2 border-b border-red-500/20">Lifecycle Override</h3>
                       <div className="space-y-3">
                          <ToggleItem 
                            label="Domain Mapping" 
                            completed={localStatuses.domainStatus === 'completed'} 
                            onClick={() => setLocalStatuses({...localStatuses, domainStatus: localStatuses.domainStatus === 'completed' ? 'pending' : 'completed'})}
                          />
                          <ToggleItem 
                            label="Core Dev Build" 
                            completed={localStatuses.devStatus === 'completed'} 
                            onClick={() => setLocalStatuses({...localStatuses, devStatus: localStatuses.devStatus === 'completed' ? 'pending' : 'completed'})}
                          />
                          <ToggleItem 
                            label="Cloud Deployment" 
                            completed={localStatuses.deployStatus === 'completed'} 
                            onClick={() => setLocalStatuses({...localStatuses, deployStatus: localStatuses.deployStatus === 'completed' ? 'pending' : 'completed'})}
                          />
                       </div>
                    </section>

                    <div className="pt-8">
                       <button 
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-white italic shadow-2xl transition-all flex items-center justify-center gap-3"
                       >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Identity"}
                          {!saving && "Sync Node Updates"}
                       </button>
                    </div>
                 </div>
              </motion.div>
           </>
         )}
      </AnimatePresence>
    </div>
  );
}

function Dot({ active }: { active: boolean }) {
  return <div className={`w-2 h-2 rounded-full ${active ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-white/10'}`} />
}

function SidebarItem({ icon, label, active = false }: any) {
  return (
    <button className={`w-full py-3.5 px-4 rounded-xl flex items-center gap-4 transition-all duration-300 relative group ${active ? 'bg-red-500/10 text-red-500' : 'text-white/20 hover:text-white hover:bg-white/[0.03]'}`}>
       {icon}
       <span className="text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
       {active && <motion.div layoutId="admin-nav" className="absolute left-0 w-1 h-6 bg-red-500 rounded-r-full shadow-[0_0_10px_#ef4444]" />}
    </button>
  );
}

function StatCard({ label, value, icon }: any) {
  return (
    <div className="p-6 rounded-[2rem] bg-[#020617] border border-white/10 shadow-xl flex items-center gap-6 group hover:border-white/20 transition-all">
       <div className="w-12 h-12 rounded-2xl bg-white/[0.03] flex items-center justify-center text-xl shrink-0">{icon}</div>
       <div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-1 italic leading-none">{label}</p>
          <p className="text-xl font-black text-white italic leading-none tracking-tighter">{value}</p>
       </div>
    </div>
  );
}

function ToggleItem({ label, completed, onClick }: any) {
  return (
    <div onClick={onClick} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.01] border border-white/5 group hover:border-red-500/20 transition-all cursor-pointer">
       <span className={`text-[11px] font-black uppercase tracking-[0.2em] italic ${completed ? 'text-white' : 'text-white/20'}`}>{label}</span>
       <div className={`w-12 h-7 rounded-full relative transition-all duration-500 ${completed ? 'bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-white/10'}`}>
          <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all duration-500 ${completed ? 'left-6' : 'left-1.5'}`} />
       </div>
    </div>
  );
}
