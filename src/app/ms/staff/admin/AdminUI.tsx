"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, Cpu, ShieldCheck, Search, Bell, Filter, ArrowRight,
  Database, Globe, Menu, X, Zap, Activity, Loader2, CheckCircle2,
  Mail, MessageSquare, Megaphone, GitBranch, Terminal, Key, 
  ExternalLink, Code2, Star, Clock, AlertCircle, User, Info, Smartphone,
  FileCode, Upload, Trash2, Edit3, Save, ChevronLeft, Download, Folder, Send
} from "lucide-react";

type View = "leads" | "notifications" | "github" | "logs";
type SidebarTab = "lifecycles" | "portfolio" | "logs" | "transmit";

export default function AdminUI({ admin, leads: initialLeads, projects: initialProjects }: { admin: any, leads: any[], projects: any[] }) {
  const [activeView, setActiveView] = useState<View>("leads");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>("lifecycles");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [projects, setProjects] = useState(initialProjects);
  const [saving, setSaving] = useState(false);

  // GitHub State
  const [githubToken, setGithubToken] = useState(admin.githubToken || "");
  const [isTokenSaved, setIsTokenSaved] = useState(!!admin.githubToken);
  const [repos, setRepos] = useState<any[]>([]);
  const [fetchingRepos, setFetchingRepos] = useState(false);
  const [repoSearchTerm, setRepoSearchTerm] = useState("");
  
  // Repo Explorer State
  const [selectedRepo, setSelectedRepo] = useState<any>(null); // { fullName, name }
  const [repoFiles, setRepoFiles] = useState<any[]>([]);
  const [currentPath, setCurrentPath] = useState("");
  const [fetchingFiles, setFetchingFiles] = useState(false);
  const [fileToEdit, setFileToEdit] = useState<any>(null); 
  const [newBotContent, setNewBotContent] = useState("");
  const [newBotName, setNewBotName] = useState("");

  // Broadcast State
  const [broadcast, setBroadcast] = useState({ title: "", message: "", type: "web" });
  const [dispatching, setDispatching] = useState(false);
  const [notificationTarget, setNotificationTarget] = useState<"broadcast" | "individual">("broadcast");
  const [targetUser, setTargetUser] = useState<any>(null);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [fetchingRecent, setFetchingRecent] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Derive active project for selected lead
  const activeProject = selectedLead ? projects.find(p => p.leadId === selectedLead.id) : null;
  const [localStatuses, setLocalStatuses] = useState<any>(null);

  useEffect(() => {
    if (isTokenSaved) handleFetchRepos();
  }, [isTokenSaved]);

  useEffect(() => {
    if (activeView === 'notifications') {
      handleFetchRecentNotifications();
    }
  }, [activeView]);

  const filteredLeads = initialLeads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.domainName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRepos = repos.filter(r => 
    r.name.toLowerCase().includes(repoSearchTerm.toLowerCase()) ||
    (r.description && r.description.toLowerCase().includes(repoSearchTerm.toLowerCase()))
  );

  const openController = (lead: any) => {
    setSelectedLead(lead);
    setActiveSidebarTab("lifecycles");
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

  const handleSaveToken = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/github/repos", {
        method: "POST",
        body: JSON.stringify({ githubToken })
      });
      if (res.ok) setIsTokenSaved(true);
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleDisconnectToken = async () => {
    if (!confirm("Confirm Registry Disconnect?")) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/github/repos", { method: "DELETE" });
      if (res.ok) {
        setIsTokenSaved(false);
        setGithubToken("");
        setRepos([]);
      }
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleFetchRepos = async () => {
    setFetchingRepos(true);
    try {
      const res = await fetch("/api/admin/github/repos");
      const data = await res.json();
      if (data.repos) setRepos(data.repos);
    } catch (err) { console.error(err); } finally { setFetchingRepos(false); }
  };

  const handleOpenRepo = async (repo: any, path: string = "") => {
    setSelectedRepo(repo);
    setCurrentPath(path);
    setFetchingFiles(true);
    try {
      const res = await fetch(`/api/admin/github/contents?repo=${repo.fullName}&path=${path}`);
      const data = await res.json();
      if (data.files) setRepoFiles(data.files);
    } catch (err) { console.error(err); } finally { setFetchingFiles(false); }
  };

  const handleUpdateFile = async (file: any, isDelete = false) => {
    if (isDelete && !confirm(`Purge ${file.name} from registry?`)) return;
    setSaving(true);
    try {
      const method = isDelete ? "DELETE" : "PUT";
      const payload = isDelete ? { 
        repo: selectedRepo.fullName, 
        path: file.path, 
        sha: file.sha 
      } : {
        repo: selectedRepo.fullName,
        path: file.path, // Use original path for edits
        content: newBotContent,
        sha: file.sha
      };

      const res = await fetch("/api/admin/github/contents", {
        method: method,
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setFileToEdit(null);
        handleOpenRepo(selectedRepo, currentPath); // Refresh same path
      }
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const handleFetchRecentNotifications = async () => {
    setFetchingRecent(true);
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      if (data.notifications) setRecentNotifications(data.notifications);
    } catch (err) { console.error(err); } finally { setFetchingRecent(false); }
  };

  const handleDispatchNotification = async () => {
    if (notificationTarget === "individual" && !targetUser) {
      alert("Select a target user first.");
      return;
    }
    setDispatching(true);
    try {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        body: JSON.stringify({
          leadId: notificationTarget === "individual" ? targetUser.id : null, 
          ...broadcast
        })
      });
      if (res.ok) {
        setBroadcast({ title: "", message: "", type: "web" });
        setTargetUser(null);
        setUserSearchTerm("");
        handleFetchRecentNotifications();
        alert("Alert dispatched successfully.");
      }
    } catch (err) { 
      console.error(err); 
      alert("Failed to dispatch alert.");
    } finally { setDispatching(false); }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex flex-col font-inter selection:bg-red-500/30 overflow-x-hidden">
      
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
        <aside className={`fixed left-0 top-16 bottom-0 w-64 border-r border-white/5 bg-[#020617] lg:flex flex-col p-6 space-y-8 z-40 transition-transform duration-500 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
           <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 px-4 mb-4 italic">Management Shell</p>
              <SidebarItem active={activeView === 'leads'} onClick={() => {setActiveView('leads'); setSelectedRepo(null); setIsMobileOpen(false);}} icon={<Users className="w-4 h-4" />} label="Lead Library" />
              <SidebarItem active={activeView === 'notifications'} onClick={() => {setActiveView('notifications'); setSelectedRepo(null); setIsMobileOpen(false);}} icon={<Megaphone className="w-4 h-4" />} label="Broadcasts" />
              <SidebarItem active={activeView === 'github'} onClick={() => {setActiveView('github'); setSelectedRepo(null); setIsMobileOpen(false);}} icon={<GitBranch className="w-4 h-4" />} label="GitHub Pulse" />
              <SidebarItem active={activeView === 'logs'} onClick={() => {setActiveView('logs'); setSelectedRepo(null); setIsMobileOpen(false);}} icon={<Terminal className="w-4 h-4" />} label="Command History" />
           </div>
        </aside>

        <main className="flex-1 lg:ml-64 p-5 md:p-10 max-w-7xl mx-auto w-full space-y-10 min-h-screen">
           
           <AnimatePresence mode="wait">
             {activeView === 'leads' && (
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="leads" className="space-y-10">
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
                                     <td className="p-6 text-left">
                                        <div className="flex items-center gap-4">
                                           <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center font-black text-xs text-red-500">{lead.name.charAt(0)}</div>
                                           <div>
                                              <p className="text-sm font-black text-white group-hover:text-red-500 transition-colors italic">{lead.name}</p>
                                              <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-0.5">{lead.email}</p>
                                           </div>
                                        </div>
                                     </td>
                                     <td className="p-6 text-left">
                                        <div className="space-y-1">
                                           <p className="text-xs font-black text-white/60 tracking-tight italic">{lead.domainName}</p>
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
               <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} key="notifications" className="space-y-10">
                  <header className="flex items-center justify-between">
                    <h2 className="text-4xl font-black uppercase tracking-tighter italic text-white leading-none">Broadcast HQ</h2>
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
                       <button onClick={() => {setNotificationTarget('broadcast'); setTargetUser(null);}} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${notificationTarget === 'broadcast' ? 'bg-red-600 text-white' : 'text-white/30'}`}>Global</button>
                       <button onClick={() => setNotificationTarget('individual')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${notificationTarget === 'individual' ? 'bg-red-600 text-white' : 'text-white/30'}`}>Individual</button>
                    </div>
                  </header>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-[#020617] border border-white/10 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
                         <div className="space-y-4 relative">
                            {notificationTarget === 'individual' && (
                              <div className="space-y-3 relative">
                                <label className="text-[10px] font-black uppercase tracking-widest text-white/20 italic pl-2">Target Node Selection</label>
                                <div className="relative">
                                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                  <input 
                                    type="text" 
                                    placeholder="Search user by name or email..." 
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm font-bold text-white focus:border-red-500/40"
                                    value={targetUser ? targetUser.name : userSearchTerm}
                                    onChange={(e) => {
                                      setUserSearchTerm(e.target.value);
                                      if (targetUser) setTargetUser(null);
                                      setShowUserDropdown(true);
                                    }}
                                    onFocus={() => setShowUserDropdown(true)}
                                  />
                                  <AnimatePresence>
                                    {showUserDropdown && userSearchTerm && !targetUser && (
                                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto">
                                        {initialLeads.filter(l => l.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || l.email.toLowerCase().includes(userSearchTerm.toLowerCase())).map(u => (
                                          <button key={u.id} onClick={() => {setTargetUser(u); setUserSearchTerm(u.name); setShowUserDropdown(false);}} className="w-full p-4 flex items-center justify-between hover:bg-white/5 text-left border-b border-white/5 last:border-0">
                                            <div>
                                              <p className="text-xs font-black text-white italic">{u.name}</p>
                                              <p className="text-[10px] text-white/20 font-bold uppercase">{u.email}</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-white/20" />
                                          </button>
                                        ))}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            )}

                            <div className="grid grid-cols-3 gap-4">
                               <button onClick={() => setBroadcast({...broadcast, type: 'web'})} className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${broadcast.type === 'web' ? 'bg-red-600 border-red-500 text-white' : 'bg-white/5 border-white/10 text-white/30'}`}><Globe className="w-4 h-4" /> Web Shell</button>
                               <button onClick={() => setBroadcast({...broadcast, type: 'email'})} className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${broadcast.type === 'email' ? 'bg-red-600 border-red-500 text-white' : 'bg-white/5 border-white/10 text-white/30'}`}><Mail className="w-4 h-4" /> SMTP Alert</button>
                               <button onClick={() => setBroadcast({...broadcast, type: 'both'})} className={`py-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${broadcast.type === 'both' ? 'bg-red-600 border-red-500 text-white' : 'bg-white/5 border-white/10 text-white/30'}`}><Megaphone className="w-4 h-4" /> Global Pulse</button>
                            </div>
                            <div className="space-y-4 pt-4">
                               <input type="text" placeholder="Title..." className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-sm font-bold text-white focus:outline-none focus:border-red-500/30" value={broadcast.title} onChange={(e) => setBroadcast({...broadcast, title: e.target.value})} />
                               <textarea placeholder="Message..." className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-6 px-6 text-sm font-bold text-white min-h-[200px] resize-none focus:outline-none focus:border-red-500/30" value={broadcast.message} onChange={(e) => setBroadcast({...broadcast, message: e.target.value})} />
                               <button onClick={handleDispatchNotification} disabled={dispatching || !broadcast.title || !broadcast.message || (notificationTarget === 'individual' && !targetUser)} className="w-full py-5 bg-red-600 hover:bg-red-500 rounded-2xl text-xs font-black uppercase tracking-widest text-white italic disabled:opacity-50 transition-all shadow-xl shadow-red-900/20 active:scale-95">
                                 {dispatching ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Dispatch Authority Alert"}
                               </button>
                            </div>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic pl-4">Registry Pulse</h3>
                      <div className="bg-[#020617] border border-white/10 rounded-[2.5rem] p-6 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar shadow-xl">
                        {fetchingRecent ? (
                          <div className="py-20 flex flex-col items-center justify-center gap-4 text-white/10"><Loader2 className="w-6 h-6 animate-spin" /><p className="text-[9px] font-black uppercase tracking-widest">Syncing History...</p></div>
                        ) : recentNotifications.length > 0 ? (
                          recentNotifications.map(n => (
                            <div key={n.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${n.type === 'email' ? 'bg-blue-500/10 text-blue-500' : n.type === 'web' ? 'bg-purple-500/10 text-purple-500' : 'bg-red-500/10 text-red-500'}`}>{n.type}</span>
                                <span className="text-[8px] font-bold text-white/10">{new Date(n.createdAt).toLocaleDateString()}</span>
                              </div>
                              <h4 className="text-xs font-black text-white italic truncate">{n.title}</h4>
                              <p className="text-[10px] text-white/30 line-clamp-2 leading-relaxed italic">{n.message}</p>
                              <div className="pt-2 border-t border-white/5 flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-red-500" />
                                <span className="text-[8px] font-black uppercase text-white/20 tracking-widest">{n.leadId ? 'Node-Specific' : 'Global Broadcast'}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-20 text-center space-y-4">
                            <Megaphone className="w-8 h-8 text-white/5 mx-auto" />
                            <p className="text-[9px] font-black uppercase tracking-widest text-white/10">No recent dispatches</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
               </motion.div>
             )}

              {activeView === 'logs' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="logs-view" className="space-y-10">
                   <header><h2 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">Global System Logs</h2></header>
                   <div className="bg-black/40 border border-white/10 rounded-[2.5rem] p-8 font-mono text-[10px] space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                      <p className="text-emerald-500/50">[AUTH] Authority session initialized for node: {admin.email}</p>
                      <p className="text-white/20">[SYS] Syncing lead registry cluster (Nodes: {initialLeads.length})</p>
                      <p className="text-white/20">[SYS] Handshaking with GitHub Master Registry...</p>
                      {isTokenSaved && <p className="text-emerald-500/40">[GIT] Connection established. Branch: master</p>}
                      <p className="text-blue-500/40">[NET] Satellite link established via Cloudflare/Netlify</p>
                      <div className="pt-4 border-t border-white/5 mt-4">
                         <p className="text-white/40">Ready for institutional commands.</p>
                      </div>
                   </div>
                </motion.div>
              )}

             {activeView === 'github' && !selectedRepo && (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} key="github-list" className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                     <div className="md:col-span-1 space-y-8">
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">Repo Hive</h2>
                        <div className="space-y-3">
                           <input type="password" placeholder="GitHub PAT..." className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 px-6 text-xs font-bold text-white" value={githubToken} onChange={(e) => setGithubToken(e.target.value)} />
                           {isTokenSaved ? (
                             <button onClick={handleDisconnectToken} disabled={saving} className="w-full py-4 bg-red-600/10 border border-red-600/20 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest italic transition-all">Disconnect Registry</button>
                           ) : (
                             <button onClick={handleSaveToken} disabled={saving || !githubToken} className="w-full py-4 bg-white text-black hover:bg-white/90 rounded-2xl text-[10px] font-black uppercase tracking-widest italic transition-all">Connect Hub</button>
                           )}
                        </div>

                        {isTokenSaved && (
                           <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col gap-4">
                              <div className="flex items-center gap-3 text-emerald-500">
                                 <ShieldCheck className="w-4 h-4" />
                                 <span className="text-[10px] font-black uppercase tracking-widest">Authority Synchronized</span>
                              </div>
                              <p className="text-[9px] font-bold text-white/30 uppercase leading-loose italic">The registry is currently locked to your institutional PAT. Repositories will sync in real-time.</p>
                           </div>
                        )}
                     </div>

                     <div className="md:col-span-2 space-y-6">
                        {isTokenSaved ? (
                           <>
                              <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                <input type="text" placeholder="Filter repositories..." className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-xs font-bold text-white focus:border-red-500/30" value={repoSearchTerm} onChange={(e) => setRepoSearchTerm(e.target.value)} />
                              </div>
                              {fetchingRepos ? (
                                <div className="h-64 flex flex-col items-center justify-center gap-4 text-white/20"><Loader2 className="w-8 h-8 animate-spin" /><p className="text-[10px] uppercase font-black tracking-widest">Syncing Registry...</p></div>
                              ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                   {filteredRepos.map(r => (
                                     <button key={r.id} onClick={() => handleOpenRepo(r)} className="p-6 text-left rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-red-500/30 transition-all group overflow-hidden relative">
                                        <div className="flex items-center gap-3 mb-4">
                                           <Code2 className="w-4 h-4 text-red-500" />
                                           <span className="text-xs font-black uppercase tracking-widest text-white italic truncate">{r.name}</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-white/30 line-clamp-2 h-8 leading-relaxed italic">{r.description || 'Institutional build branch...'}</p>
                                        <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                                           <span className="text-[9px] font-black uppercase text-red-600/50">{r.language || 'Binary'}</span>
                                           <div className="flex items-center gap-2 text-[9px] font-black text-white/20"><Star className="w-3 h-3" /> {r.stars}</div>
                                        </div>
                                     </button>
                                   ))}
                                </div>
                              )}
                           </>
                        ) : (
                          <div className="h-full min-h-[400px] border border-white/5 border-dashed rounded-[3rem] flex flex-col items-center justify-center text-center p-12 space-y-4">
                             <Lock className="w-16 h-16 text-white/5" />
                             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic">Registry Locked</p>
                          </div>
                        )}
                     </div>
                  </div>
               </motion.div>
             )}

             {activeView === 'github' && selectedRepo && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} key="repo-explorer" className="space-y-10">
                   <header className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                         <button onClick={() => setSelectedRepo(null)} className="p-3 bg-white/5 rounded-2xl hover:text-red-500 transition-all"><ChevronLeft className="w-5 h-5" /></button>
                         <div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">{selectedRepo.name}</h2>
                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">{currentPath || 'root'}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         {currentPath && (
                            <button onClick={() => {
                               const parts = currentPath.split('/');
                               parts.pop();
                               handleOpenRepo(selectedRepo, parts.join('/'));
                            }} className="px-6 py-3 border border-white/10 text-white/30 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all italic flex items-center gap-2">Parent Dir</button>
                         )}
                         <button className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-emerald-900/40 transform active:scale-95 transition-all"><Upload className="w-4 h-4" /> Upload Bot</button>
                      </div>
                   </header>

                   <div className="bg-[#020617] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
                      {fetchingFiles ? (
                         <div className="p-32 flex flex-col items-center justify-center gap-6"><Loader2 className="w-12 h-12 animate-spin text-red-500" /><p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Extracting Bot Cluster...</p></div>
                      ) : repoFiles.length > 0 ? (
                        <div className="divide-y divide-white/[0.03]">
                           {repoFiles.map(file => (
                             <div key={file.sha} className="p-8 flex items-center justify-between group hover:bg-white/[0.01]">
                                <div className="flex items-center gap-6">
                                   {file.type === 'dir' ? (
                                      <div onClick={() => handleOpenRepo(selectedRepo, file.path)} className="w-12 h-12 rounded-2xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center cursor-pointer hover:bg-amber-600/20 transition-all"><Folder className="w-5 h-5 text-amber-500" /></div>
                                   ) : (
                                      <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shadow-xl"><FileCode className="w-5 h-5 text-blue-500" /></div>
                                   )}
                                   <div>
                                      <p className={`text-sm font-black italic truncate max-w-xs ${file.type === 'dir' ? 'text-amber-500 cursor-pointer' : 'text-white'}`} onClick={() => file.type === 'dir' && handleOpenRepo(selectedRepo, file.path)}>{file.name}</p>
                                      <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">
                                         {file.type === 'dir' ? 'DIRECTORY' : `SHA: ${file.sha.substring(0,8)} | Size: ${Math.round(file.size/1024)}KB`}
                                      </p>
                                   </div>
                                </div>
                                {file.type !== 'dir' && (
                                   <div className="flex items-center gap-3">
                                      <button onClick={() => { setFileToEdit(file); setNewBotName(file.name); }} className="p-3 bg-white/5 text-white/40 hover:text-white rounded-xl transition-all"><Edit3 className="w-4 h-4" /></button>
                                      <button onClick={() => handleUpdateFile(file, true)} className="p-3 bg-red-600/10 text-red-500/40 hover:text-red-500 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                      <a href={file.downloadUrl} target="_blank" className="p-3 bg-white/5 text-white/40 hover:text-white rounded-xl transition-all"><Download className="w-4 h-4" /></a>
                                   </div>
                                )}
                             </div>
                           ))}
                        </div>
                      ) : (
                        <div className="p-32 text-center space-y-6">
                           <FileCode className="w-16 h-16 text-white/5 mx-auto" />
                           <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic">No Bot Binaries Identified in Cluster</p>
                        </div>
                      )}
                   </div>
                </motion.div>
             )}
           </AnimatePresence>

        </main>
      </div>

      <AnimatePresence>
         {fileToEdit && (
            <>
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFileToEdit(null)} className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-md" />
               <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="fixed inset-0 m-auto w-full max-w-4xl h-fit z-[160] p-10 space-y-10">
                  <div className="bg-[#020617] border border-white/10 rounded-[3.5rem] p-10 shadow-2xl space-y-10 relative overflow-hidden">
                     <header className="flex items-center justify-between">
                        <div className="space-y-1">
                           <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Bot Registrar</h3>
                           <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Protocol Override & Deployment</p>
                        </div>
                        <X className="w-6 h-6 text-white/20 cursor-pointer" onClick={() => setFileToEdit(null)} />
                     </header>

                     <div className="space-y-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-white/20 italic pl-2">Bot Filename</label>
                           <input type="text" className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 text-sm font-black text-white italic focus:border-red-500/40" value={newBotName} onChange={(e) => setNewBotName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase tracking-widest text-white/20 italic pl-2">XML Source Payload</label>
                           <textarea placeholder="Paste bot XML content here..." className="w-full bg-black/40 border border-white/10 rounded-2xl py-6 px-6 text-xs text-emerald-400 font-mono min-h-[350px] resize-none focus:border-red-500/40" value={newBotContent} onChange={(e) => setNewBotContent(e.target.value)} />
                        </div>
                     </div>

                     <div className="flex gap-4">
                        <button onClick={() => setFileToEdit(null)} className="flex-1 py-5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/20 hover:bg-white/5 italic">Cancel</button>
                        <button onClick={() => handleUpdateFile(fileToEdit)} disabled={saving} className="flex-[2] py-5 bg-red-600 hover:bg-red-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white italic flex items-center justify-center gap-3 shadow-2xl shadow-red-900/50">
                           {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                           Push to Master branch
                        </button>
                     </div>
                  </div>
               </motion.div>
            </>
         )}
      </AnimatePresence>

      <AnimatePresence>
         {selectedLead && (
           <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLead(null)} className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]" />
              <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed top-0 right-0 bottom-0 w-full lg:w-[500px] bg-[#020617] border-l border-white/10 z-[110] shadow-2xl overflow-y-auto">
                 <div className="p-8 space-y-10 pb-24">
                    <header className="flex items-center justify-between">
                       <div><h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Node Controller</h2><p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{selectedLead.name}</p></div>
                       <button onClick={() => setSelectedLead(null)} className="p-2 text-white/20 hover:text-white"><X className="w-6 h-6" /></button>
                    </header>
                    <div className="flex gap-2 p-1.5 bg-white/[0.03] border border-white/5 rounded-2xl">
                       <button onClick={() => setActiveSidebarTab("lifecycles")} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest italic flex items-center justify-center gap-2 transition-all ${activeSidebarTab === 'lifecycles' ? 'bg-red-600 text-white' : 'text-white/30 hover:bg-white/5'}`}><Zap className="w-3.5 h-3.5" /> Lifecycles</button>
                       <button onClick={() => setActiveSidebarTab("portfolio")} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest italic flex items-center justify-center gap-2 transition-all ${activeSidebarTab === 'portfolio' ? 'bg-red-600 text-white' : 'text-white/30 hover:bg-white/5'}`}><User className="w-3.5 h-3.5" /> Profile</button>
                       <button onClick={() => setActiveSidebarTab("transmit")} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest italic flex items-center justify-center gap-2 transition-all ${activeSidebarTab === 'transmit' ? 'bg-red-600 text-white' : 'text-white/30 hover:bg-white/5'}`}><Send className="w-3.5 h-3.5" /> Transmit</button>
                       <button onClick={() => setActiveSidebarTab("logs")} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest italic flex items-center justify-center gap-2 transition-all ${activeSidebarTab === 'logs' ? 'bg-red-600 text-white' : 'text-white/30 hover:bg-white/5'}`}><Terminal className="w-3.5 h-3.5" /> Event</button>
                    </div>
                    {activeSidebarTab === "lifecycles" ? (
                       <section className="space-y-6">
                       <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500 italic pb-2 border-b border-red-500/20">Lifecycle Override</h3>
                       {localStatuses && (
                          <div className="space-y-3">
                             <ToggleItem label="Domain Mapping" completed={localStatuses.domainStatus === 'completed'} onClick={() => setLocalStatuses({...localStatuses, domainStatus: localStatuses.domainStatus === 'completed' ? 'pending' : 'completed'})} />
                             <ToggleItem label="Core Dev Build" completed={localStatuses.devStatus === 'completed'} onClick={() => setLocalStatuses({...localStatuses, devStatus: localStatuses.devStatus === 'completed' ? 'pending' : 'completed'})} />
                             <ToggleItem label="Cloud Deployment" completed={localStatuses.deployStatus === 'completed'} onClick={() => setLocalStatuses({...localStatuses, deployStatus: localStatuses.deployStatus === 'completed' ? 'pending' : 'completed'})} />
                             <button onClick={handleSaveLifecycle} disabled={saving} className="w-full py-4 mt-6 bg-red-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white italic shadow-xl flex items-center justify-center gap-3">{saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Node State"}</button>
                          </div>
                       )}
                    </section>
                    ) : activeSidebarTab === "portfolio" ? (
                      <section className="space-y-10">
                         <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 space-y-6">
                            <PortfolioField icon={<User className="w-3" />} label="Node Identity" value={selectedLead.name} />
                            <PortfolioField icon={<Mail className="w-3" />} label="Institutional Email" value={selectedLead.email} />
                            <PortfolioField icon={<Smartphone className="w-3" />} label="WhatsApp Relay" value={selectedLead.whatsapp} />
                            <PortfolioField icon={<Code2 className="w-3" />} label="Deriv Client ID" value={selectedLead.clientId} />
                            <PortfolioField icon={<Zap className="w-3" />} label="API Architecture" value={selectedLead.apiConfig} />
                            <PortfolioField icon={<Activity className="w-3" />} label="Service Tier" value={selectedLead.projectType} />
                            <PortfolioField icon={<Globe className="w-3" />} label="Base Domain" value={selectedLead.domainName} />
                            <PortfolioField icon={<Database className="w-3" />} label="DNS Registrar" value={selectedLead.domainProvider} />
                         </div>
                      </section>
                    ) : activeSidebarTab === "transmit" ? (
                      <section className="space-y-8">
                         <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-red-500 italic pb-2 border-b border-red-500/20">Direct Node Transmission</h3>
                         <div className="space-y-4">
                            <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-xl">
                               <button onClick={() => setBroadcast({...broadcast, type: 'web'})} className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${broadcast.type === 'web' ? 'bg-white/10 text-white' : 'text-white/20'}`}>Web</button>
                               <button onClick={() => setBroadcast({...broadcast, type: 'email'})} className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${broadcast.type === 'email' ? 'bg-white/10 text-white' : 'text-white/20'}`}>Email</button>
                               <button onClick={() => setBroadcast({...broadcast, type: 'both'})} className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase transition-all ${broadcast.type === 'both' ? 'bg-white/10 text-white' : 'text-white/20'}`}>Both</button>
                            </div>
                            <input type="text" placeholder="Subject..." className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 px-4 text-xs font-bold text-white focus:border-red-500/40" value={broadcast.title} onChange={(e) => setBroadcast({...broadcast, title: e.target.value})} />
                            <textarea placeholder="Transmission payload..." className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-4 px-4 text-xs font-bold text-white min-h-[150px] resize-none focus:border-red-500/40" value={broadcast.message} onChange={(e) => setBroadcast({...broadcast, message: e.target.value})} />
                            <button onClick={async () => {
                              setDispatching(true);
                              try {
                                const res = await fetch("/api/admin/notifications", {
                                  method: "POST",
                                  body: JSON.stringify({ leadId: selectedLead.id, ...broadcast })
                                });
                                if (res.ok) {
                                  setBroadcast({ title: "", message: "", type: "web" });
                                  alert("Transmission Successful");
                                }
                              } catch (err) { alert("Transmission Failed"); } finally { setDispatching(false); }
                            }} disabled={dispatching || !broadcast.title || !broadcast.message} className="w-full py-4 bg-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest text-white italic shadow-lg shadow-red-900/20">
                               {dispatching ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Initiate Dispatch"}
                            </button>
                         </div>
                      </section>
                    ) : (
                      <section className="space-y-6">
                         <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic pb-2 border-b border-white/5">Handshake Events</h3>
                         <div className="bg-black/40 rounded-2xl p-6 font-mono text-[9px] space-y-3">
                            <p className="text-white/30">[{new Date().toLocaleTimeString()}] Fetching node metrics...</p>
                            <p className="text-white/30">[{new Date().toLocaleTimeString()}] Analyzing domain propagation...</p>
                            <p className="text-emerald-500/50">[{new Date().toLocaleTimeString()}] Secure link established with {selectedLead.name}</p>
                         </div>
                      </section>
                    )}
                 </div>
              </motion.div>
           </>
         )}
      </AnimatePresence>
    </div>
  );
}

function PortfolioField({ icon, label, value }: any) {
   return (<div className="space-y-1"><div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-white/20 italic">{icon} {label}</div><p className="text-xs font-black text-white italic">{value}</p></div>);
}

function Dot({ active }: { active: boolean }) {
  return <div className={`w-2 h-2 rounded-full transition-all duration-500 ${active ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-white/10'}`} />
}

function SidebarItem({ icon, label, active = false, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full py-4 px-5 rounded-2xl flex items-center gap-4 transition-all duration-500 relative group ${active ? 'bg-red-600 text-white shadow-xl shadow-red-900/40' : 'text-white/20 hover:text-white hover:bg-white/[0.04]'}`}>
       <span className={active ? 'scale-110' : 'group-hover:scale-110 transition-all'}>{icon}</span>
       <span className="text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
       {active && <motion.div layoutId="admin-nav" className="absolute left-0 w-1 h-6 bg-white rounded-r-full" />}
    </button>
  );
}

function StatCard({ label, value, icon }: any) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-[#020617] border border-white/10 shadow-xl flex items-center gap-8 group hover:border-red-500/20 transition-all relative">
       <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 group-hover:bg-red-600/10 transition-all">{icon}</div>
       <div><p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mb-2 italic leading-none">{label}</p><p className="text-2xl font-black text-white italic leading-none tracking-tighter tabular-nums">{value}</p></div>
    </div>
  );
}

function ToggleItem({ label, completed, onClick }: any) {
  return (
    <div onClick={onClick} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.01] border border-white/5 group hover:border-red-500/20 transition-all cursor-pointer">
       <span className={`text-[11px] font-black uppercase tracking-[0.2em] italic ${completed ? 'text-white' : 'text-white/20'}`}>{label}</span>
       <div className={`w-12 h-7 rounded-full relative transition-all duration-500 ${completed ? 'bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-white/10'}`}><div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all duration-500 ${completed ? 'left-6 shadow-md' : 'left-1.5'}`} /></div>
    </div>
  );
}

function Lock(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
}
