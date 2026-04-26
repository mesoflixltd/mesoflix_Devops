"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, ShieldCheck, Zap, Activity } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Campaign() {
  const router = useRouter();

  const handleCreateV2 = () => {
    // Open the hidden affiliate redirect endpoint
    window.open("/api/redirect/deriv", "_blank");
    // Optionally route them back to onboarding after a delay if they stay on this tab
    setTimeout(() => {
      router.push("/onboarding");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-inter selection:bg-accent/30 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-0 right-[-10%] w-[50vw] h-[50vw] bg-accent/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header / Back */}
        <Link href="/onboarding" className="inline-flex items-center gap-2 text-foreground/50 hover:text-accent text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] mb-12 group transition-colors">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Setup
        </Link>
        
        {/* High-End Campaign Banner Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full aspect-[2/1] md:aspect-[21/9] rounded-3xl overflow-hidden relative mb-12 shadow-2xl shadow-accent/10 border border-white/5"
        >
          <img 
            src="/og-image.png" 
            alt="Mesoflix V2 Architecture" 
            className="w-full h-full object-cover scale-[1.02] hover:scale-[1.05] transition-transform duration-[2s]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
        </motion.div>

        {/* The Essay Content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-10"
        >
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-accent text-[10px] font-black uppercase tracking-[0.3em] bg-accent/10 px-3 py-1.5 rounded-full mb-2">
              <BoltIcon /> Architecture Upgrade Required
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none italic">
              Unlocking the <span className="text-accent">V2 Ecosystem</span>
            </h1>
            <p className="text-base md:text-xl font-bold text-foreground/60 leading-relaxed max-w-3xl pt-2">
              To fully harness the institutional-grade pipeline of Mesoflix Systems, migrating your developer profile to the modern Application structure is mandatory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl flex flex-col gap-4">
              <Zap className="w-6 h-6 text-accent" />
              <h3 className="text-sm font-black uppercase tracking-widest leading-tight">High-Frequency Execution</h3>
              <p className="text-xs font-bold text-foreground/40 leading-relaxed">
                The new V2 endpoints eliminate micro-latency, allowing our proprietary algorithms to execute trades with unprecedented synchronization across the Deriv API.
              </p>
            </div>
            <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl flex flex-col gap-4">
              <ShieldCheck className="w-6 h-6 text-accent" />
              <h3 className="text-sm font-black uppercase tracking-widest leading-tight">Zero-Trust Isolation</h3>
              <p className="text-xs font-bold text-foreground/40 leading-relaxed">
                Mesoflix Systems utilizes next-generation token scoping. By creating a fresh V2 account instance, you guarantee your Master API limits are never compromised.
              </p>
            </div>
            <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-2xl flex flex-col gap-4">
              <Activity className="w-6 h-6 text-accent" />
              <h3 className="text-sm font-black uppercase tracking-widest leading-tight">Elite Infrastructure</h3>
              <p className="text-xs font-bold text-foreground/40 leading-relaxed">
                We handle the DevOps, you handle the scale. Our multi-cloud deployments require the precision and stability only the modern Deriv architecture provides.
              </p>
            </div>
          </div>

          <div className="bg-white/[0.01] border border-white/[0.05] p-8 md:p-12 rounded-[2rem] text-center max-w-2xl mx-auto space-y-6 mt-12">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Ready to Initialize?</h2>
            <p className="text-xs font-bold text-foreground/50 leading-relaxed max-w-md mx-auto">
              Secure your infrastructure directly with the Deriv Authority network, then return immediately to link your new developer Client ID.
            </p>
            <button 
              onClick={handleCreateV2}
              className="w-full max-w-xs mx-auto h-16 bg-accent text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:scale-[1.05] active:scale-[0.95] transition-all shadow-[0_0_40px_rgba(255,68,79,0.3)] hover:shadow-[0_0_60px_rgba(255,68,79,0.5)] flex items-center justify-center gap-3 mt-4"
            >
              Create the V2 Account Now
              <ExternalLink className="w-4 h-4 mt-[-2px]" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
      <path d="M11.996 22q-.204 0-.378-.093a.754.754 0 0 1-.264-.265l-9-15.5q-.153-.264-.136-.549.017-.285.201-.525Q2.602 4.825 2.89 4.701 3.178 4.577 3.496 4.5h17q.318.077.606.201.288.124.472.367.184.24.201.525.017.285-.136.549l-9 15.5q-.094.172-.264.265-.17.093-.379.093Z" />
    </svg>
  );
}
