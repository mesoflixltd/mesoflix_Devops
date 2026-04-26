"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  UserPlus, 
  Code2, 
  ClipboardCheck,
  Rocket,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STEPS = [
  {
    id: "pre-instruction",
    title: "Initial Check",
    description: "Ensure you are logged out of your Deriv account in your browser before continuing.",
    icon: <AlertCircle className="w-8 h-8 text-amber-500" />,
    buttonText: "I'm Ready, Let's Start",
    action: "next"
  },
  {
    id: "create-account",
    title: "Create Your Account",
    text: "Open Deriv and register a free account. Follow the verification steps sent to your email.",
    icon: <UserPlus className="w-8 h-8 text-accent" />,
    buttonText: "Open Deriv",
    link: "https://deriv.com",
    action: "external"
  },
  {
    id: "create-app",
    title: "Create Developer App",
    text: "Go to developers.deriv.com and create a new application named 'Mesoflix Integration'.",
    icon: <Code2 className="w-8 h-8 text-accent" />,
    buttonText: "Open Developer Portal",
    link: "https://developers.deriv.com",
    action: "external"
  },
  {
    id: "copy-id",
    title: "Copy Your Client ID",
    text: "After creating your app, copy the Client ID shown in the developer portal dashboard.",
    icon: <ClipboardCheck className="w-8 h-8 text-accent" />,
    buttonText: "I Have My Client ID",
    action: "next"
  },
  {
    id: "finish-setup",
    title: "Finish Setup",
    text: "Paste your Client ID below and fill in your details to complete your project setup.",
    icon: <ShieldCheck className="w-8 h-8 text-accent" />,
    buttonText: "Complete Registration",
    action: "form"
  }
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    clientId: "",
    domainProvider: "GoDaddy",
    whatsapp: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-inter">
      {/* Header */}
      <header className="p-6 border-b border-white/[0.05] bg-[#020617]/50 backdrop-blur-xl fixed top-0 w-full z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft className="w-4 h-4 text-foreground/50 group-hover:text-accent transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">Return Home</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.2em]">Project Onboarding</span>
          </div>
          <div className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
            Step {currentStep + 1} of {STEPS.length}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 pt-32 pb-20">
        <div className="max-w-xl w-full">
          {/* Progress Bar */}
          <div className="h-1 w-full bg-white/[0.05] rounded-full mb-12 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-accent"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-8"
            >
              {/* Step Icon */}
              <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-8 shadow-2xl">
                {step.icon}
              </div>

              {/* Text */}
              <div>
                <h1 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">
                  {step.title}
                </h1>
                <p className="text-foreground/60 text-lg leading-relaxed">
                  {step.description || (step as any).text}
                </p>
              </div>

              {/* Conditional Content: Instructions or Form */}
              {step.id === "finish-setup" ? (
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField 
                      label="Full Name" 
                      placeholder="John Doe" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                    <InputField 
                      label="Email Address" 
                      placeholder="john@example.com" 
                      type="email"
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                  <InputField 
                    label="Client ID" 
                    placeholder="e.g. 335L5AL8kB7eG4uSjZlko" 
                    value={formData.clientId} 
                    onChange={(e) => setFormData({...formData, clientId: e.target.value})} 
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 px-1">Domain Provider</label>
                      <select 
                        value={formData.domainProvider}
                        onChange={(e) => setFormData({...formData, domainProvider: e.target.value})}
                        className="w-full h-14 bg-white/[0.02] border border-white/[0.08] rounded-xl px-5 text-sm font-bold focus:border-accent/50 outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option value="GoDaddy">GoDaddy</option>
                        <option value="Truehost">Truehost</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <InputField 
                      label="WhatsApp Number" 
                      placeholder="+254..." 
                      value={formData.whatsapp} 
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} 
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 pt-4 mb-2">
                    <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 accent-accent" required />
                    <span className="text-xs text-foreground/40 font-bold">I agree to the Terms & Conditions</span>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full h-16 bg-accent text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? "Processing..." : "Complete Registration"}
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="flex flex-col gap-4 pt-4">
                  {step.action === "external" ? (
                    <a 
                      href={step.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={handleNext}
                      className="w-full h-16 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 group"
                    >
                      {step.buttonText}
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  ) : (
                    <button 
                      onClick={handleNext}
                      className="w-full h-16 bg-accent text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20"
                    >
                      {step.buttonText}
                    </button>
                  )}
                  
                  {currentStep > 0 && (
                    <button 
                      onClick={handleBack}
                      className="w-full h-16 border border-white/10 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-white/[0.03] transition-all"
                    >
                      Go Back
                    </button>
                  ) || (
                    <p className="text-[10px] font-bold text-center text-foreground/30 uppercase tracking-[0.2em] mt-4">
                      Trusted by 5,000+ Algorithmic Traders
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-8 border-t border-white/[0.05] bg-white/[0.01]">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/20">
            Powered by Mesoflix Systems Group | Multi-Tier Security
          </p>
        </div>
      </footer>
    </div>
  );
}

function InputField({ label, placeholder, type = "text", value, onChange }: { label: string, placeholder: string, type?: string, value: string, onChange: (e: any) => void }) {
  return (
    <div className="space-y-2 flex-1">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 px-1">{label}</label>
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full h-14 bg-white/[0.02] border border-white/[0.08] rounded-xl px-5 text-sm font-bold placeholder:text-foreground/20 focus:border-accent/50 outline-none transition-colors"
      />
    </div>
  );
}
