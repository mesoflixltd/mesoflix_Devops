"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-20 font-inter">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-accent text-xs font-black uppercase tracking-widest mb-12 hover:translate-x-1 transition-transform">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-8">
          <Shield className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none italic">Terms of Service</h1>
        <div className="space-y-8 text-foreground/60 font-bold leading-relaxed">
          <section>
            <h2 className="text-white uppercase tracking-widest text-sm mb-4">1. Enterprise Agreement</h2>
            <p>By using Mesoflix Systems, you agree to our institutional DevOps framework. We provide infrastructure automation for the Deriv ecosystem.</p>
          </section>
          <section>
            <h2 className="text-white uppercase tracking-widest text-sm mb-4">2. Identity Management</h2>
            <p>We operate under a Zero-Trust security model. You are responsible for the Client IDs and tokens generated within your project workspace.</p>
          </section>
          <section>
            <h2 className="text-white uppercase tracking-widest text-sm mb-4">3. Automated Infrastructure</h2>
            <p>Deployment speeds and system uptimes are subject to global edge node availability. We maintain a 99.9% uptime target for all premium clients.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
