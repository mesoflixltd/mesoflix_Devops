"use client";

import { ArrowLeft, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function SecurityPolicy() {
  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-20 font-inter">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-accent text-xs font-black uppercase tracking-widest mb-12 hover:translate-x-1 transition-transform">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-8">
          <ShieldAlert className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none italic">Security Ethics</h1>
        <div className="space-y-8 text-foreground/60 font-bold leading-relaxed">
          <section>
            <h2 className="text-white uppercase tracking-widest text-sm mb-4">1. Zero-Trust Architecture</h2>
            <p>Our systems are built on the principle of never trust, always verify. Every API handshake is signed and isolated to protect your environment.</p>
          </section>
          <section>
            <h2 className="text-white uppercase tracking-widest text-sm mb-4">2. Ethical Bot Deployment</h2>
            <p>We advocate for responsible trading automation. Our infrastructure enforces risk management and system integrity at the core level.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
