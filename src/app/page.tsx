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
  Menu,
  X,
  Mail,
  MessageSquare,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1611974717414-0e365851493b?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc48?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1581291417006-03d45110014c?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1487014679447-9f8336841d58?auto=format&fit=crop&q=80&w=2000",
];

const AVATARS = [
  "https://i.pravatar.cc/150?u=1",
  "https://i.pravatar.cc/150?u=2",
  "https://i.pravatar.cc/150?u=3",
  "https://i.pravatar.cc/150?u=4",
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
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
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                  <X className="w-6 h-6 text-accent" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
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
            <Link href="/onboarding" onClick={() => setIsMenuOpen(false)} className="h-16 flex items-center justify-center rounded-2xl bg-accent text-white font-black uppercase text-xs tracking-widest">
              Client Portal
            </Link>
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, type: "spring", bounce: 0.7 }} className="mt-auto bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] flex flex-col items-center gap-4 text-center">
              <Activity className="w-10 h-10 text-accent" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Ready to automate everything?</p>
              <Link href="/onboarding" className="text-accent font-black text-xs uppercase tracking-widest underline decoration-2 underline-offset-4">Get Started</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section with Enhanced Slider */}
      <section className="relative min-h-screen flex items-center pt-32 overflow-hidden bg-black">
        {/* Background Slider - Gapless implementation */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={currentImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <img src={HERO_IMAGES[currentImage]} alt="Infrastructure" className="w-full h-full object-cover grayscale-[20%] transition-transform duration-[6s] scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/30 to-[#020617]/60" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full py-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="max-w-4xl">
            <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black mb-10 leading-[0.85] tracking-tighter uppercase italic drop-shadow-2xl">
              Institutional <br />
              <span className="text-accent">Deriv Site</span> <br />
              Ecosystems
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <Link href="/onboarding" className="w-full sm:w-auto h-16 sm:h-20 flex items-center justify-center px-8 sm:px-12 rounded-2xl bg-accent text-white font-black hover:scale-[1.05] active:scale-[0.98] transition-all shadow-2xl shadow-accent/30 gap-4 group text-xs sm:text-sm uppercase tracking-widest text-center">
                Start Your Project Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/[0.05]">
                <div className="flex -space-x-4">
                  {AVATARS.map((src, i) => (
                    <img key={i} src={src} alt="User" className="w-10 h-10 rounded-full border-2 border-accent object-cover bg-zinc-800" />
                  ))}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase tracking-widest text-accent">99+ Clients</span>
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Active Infrastructures</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Slider Indicator */}
        <div className="absolute bottom-10 left-6 z-10 flex gap-1 items-end h-4 max-w-[90vw] overflow-x-auto scrollbar-hide">
          {HERO_IMAGES.map((_, i) => (
            <div key={i} className={`h-1 transition-all duration-500 rounded-full shrink-0 ${i === currentImage ? "w-8 bg-accent" : "w-2 bg-white/20"}`} />
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

      {/* Expertise Section */}
      <section id="expertise" className="py-32 px-6 bg-[#020617] relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight uppercase leading-[0.9] mb-24">
            Institutional <br /><span className="text-foreground/40 italic">Engineering</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CapabilityCard icon={<Cpu />} title="Bot Systems" desc="Proprietary trading logic integration with millisecond execution stability." tags={["XML/JS", "High Frequency"]} />
            <CapabilityCard icon={<Lock />} title="Architecture" desc="Deep Deriv API token isolation with no master password storage." tags={["OAuth 2.0", "SSL Optimized"]} />
            <CapabilityCard icon={<Globe />} title="Corporate Web" desc="High-performance landing pages with integrated client areas." tags={["Next.js", "Edge Optimized"]} />
          </div>
        </div>
      </section>

      {/* Footer / CTA with Full Navigation */}
      <footer className="bg-[#050a1f] border-t border-white/[0.05] pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 mb-32">
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-accent" />
              <span className="text-2xl font-black uppercase tracking-tighter italic">Mesoflix Systems</span>
            </Link>
            <p className="text-sm font-bold text-foreground/40 leading-relaxed max-w-xs">
              Architectural excellence for the Deriv brokerage ecosystem, providing high-speed automation and secure web infrastructure.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Mail />} />
              <SocialIcon icon={<MessageSquare />} />
              <SocialIcon icon={<ShieldAlert />} />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Navigation</h4>
            <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-foreground/50">
              <li><a href="#expertise" className="hover:text-white transition-colors underline decoration-transparent hover:decoration-accent decoration-2 underline-offset-4">Expertise</a></li>
              <li><a href="#ecosystem" className="hover:text-white transition-colors underline decoration-transparent hover:decoration-accent decoration-2 underline-offset-4">Ecosystem</a></li>
              <li><a href="#security" className="hover:text-white transition-colors underline decoration-transparent hover:decoration-accent decoration-2 underline-offset-4">Security</a></li>
              <li><Link href="/onboarding" className="hover:text-white transition-colors underline decoration-transparent hover:decoration-accent decoration-2 underline-offset-4 text-accent">Get Started</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Legal & Trust</h4>
            <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-foreground/50">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/security-policy" className="hover:text-white transition-colors">Security Ethics</Link></li>
              <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4 p-8 bg-white/[0.02] border border-white/[0.05] rounded-[2.5rem] flex flex-col justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-8 italic">Ready to deploy your professional Deriv portal?</p>
            <Link href="/onboarding" className="h-16 flex items-center justify-center px-8 rounded-2xl bg-accent text-white font-black hover:scale-105 transition-all text-xs uppercase tracking-widest shadow-xl shadow-accent/20">
              Start Project Hub
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center pt-12 border-t border-white/5 gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-foreground/10 italic">
          <p>© 2026 Mesoflix Systems Group | Global Infrastructure</p>
          <div className="flex gap-8">
            <span>Server: US-EAST-1</span>
            <span>Handshake: Secure</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string, children: React.ReactNode, onClick: () => void }) {
  return (
    <a href={href} onClick={onClick} className="text-4xl font-black uppercase italic tracking-tighter text-white hover:text-accent transition-colors">
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
    <div className="p-8 border border-white/[0.05] bg-white/[0.01] rounded-[2rem] relative overflow-hidden">
      <div className="w-12 h-12 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mb-8 text-accent">
        {icon}
      </div>
      <h3 className="text-2xl font-black uppercase tracking-tight mb-4">{title}</h3>
      <p className="text-sm font-bold text-foreground/40 leading-relaxed mb-6">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => (
          <span key={tag} className="text-[8px] font-black uppercase tracking-widest bg-white/[0.04] px-3 py-1.5 rounded-full border border-white/[0.05] text-white/30">{tag}</span>
        ))}
      </div>
    </div>
  );
}

function SocialIcon({ icon }: { icon: any }) {
  return (
    <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-foreground/30 hover:text-accent hover:border-accent/40 transition-all cursor-pointer">
      {icon}
    </div>
  );
}
