"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Mail, Phone, ShieldCheck } from "lucide-react";

export default function AdminOnboardingForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ email: "", phone: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/onboarding", {
        method: "POST",
        body: JSON.stringify(form)
      });
      if (res.ok) setSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-8 rounded-[2rem] bg-red-600/5 border border-red-500/20 text-center space-y-4 animate-in fade-in zoom-in duration-500">
         <ShieldCheck className="w-12 h-12 text-red-500 mx-auto" />
         <h3 className="text-xl font-black uppercase text-white italic">Node Dispatched</h3>
         <p className="text-white/40 text-xs font-bold leading-relaxed">Check your mailbox for the Institutional Access key.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="space-y-3">
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-red-500 transition-colors" />
          <input 
            type="email" 
            placeholder="Authority Email" 
            required
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white placeholder:text-white/10 focus:outline-none focus:border-red-500/50 transition-all"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="relative group">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-red-500 transition-colors" />
          <input 
            type="tel" 
            placeholder="Staff Phone" 
            required
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white placeholder:text-white/10 focus:outline-none focus:border-red-500/50 transition-all"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
      </div>

      <button 
        disabled={loading}
        type="submit" 
        className="w-full bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest italic py-4 rounded-2xl shadow-xl shadow-red-900/40 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Identity"}
        {!loading && <ArrowRight className="w-4 h-4" />}
      </button>
    </form>
  );
}
