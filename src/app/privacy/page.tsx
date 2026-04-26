"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Lock } from "lucide-react";
import Link from "next/link";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-20 font-inter">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-accent text-xs font-black uppercase tracking-widest mb-12 hover:translate-x-1 transition-transform">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-8">
          <Lock className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none italic">Privacy Policy</h1>
        <div className="space-y-8 text-foreground/60 font-bold leading-relaxed">
          <section>
            <h2 className="text-white uppercase tracking-widest text-sm mb-4">1. Data Security</h2>
            <p>Your trading credentials never touch our permanent storage. We utilize isolated session tokens to ensure your master account remains private.</p>
          </section>
          <section>
            <h2 className="text-white uppercase tracking-widest text-sm mb-4">2. Infrastructure Logs</h2>
            <p>We collect minimal telemetry data strictly for build optimization and error tracking within your DevOps pipeline.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
