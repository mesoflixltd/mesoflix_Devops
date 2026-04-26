"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe, 
  Activity, 
  ChevronRight, 
  CheckCircle2,
  Lock,
  Cpu,
  BarChart3,
  Server,
  Cloud,
  Menu,
  X,
  Rocket
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1611974717414-0e365851493b?auto=format&fit=crop&q=80&w=2000", // Trading terminal
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000", // Data charts
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=2000", // Server rack
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=2000", // Developer code
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=2000", // Bull trade
  "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000", // Blockchain/Network
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000", // Cyber security
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000", // Global data
  "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=2000", // Digital workspace
  "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=2000", // Analytics
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    transition: { duration: 0.8 }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-accent/30 font-inter">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 p-6 md:p-8 bg-[#020617]/50 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20 group-hover:rotate-12 transition-transform duration-500">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter uppercase italic leading-none">Mesoflix</span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent leading-none mt-1">Systems</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50 italic">
            <a href="#expertise" className="hover:text-accent transition-colors">Expertise</a>
            <a href="#ecosystem" className="hover:text-accent transition-colors">Ecosystem</a>
            <a href="#security" className="hover:text-accent transition-colors">Security</a>
            <Link href="/onboarding" className="h-10 flex items-center px-6 rounded bg-white text-black hover:bg-zinc-200 transition-all font-black not-italic">
              Client Portal
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center bg-white/[0.05] rounded-lg border border-white/10"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X className="w-6 h-6 text-accent" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu className="w-6 h-6 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[40] bg-[#020617] pt-32 p-10 flex flex-col gap-8 md:hidden"
          >
            <MobileNavLink href="#expertise" onClick={() => setIsMenuOpen(false)}>Expertise</MobileNavLink>
            <MobileNavLink href="#ecosystem" onClick={() => setIsMenuOpen(false)}>Ecosystem</MobileNavLink>
            <MobileNavLink href="#security" onClick={() => setIsMenuOpen(false)}>Security</MobileNavLink>
            <Link 
              href="/onboarding" 
              onClick={() => setIsMenuOpen(false)}
              className="h-16 flex items-center justify-center rounded-2xl bg-accent text-white font-black uppercase text-xs tracking-widest"
            >
              Client Portal
            </Link>
            
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", bounce: 0.7 }}
              className="mt-auto bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] flex flex-col items-center gap-4 text-center"
            >
              <Activity className="w-10 h-10 text-accent" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Ready to automate everything?</p>
              <Link href="/onboarding" className="text-accent font-black text-xs uppercase tracking-widest underline decoration-2 underline-offset-4">Get Started</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Slider */}
      <section className="relative min-h-screen flex items-center pt-32 overflow-hidden">
        {/* Background Slider */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0.5 }}
              transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
              className="absolute inset-0"
            >
              <img 
                src={HERO_IMAGES[currentImage]} 
                alt="Infrastructure" 
                className="w-full h-full object-cover"
              />
              {/* Reduced Dimming - lighter overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/40 to-[#020617]/70" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <h1 className="text-6xl md:text-9xl font-black mb-10 leading-[0.85] tracking-tighter uppercase italic">
              Institutional <br />
              <span className="text-accent">Deriv Site</span> <br />
              Ecosystems
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <Link 
                href="/onboarding" 
                className="w-full sm:w-auto h-16 sm:h-20 flex items-center justify-center px-8 sm:px-12 rounded-2xl bg-accent text-white font-black hover:scale-[1.05] active:scale-[0.98] transition-all shadow-2xl shadow-accent/30 gap-4 group text-xs sm:text-sm uppercase tracking-widest text-center"
              >
                Start Your Project Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <div className="flex items-center gap-4 bg-white/[0.03] backdrop-blur-md px-6 py-4 rounded-2xl border border-white/[0.05]">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#020617] bg-zinc-800" />
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-widest text-[#FF444F]">5k+ Clients</span>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Infrastructures</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Slider Indicator */}
        <div className="absolute bottom-10 left-6 z-10 flex gap-2">
          {HERO_IMAGES.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 transition-all duration-500 rounded-full ${i === currentImage ? "w-12 bg-accent" : "w-4 bg-white/20"}`}
            />
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <div className="relative z-10 border-y border-white/[0.05] bg-white/[0.01] backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-wrap justify-between gap-10">
          <StatBox label="System Uptime" value="99.99%" sub="Enterprise Dedicated" />
          <StatBox label="API Latency" value="24ms" sub="Global Edge" />
          <StatBox label="Security Level" value="Multi-Tier" sub="Zero-Trust Logic" />
          <StatBox label="Build Speed" value="Instant" sub="DevOps Automated" />
        </div>
      </div>

      {/* Institutional Expertise Section */}
      <section id="expertise" className="py-32 px-6 bg-[#020617] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 blur-[150px] -z-10 rounded-full" />
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-10 mb-24">
            <div className="max-w-2xl">
              <motion.div {...fadeIn}>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-6">Expertise Overview</p>
                <h2 className="text-5xl md:text-7xl font-black tracking-tight uppercase leading-[0.9]">
                  Enterprise <br />Engineering for <br /><span className="text-foreground/40 italic">Global Markets</span>
                </h2>
              </motion.div>
            </div>
            <motion.div {...fadeIn} transition={{ delay: 0.2 }}>
              <p className="text-lg text-foreground/50 max-w-sm font-bold leading-relaxed">
                We don't just build sites. We architect the backbone of your trading business with institutional precision.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CapabilityCard 
              icon={<Cpu />}
              title="Automated Bot Systems"
              desc="Proprietary trading logic integration with millisecond execution stability and multi-currency support."
              tags={["XML/JS Logic", "High Frequency", "Async Management"]}
            />
            <CapabilityCard 
              icon={<Lock />}
              title="Identity & Security"
              desc="Deep Deriv API token isolation with no master password storage and secure OAuth 2.0 handshake."
              tags={["Token Isolation", "OAuth 2.0", "SSL Optimized"]}
            />
            <CapabilityCard 
              icon={<Shield />}
              title="Brokerage Web Sites"
              desc="High-performance landing pages and portals with integrated client areas and CRM linkability."
              tags={["Next.js Core", "Corporate Aesthetic", "Edge Rendering"]}
            />
          </div>
        </div>
      </section>

      {/* Command Center Visualization */}
      <section id="ecosystem" className="py-32 bg-[#050a1f] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-24">
            <motion.div {...fadeIn}>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-6">Transparency First</p>
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic">Total Project <br />Transparency</h2>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4 space-y-12">
              <FeatureBox 
                title="API Handshake" 
                desc="Real-time verification of your Deriv app credentials before deployment."
              />
              <FeatureBox 
                title="Server Build" 
                desc="Edge-optimized infrastructure deployment on global nodes."
              />
              <FeatureBox 
                title="Security Pulse" 
                desc="Continuous monitoring of SSL certificates and bot execution logs."
              />
            </div>
            
            <div className="lg:col-span-8">
              <div className="p-8 md:p-12 border border-white/[0.05] bg-[#020617] rounded-[3rem] shadow-2xl relative">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 blur-[80px] rounded-full" />
                <div className="flex items-center justify-between mb-12">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/30">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest">Active Build Terminal</p>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">NODE-PROD-24</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_#ff444f]" /></div>
                    <div className="w-3 h-3 rounded-full bg-accent/20 flex items-center justify-center"><div className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_#ff444f]" /></div>
                    <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  </div>
                </div>

                <div className="space-y-6">
                  <DeployProgress label="Repository Initialize" progress={100} code="GIT-CLONE: SUCCESS" />
                  <DeployProgress label="Deriv API Handshake" progress={100} code="TOKEN: VERIFIED" />
                  <DeployProgress label="Database Cluster Build" progress={85} code="NEON-PG: CONNECTING..." />
                  <DeployProgress label="UI Thread Hydration" progress={45} code="FMT: ANIMATING" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-40 px-6 bg-[#020617]">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <div className="w-20 h-20 bg-accent/10 border border-accent/20 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_-12px_#ff444f]">
              <Lock className="w-10 h-10 text-accent" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-8 uppercase tracking-tighter">Zero-Trust Bot Deployment</h2>
            <p className="text-lg text-foreground/50 max-w-2xl mx-auto font-bold leading-relaxed mb-12">
              We never store your master passwords. All systems operate via isolated Deriv API tokens and secure project-specific environments.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <SecurityTag text="Isolated App IDs" />
              <SecurityTag text="No Password Storage" />
              <SecurityTag text="End-to-End Encryption" />
              <SecurityTag text="Audit Ready Logs" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="bg-[#050a1f] border-t border-white/[0.05] pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto p-16 md:p-24 bg-accent relative overflow-hidden flex flex-col items-center text-center rounded-[2rem]">
          <div className="absolute top-0 right-0 w-[50%] h-[100%] bg-white/10 -skew-x-[30deg] translate-x-[20%]" />
          <h2 className="text-4xl md:text-6xl font-black text-white mb-10 relative z-10 leading-tight uppercase">Ready to Automate <br />Your Deriv Strategy?</h2>
          <Link href="/onboarding" className="h-20 sm:h-16 inline-flex items-center px-12 rounded-full bg-white text-black font-black hover:scale-105 transition-all text-[10px] sm:text-sm uppercase tracking-widest relative z-10 shadow-2xl text-center">
            Start Your Project Now
          </Link>
        </div>
        
        <div className="max-w-7xl mx-auto mt-40 flex flex-col md:flex-row justify-between items-center gap-10">
          <Link href="/" className="flex items-center gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all">
            <Activity className="w-5 h-5 text-accent" />
            <span className="text-lg font-black tracking-tighter uppercase italic">Mesoflix Systems</span>
          </Link>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-foreground/20">
            <a href="#" className="hover:text-accent">Terms</a>
            <a href="#" className="hover:text-accent">Privacy</a>
            <a href="#" className="hover:text-accent">Security Policy</a>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/10 px-6 py-2 border border-white/[0.05] rounded-full">
            Institutional Devops © 2026
          </p>
        </div>
      </footer>
    </div>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string, children: React.ReactNode, onClick: () => void }) {
  return (
    <a 
      href={href} 
      onClick={onClick}
      className="text-4xl font-black uppercase italic tracking-tighter text-white hover:text-accent transition-colors"
    >
      {children}
    </a>
  );
}

function StatBox({ label, value, sub }: { label: string, value: string, sub: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/30 mb-2">{label}</span>
      <span className="text-3xl font-black tracking-tighter text-white italic">{value}</span>
      <span className="text-[8px] font-black uppercase tracking-[0.1em] text-accent mt-2">{sub}</span>
    </div>
  );
}

function CapabilityCard({ icon, title, desc, tags }: { icon: any, title: string, desc: string, tags: string[] }) {
  return (
    <div className="group p-8 md:p-10 border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] transition-all rounded-[2.5rem] relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 text-accent/20 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">
        {icon}
      </div>
      <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mb-8 text-accent">
        {icon}
      </div>
      <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{title}</h3>
      <p className="text-sm font-bold text-foreground/40 leading-relaxed mb-6">
        {desc}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="text-[8px] font-black uppercase tracking-widest bg-white/[0.04] px-3 py-1.5 rounded-full border border-white/[0.05] text-white/50">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function FeatureBox({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="group border-l-2 border-white/[0.05] hover:border-accent pl-8 transition-colors">
      <h4 className="text-sm font-black uppercase tracking-widest mb-3 group-hover:text-amber-500 transition-colors">{title}</h4>
      <p className="text-[10px] font-medium text-foreground/40 leading-relaxed group-hover:text-white/60 transition-colors">{desc}</p>
    </div>
  );
}

function DeployProgress({ label, progress, code }: { label: string, progress: number, code: string }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
        <span>{label}</span>
        <span className="text-accent">{progress}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          whileInView={{ width: `${progress}%` }}
          viewport={{ once: false }}
          transition={{ duration: 2, ease: "circOut" }}
          className="h-full bg-accent"
        />
      </div>
      <div className="flex items-center gap-2 text-[8px] font-mono text-white/20">
        <div className="w-1 h-1 rounded-full bg-green-500" />
        <span>PROMPT: {code}</span>
      </div>
    </div>
  );
}

function SecurityTag({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 px-6 py-3 bg-white/[0.02] border border-white/[0.08] rounded-full">
      <CheckCircle2 className="w-4 h-4 text-accent" />
      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{text}</span>
    </div>
  );
}
