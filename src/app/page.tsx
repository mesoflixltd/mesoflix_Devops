"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Terminal, 
  Server, 
  ChevronRight, 
  Activity, 
  Lock, 
  Zap, 
  TrendingUp,
  Cpu,
  ArrowRight,
  Globe,
  Database
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1611974717483-9b250abc06c1?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop"
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 15 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <div className="relative min-h-screen bg-[#020617] selection:bg-accent/30 overflow-x-hidden">
      {/* Navbar - Institutional Style */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.05] bg-[#020617]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
              <Activity className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tighter uppercase italic">Mesoflix</span>
              <span className="text-[10px] tracking-[0.3em] font-bold text-accent uppercase">Systems</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-10 text-xs font-bold uppercase tracking-[0.1em] text-foreground/50">
            <a href="#expertise" className="hover:text-accent transition-colors">Expertise</a>
            <a href="#ecosystem" className="hover:text-accent transition-colors">Ecosystem</a>
            <a href="#security" className="hover:text-accent transition-colors">Security</a>
            <Link href="/register" className="h-10 flex items-center px-6 rounded bg-white text-black hover:bg-zinc-200 transition-all font-black">
              Client Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Slider */}
      <section className="relative min-h-screen flex items-center px-6 pt-20 overflow-hidden">
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 0.6, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${HERO_IMAGES[currentImage]})` }}
            />
          </AnimatePresence>
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617]/30 to-[#020617]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-[#020617]" />
        </div>

        <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-10 w-full mt-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.05] backdrop-blur-md text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Empowering Professional Deriv Traders
          </motion.div>

          <motion.h1 
            {...fadeIn}
            className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[0.95] max-w-5xl drop-shadow-2xl"
          >
            We Build Enterprise <br />
            <span className="text-white/40">Deriv Site Ecosystems</span>
          </motion.h1>

          <motion.p 
            {...fadeIn}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-foreground/70 max-w-2xl mb-12 leading-relaxed font-medium"
          >
            Architectural excellence in trading bot automation, web infrastructure, and high-performance client management systems for the Deriv ecosystem.
          </motion.p>

          <motion.div 
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <Link href="/register" className="h-14 flex items-center px-10 rounded bg-accent text-white font-black hover:scale-[1.02] transition-all shadow-xl shadow-accent/20 gap-3 group">
              Start Your Project
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#expertise" className="h-14 flex items-center px-10 border border-white/10 text-white font-black hover:bg-white/[0.03] transition-all uppercase text-xs tracking-widest backdrop-blur-sm">
              View Capabilities
            </a>
          </motion.div>

          {/* Slider Indicators */}
          <div className="absolute bottom-10 flex gap-2">
            {HERO_IMAGES.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 transition-all duration-500 rounded-full ${currentImage === i ? "w-8 bg-accent" : "w-2 bg-white/20"}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Stats Bar */}
      <section className="border-y border-white/[0.05] bg-white/[0.01] py-8 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <StatItem label="Average Uptime" value="99.99%" />
          <StatItem label="API Latency" value="< 50ms" />
          <StatItem label="Secured Assets" value="Enterprise Grade" />
          <StatItem label="Global Support" value="24/7 Priority" />
        </div>
      </section>

      {/* Core Expertise - Technical Excellence */}
      <section id="expertise" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-20">
            <div className="max-w-2xl">
              <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Expertise</span>
              <h2 className="text-4xl md:text-5xl font-black leading-tight">Engineered for Performance, <br />Built for Scalability.</h2>
            </div>
            <p className="text-foreground/50 max-w-sm text-sm uppercase tracking-wider font-bold mb-2">
              End-to-end development services for algorithmic trading and brokerage infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/[0.05] bg-white/[0.01]">
            <CapabilityCard 
              index="01"
              icon={<TrendingUp className="w-8 h-8" />}
              title="Deriv API Integration"
              desc="Deep integration with Binary and Deriv APIs for real-time trade execution and data management."
              features={["WebSocket Optimization", "Smart Contract Logic", "Automated Risk Management"]}
            />
            <CapabilityCard 
              index="02"
              icon={<Globe className="w-8 h-8" />}
              title="Brokerage Web Systems"
              desc="High-performance web platforms designed for client onboarding and affiliate management."
              features={["Custom CRM Solutions", "White-label Platforms", "Global CDN Nodes"]}
            />
            <CapabilityCard 
              index="03"
              icon={<Database className="w-8 h-8" />}
              title="Infrastructure Managed"
              desc="We architect the server-side infrastructure to ensure your bots never experience downtime."
              features={["Neon Postgres Integration", "Cloud-native Scaling", "Real-time Monitoring"]}
            />
          </div>
        </div>
      </section>

      {/* Ecosystem Section - Visual Tech Focus */}
      <section id="ecosystem" className="py-32 px-6 bg-white/[0.01] border-y border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent/20 blur-[100px] -z-10" />
              <motion.div 
                {...fadeIn}
                className="p-8 border border-white/[0.08] bg-black/40 backdrop-blur-2xl rounded-2xl shadow-2xl"
              >
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/[0.05]">
                  <div className="flex items-center gap-3">
                    <Terminal className="text-accent w-5 h-5" />
                    <span className="text-sm font-black uppercase tracking-widest text-white/40">Infrastructure Status</span>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
                
                <div className="space-y-6">
                  <DeployProgress label="API Handshake" progress={100} />
                  <DeployProgress label="Deriv Sync" progress={100} />
                  <DeployProgress label="Server Build" progress={75} />
                  <DeployProgress label="Security Audit" progress={20} />
                </div>

                <div className="mt-12 pt-8 border-t border-white/[0.05] flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase text-white/30 mb-1">Current Environment</p>
                    <p className="text-xs font-bold font-mono">PROD-US-EAST-1</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase text-white/30 mb-1">Active Instances</p>
                    <p className="text-xs font-bold font-mono text-accent">128 Nodes</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div>
              <span className="text-accent text-[10px] font-black uppercase tracking-[0.3em] mb-4 block">Transparency</span>
              <h2 className="text-4xl font-black mb-8">The Command Center <br />For Your Trading Project.</h2>
              <p className="text-foreground/50 mb-10 text-lg leading-relaxed">
                We don't just develop; we deploy and manage. Our proprietary client portal gives you total visibility into the development lifecycle of your Deriv systems.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <HighlightItem icon={<Zap />} text="Real-time Build Status" />
                <HighlightItem icon={<Lock />} text="Encrypted API Vault" />
                <HighlightItem icon={<Activity />} text="Performance Metrics" />
                <HighlightItem icon={<Server />} text="Server Resource Logs" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security - Institutional Focus */}
      <section id="security" className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-10 bg-white/[0.02]">
            <Shield className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6">Uncompromising Security.</h2>
          <p className="text-foreground/50 text-lg mb-16 max-w-2xl mx-auto">
            Your trading capital and API keys are your most valuable assets. We architect every system with a zero-trust security model.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <SecurityFeature title="Zero Persistance" desc="We never store your master trading passwords on our servers." />
            <SecurityFeature title="Token Isolation" desc="API tokens are isolated with granular scoped permissions." />
            <SecurityFeature title="End-to-End" desc="All backend communications are secured with industry-leading encryption." />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6">
        <div className="max-w-5xl mx-auto p-16 md:p-24 bg-accent relative overflow-hidden flex flex-col items-center text-center rounded-[2rem]">
          <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-white/10 -skew-x-[30deg] translate-x-[20%]" />
          <h2 className="text-4xl md:text-6xl font-black text-white mb-10 relative z-10 leading-tight">Ready to Automate <br />Your Deriv Strategy?</h2>
          <Link href="/register" className="h-16 inline-flex items-center px-12 rounded-full bg-white text-black font-black hover:scale-105 transition-all text-sm uppercase tracking-widest relative z-10 shadow-2xl">
            Start Your Project Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Activity className="text-accent w-6 h-6" />
              <span className="font-black text-xl tracking-tighter uppercase italic">Mesoflix</span>
            </div>
            <p className="text-foreground/40 text-sm max-w-xs mb-8">
              Premium development for professional traders in the Deriv ecosystem. Founded on performance and security.
            </p>
            <div className="flex gap-6">
              {/* Social icons could go here */}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
            <FooterCol title="Systems" links={["Expertise", "Ecosystem", "Security"]} />
            <FooterCol title="Company" links={["Privacy", "Terms", "Support"]} />
            <FooterCol title="Account" links={["Client Portal", "Register"]} />
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-white/[0.05] text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/20 text-center">
          © 2026 Mesoflix Systems Group. All Rights Reserved. Not affiliated with Deriv.com.
        </div>
      </footer>
    </div>
  );
}

function StatItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="text-center lg:text-left">
      <p className="text-[10px] font-black uppercase text-accent tracking-[0.2em] mb-1">{label}</p>
      <p className="text-2xl font-black text-white">{value}</p>
    </div>
  );
}

function CapabilityCard({ index, icon, title, desc, features }: { index: string, icon: React.ReactNode, title: string, desc: string, features: string[] }) {
  return (
    <div className="p-12 border-b md:border-b-0 md:border-r border-white/[0.05] hover:bg-white/[0.02] transition-all group">
      <span className="text-[10px] font-black text-white/20 mb-10 block font-mono">{index}</span>
      <div className="text-accent mb-8 group-hover:scale-110 transition-transform origin-left">{icon}</div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-foreground/40 text-sm mb-8 leading-relaxed font-medium">
        {desc}
      </p>
      <ul className="space-y-3">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-white/60">
            <div className="w-1 h-1 rounded-full bg-accent" />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DeployProgress({ label, progress }: { label: string, progress: number }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] font-black uppercase mb-2 tracking-tighter">
        <span className="text-white/60">{label}</span>
        <span className="text-accent">{progress}%</span>
      </div>
      <div className="h-1 w-full bg-white/[0.03] rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className="h-full bg-accent"
        />
      </div>
    </div>
  );
}

function HighlightItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.03] bg-white/[0.01]">
      <div className="text-accent w-5 h-5">{icon}</div>
      <span className="text-sm font-bold tracking-tight text-white/80">{text}</span>
    </div>
  );
}

function SecurityFeature({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="bg-white/[0.01] p-8 border border-white/[0.05] rounded-xl hover:border-accent/40 transition-colors">
      <h4 className="text-sm font-black uppercase tracking-widest text-white mb-3">{title}</h4>
      <p className="text-xs text-foreground/40 font-medium leading-relaxed">{desc}</p>
    </div>
  );
}

function FooterCol({ title, links }: { title: string, links: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white underline decoration-accent decoration-2 underline-offset-8">{title}</span>
      <div className="flex flex-col gap-3 mt-4">
        {links.map((l, i) => (
          <a key={i} href="#" className="text-xs font-bold text-foreground/40 hover:text-accent transition-colors">{l}</a>
        ))}
      </div>
    </div>
  );
}
