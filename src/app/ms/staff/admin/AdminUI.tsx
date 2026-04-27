"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Cpu, ShieldCheck, Search, Bell, Filter, ArrowRight,
  Database, Globe, Menu, X, Zap, Activity, Loader2, CheckCircle2,
  Mail, MessageSquare, Megaphone, GitBranch, Terminal, Key, 
  ExternalLink, Code2, Star, Clock, AlertCircle
} from "lucide-react";

type View = "leads" | "notifications" | "github";

export default function AdminUI({ admin, leads: initialLeads, projects: initialProjects }: { admin: any, leads: any[], projects: any[] }) {
  const [activeView, setActiveView] = useState<View>("leads");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [projects, setProjects] = useState(initialProjects);
  const [saving, setSaving] = useState(false);

  // GitHub State
  const [githubToken, setGithubToken] = useState("");
  const [repos, setRepos] = useState<any[]>([]);
  const [fetchingRepos, setFetchingRepos] = useState(false);

  // Broadcast State
  const [broadcast, setBroadcast] = useState({ title: "", message: "", type: "web" });
  const [dispatching, setDispatching] = useState(false);

  // Derive active project for selected lead
  const activeProject = selectedLead ? projects.find(p => p.leadId === selectedLead.id) : null;
  const [localStatuses, setLocalStatuses] = useState<any>(null);

  const filteredLeads = initialLeads.filter(l => 
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
    }
  };

  const handleSaveLifecycle = async () => {
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
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleFetchRepos = async () => {
    setFetchingRepos(true);
    try {
      const res = await fetch("/api/admin/github/repos", {
        method: "POST",
        body: JSON.stringify({ githubToken })
      });
      const data = await res.json();
      if (data.repos) setRepos(data.repos);
    } catch (err) { console.error(err); } finally { setFetchingRepos(false); }
  };

  const handleDispatchNotification = async () => {
    setDispatching(true);
    try {
      await fetch("/api/admin/notifications", {
        method: "POST",
        body: JSON.stringify({
          leadId: selectedLead?.id || null, // If selectedLead is open, target them, else broadcast
          ...broadcast
        })
      });
      setBroadcast({ title: "", message: "", type: "web" });
      if (selectedLead) setSelectedLead(null);
    } catch (err) { console.error(err); } finally { setDispatching(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-inter selection:bg-red-500/30 overflow-x-hidden">
      
      {/* 🔝 ADMIN TOP BAR */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden p-2 text-white/50 hover:text-white transition-all"><Menu className="w-5 h-5" /></button>
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-900/40">
                <Cpu className="w-5 h-5 text-white" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] italic hidden sm:block">Institutional Master Console</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
           <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Node: {admin.email}</span>
           </div>
           <button className="relative p-2 text-white/40 hover:text-white transition-colors"><Bell className="w-5 h-5" /><span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping" /></button>
        </div>
      </header>

      <div className="flex flex-1 pt-16">
        {/* 📂 ADMIN SIDEBAR */}
        <aside className={`fixed left-0 top-16 bottom-0 w-64 border-r border-white/5 bg-[#020617] lg:flex flex-col p-6 space-y-8 z-40 transition-transform duration-500 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
           <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 px-4 mb-4 italic">Management Shell</p>
              <SidebarItem active={activeView === 'leads'} onClick={() => {setActiveView('leads'); setIsMobileOpen(false);}} icon={<Users className="w-4 h-4" />} label="Lead Library" />
              <SidebarItem active={activeView === 'notifications'} onClick={() => {setActiveView('notifications'); setIsMobileOpen(false);}} icon={<Megaphone className="w-4 h-4" />} label="Broadcasts" />
              <SidebarItem active={activeView === 'github'} onClick={() => {setActiveView('github'); setIsMobileOpen(false);}} icon={<GitBranch className="w-4 h-4" />} label="GitHub Pulse" />
              <div className="pt-4 mt-4 border-t border-white/5 space-y-1">
                <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/10 px-4 mb-2 italic">Infrastructure</p>
                <SidebarItem icon={<Database className="w-4 h-4" />} label="Cloud Registry" />
                <SidebarItem icon={<Globe className="w-4 h-4" />} label="DNS Cluster" />
              </div>
           </div>
        </aside>

        {/* 🧩 ADMIN MAIN CONTENT */}
        <main className="flex-1 lg:ml-64 p-5 md:p-10 max-w-7xl mx-auto w-full space-y-10 min-h-screen">
           
           <AnimatePresence mode="wait">
             {activeView === 'leads' && (
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="leads" className="space-y-10">
                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard label="Total Nodes" value={initialLeads.length} icon={<Users className="text-red-500" />} />
                    <StatCard label="Active Builds" value={projects.filter(p => p.status === 'active' || p.status === 'completed').length} icon={<Zap className="text-amber-500" />} />
                    <StatCard label="Pending DNS" value={projects.filter(p => p.domainStatus === 'pending').length} icon={<Globe className="text-blue-500" />} />
                    <StatCard label="Authority" value="OPTIMAL" icon={<Activity className="text-emerald-500" />} />
                  </div>

                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                       <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">Lead Library</h1>
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
                    </div>

                    <div className="bg-[#020617] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl overflow-x-auto">
                       <table className="w-full text-left border-collapse min-w-[700px]">
                          <thead>
                             <tr className="border-b border-white/5 bg-white/[0.01]">
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Client Node</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Domain Hub</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 text-center">Lifecycle</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 text-right">Handshake</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-white/[0.03]">
                             {filteredLeads.map((lead) => {
                                const p = projects.find(proj => proj.leadId === lead.id);
                                return (
                                  <tr key={lead.id} onClick={() => openController(lead)} className="group hover:bg-white/[0.02] cursor-pointer transition-all">
                                     <td className="p-6">
                                        <div className="flex items-center gap-4">
                                           <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center font-black text-xs text-red-500">{lead.name.charAt(0)}</div>
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
               </motion.div>
             )}

             {activeView === 'notifications' && (
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} key="notifications" className="max-w-4xl mx-auto space-y-10">
                  <header>
                     <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white leading-none">Broadcast HQ</h2>
                     <p className="text-sm font-bold text-white/30 mt-4 italic max-w-xl leading-relaxed">Multi-channel institutional alerts. Dispatch secure messages to the entire ecosystem or target specific individual nodes.</p>
                  </header>

                  <div className="bg-[#020617] border border-white/10 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-red-600/10 transition-all duration-700" />
                     
                     <div className="space-y-4 relative">
                        <div className="grid grid-cols-3 gap-4">
                           <button onClick={() => setBroadcast({...broadcast, type: 'web'})} className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${broadcast.type === 'web' ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/40' : 'bg-white/5 border-white/10 text-white/30'}`}>
                              <Globe className="w-4 h-4" /> Web Shell
                           </button>
                           <button onClick={() => setBroadcast({...broadcast, type: 'email'})} className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${broadcast.type === 'email' ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/40' : 'bg-white/5 border-white/10 text-white/30'}`}>
                              <Mail className="w-4 h-4" /> SMTP Alert
                           </button>
                           <button onClick={() => setBroadcast({...broadcast, type: 'both'})} className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${broadcast.type === 'both' ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/40' : 'bg-white/5 border-white/10 text-white/30'}`}>
                              <Megaphone className="w-4 h-4" /> Global Pulse
                           </button>
                        </div>

                        <div className="space-y-4">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-white/20 italic pl-4">Alert Title</label>
                              <input 
                                type="text" 
                                placeholder="Institutional Protocol Upgrade..."
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-red-500/50 transition-all"
                                value={broadcast.title}
                                onChange={(e) => setBroadcast({...broadcast, title: e.target.value})}
                              />
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-white/20 italic pl-4">Message Payload</label>
                              <textarea 
                                placeholder="Specify the infrastructure changes or security updates here..."
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-6 px-6 text-sm font-bold text-white focus:outline-none focus:border-red-500/50 transition-all min-h-[200px] resize-none"
                                value={broadcast.message}
                                onChange={(e) => setBroadcast({...broadcast, message: e.target.value})}
                              />
                           </div>
                        </div>

                        <button 
                          onClick={handleDispatchNotification}
                          disabled={dispatching || !broadcast.title || !broadcast.message}
                          className="w-full py-5 bg-red-600 hover:bg-red-500 rounded-2xl text-xs font-black uppercase tracking-[0.3em] text-white italic shadow-2xl transition-all shadow-red-900/50 flex items-center justify-center gap-4 disabled:opacity-50"
                        >
                           {dispatching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                           {dispatching ? "Syncing Handshakes..." : "Initialize Broadcast"}
                        </button>
                     </div>
                  </div>
               </motion.div>
             )}

             {activeView === 'github' && (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="github" className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                     <div className="md:col-span-1 space-y-8">
                        <div>
                           <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">Repo Hive</h2>
                           <p className="text-xs font-bold text-white/30 mt-4 italic leading-relaxed">Integrated GitHub registry for institutional code oversight.</p>
                        </div>

                        <div className="space-y-4 p-6 rounded-3xl bg-amber-500/5 border border-amber-500/20">
                           <div className="flex items-center gap-3 text-amber-500">
                              <Key className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Authority Token Guide</span>
                           </div>
                           <ol className="list-decimal list-inside text-[9px] font-bold text-white/40 space-y-2 uppercase leading-loose">
                              <li>Navigate to <span className="text-white">GitHub Settings</span> → Developer Settings</li>
                              <li>Select <span className="text-white">Tokens (classic)</span></li>
                              <li>Generate <span className="text-white">"New Token"</span> with 'repo' scope</li>
                              <li>Inject the hash payload below</li>
                           </ol>
                        </div>

                        <div className="space-y-3">
                           <input 
                             type="password" 
                             placeholder="GitHub Authority Hash (PAT)"
                             className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-xs font-bold text-white focus:outline-none focus:border-red-500/50"
                             value={githubToken}
                             onChange={(e) => setGithubToken(e.target.value)}
                           />
                           <button 
                             onClick={handleFetchRepos}
                             disabled={fetchingRepos || !githubToken}
                             className="w-full py-4 bg-white text-black hover:bg-white/90 rounded-2xl text-[10px] font-black uppercase tracking-widest italic transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                           >
                              {fetchingRepos ? <Loader2 className="w-4 h-4 animate-spin" /> : <Terminal className="w-4 h-4" />}
                              Sync Registry
                           </button>
                        </div>
                     </div>

                     <div className="md:col-span-2 space-y-6">
                        {repos.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                             {repos.map(r => (
                               <a key={r.id} href={r.url} target="_blank" className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition-all group overflow-hidden relative">
                                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity"><ArrowRight className="w-4 h-4 text-red-500" /></div>
                                  <div className="flex items-center gap-3 mb-4">
                                     <Code2 className="w-4 h-4 text-red-500" />
                                     <span className="text-xs font-black uppercase tracking-widest text-white italic truncate">{r.name}</span>
                                  </div>
                                  <p className="text-[10px] font-bold text-white/30 line-clamp-2 h-8 leading-relaxed italic">{r.description || 'No registry documentation identified.'}</p>
                                  <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                                     <span className="text-[9px] font-black uppercase text-red-600/50">{r.language || 'Binary'}</span>
                                     <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-white/20"><Star className="w-3 h-3" /> {r.stars}</div>
                                        <div className="flex items-center gap-1.5 text-[9px] font-black text-white/20"><Clock className="w-3 h-3" /> {new Date(r.updatedAt).toLocaleDateString()}</div>
                                     </div>
                                  </div>
                               </a>
                             ))}
                          </div>
                        ) : (
                          <div className="h-full min-h-[400px] rounded-[3rem] border border-white/5 border-dashed flex flex-col items-center justify-center text-center p-12 space-y-4">
                             <GitBranch className="w-16 h-16 text-white/5" />
                             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic">Registry Standby</p>
                          </div>
                        )}
                     </div>
                  </div>
               </motion.div>
             )}
           </AnimatePresence>

        </main>
      </div>

      {/* 🔮 LEAD CONTROLLER OVERLAY */}
      <AnimatePresence>
         {selectedLead && localStatuses && activeView === 'leads' && (
           <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLead(null)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]" />
              <motion.div 
                initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                className="fixed top-0 right-0 bottom-0 w-full lg:w-[500px] bg-[#020617] border-l border-white/10 z-[110] shadow-[-50px_0_100px_rgba(0,0,0,0.5)] overflow-y-auto"
              >
                 <div className="p-8 space-y-12 pb-24">
                    <header className="flex items-center justify-between">
                       <div>
                          <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Node Controller</h2>
                          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{selectedLead.name}</p>
                       </div>
                       <button onClick={() => setSelectedLead(null)} className="p-2 text-white/20 hover:text-white transition-all"><X className="w-6 h-6" /></button>
                    </header>

                    {/* Quick Channels */}
                    <div className="flex gap-2 p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl">
                       <button className="flex-1 py-3 rounded-xl bg-red-600 text-[9px] font-black uppercase tracking-widest text-white italic flex items-center justify-center gap-2 shadow-lg shadow-red-900/40">Lifecycles</button>
                       <button onClick={() => { setActiveView('notifications'); setBroadcast({ ...broadcast, title: `Update for ${selectedLead.name}` }); }} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest text-white/30 italic flex items-center justify-center gap-2">Message Node</button>
                    </div>

                    <section className="space-y-6">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500 italic pb-2 border-b border-red-500/20">Lifecycle Override</h3>
                       <div className="space-y-3">
                          <ToggleItem label="Domain Mapping" completed={localStatuses.domainStatus === 'completed'} onClick={() => setLocalStatuses({...localStatuses, domainStatus: localStatuses.domainStatus === 'completed' ? 'pending' : 'completed'})} />
                          <ToggleItem label="Core Dev Build" completed={localStatuses.devStatus === 'completed'} onClick={() => setLocalStatuses({...localStatuses, devStatus: localStatuses.devStatus === 'completed' ? 'pending' : 'completed'})} />
                          <ToggleItem label="Cloud Deployment" completed={localStatuses.deployStatus === 'completed'} onClick={() => setLocalStatuses({...localStatuses, deployStatus: localStatuses.deployStatus === 'completed' ? 'pending' : 'completed'})} />
                       </div>
                    </section>

                    <div className="pt-8">
                       <button 
                        onClick={handleSaveLifecycle} disabled={saving}
                        className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white italic shadow-2xl transition-all flex items-center justify-center gap-3 shadow-red-900/40"
                       >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : "Save Node State"}
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
  return <div className={`w-2 h-2 rounded-full transition-all duration-500 ${active ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-white/10'}`} />
}

function SidebarItem({ icon, label, active = false, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full py-4 px-5 rounded-2xl flex items-center gap-4 transition-all duration-500 relative group ${active ? 'bg-red-600 text-white shadow-xl shadow-red-900/40' : 'text-white/20 hover:text-white hover:bg-white/[0.04]'}`}>
       <span className={active ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6 transition-all'}>{icon}</span>
       <span className="text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
       {active && <motion.div layoutId="admin-nav" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />}
    </button>
  );
}

function StatCard({ label, value, icon }: any) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-[#020617] border border-white/10 shadow-xl flex items-center gap-8 group hover:border-red-500/20 transition-all relative overflow-hidden">
       <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
       <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 group-hover:bg-red-600/10 transition-all">{icon}</div>
       <div className="relative">
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2 italic leading-none">{label}</p>
          <p className="text-2xl font-black text-white italic leading-none tracking-tighter tabular-nums">{value}</p>
       </div>
    </div>
  );
}

function ToggleItem({ label, completed, onClick }: any) {
  return (
    <div onClick={onClick} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.01] border border-white/5 group hover:border-red-500/20 transition-all cursor-pointer">
       <span className={`text-[11px] font-black uppercase tracking-[0.2em] italic ${completed ? 'text-white' : 'text-white/20'}`}>{label}</span>
       <div className={`w-12 h-7 rounded-full relative transition-all duration-500 ${completed ? 'bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-white/10'}`}>
          <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all duration-500 ${completed ? 'left-6 shadow-md' : 'left-1.5'}`} />
       </div>
    </div>
  );
}
