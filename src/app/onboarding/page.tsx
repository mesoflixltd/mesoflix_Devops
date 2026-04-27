"use client";

import { useState, Suspense, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, 
  ArrowLeft, 
  ExternalLink, 
  CheckCircle2, 
  UserPlus,
  Code2, 
  Rocket,
  ShieldCheck,
  AlertCircle,
  Globe,
  LogOut,
  UserCheck,
  ClipboardPaste
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AFFILIATE_LINK = "/api/redirect/deriv";

const STEPS = [
  {
    id: "logout",
    title: "Prepare Your Account Setup",
    description: "Before continuing, log out of your Deriv account in this browser. This ensures your new account is created correctly.",
    icon: <LogOut className="w-8 h-8 text-amber-500" />,
    buttonText: "Continue",
  },
  {
    id: "create-account",
    title: "Create Your Trading Account",
    description: "Click the button below to create your account. Complete registration, then return here to continue.",
    icon: <Globe className="w-8 h-8 text-accent" />,
    buttonText: "Create Your Deriv Account",
  },
  {
    id: "confirmation",
    title: "Account Created?",
    description: "Once you have successfully created your account, proceed to the next step to setup your system.",
    icon: <UserCheck className="w-8 h-8 text-accent" />,
    buttonText: "Continue Setup",
  },
  {
    id: "create-app",
    title: "Create Your Developer App",
    description: "Open the developer portal and create a new application to get your unique Client ID.",
    icon: <Code2 className="w-8 h-8 text-accent" />,
    buttonText: "Open Developer Portal",
  },
  {
    id: "client-id",
    title: "Enter Your Client ID",
    description: "Paste the Client ID from your developer app below to link your account.",
    icon: <ClipboardPaste className="w-8 h-8 text-accent" />,
    buttonText: "Next",
  },
  {
    id: "registration",
    title: "Complete Your Setup",
    description: "Finalize your project details to initialize your enterprise dashboard.",
    icon: <Rocket className="w-8 h-8 text-accent" />,
    buttonText: "Complete Setup",
  }
];

function OnboardingContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    clientId: "",
    domainName: "",
    domainProvider: "GoDaddy",
    apiConfig: "New API", // New API, Legacy API, Both
    whatsapp: "",
    acceptedTerms: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const router = useRouter();

  // Load from local storage on mount
  useEffect(() => {
    const savedStep = localStorage.getItem("mesoflixOnboardingStep");
    const savedData = localStorage.getItem("mesoflixOnboardingData");
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
    }
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (currentStep > 0) localStorage.setItem("mesoflixOnboardingStep", currentStep.toString());
    localStorage.setItem("mesoflixOnboardingData", JSON.stringify(formData));
  }, [currentStep, formData]);

  const handleNext = async () => {
    if (STEPS[currentStep].id === "create-account") {
      window.open(AFFILIATE_LINK, "_blank");
      setCurrentStep(prev => prev + 1);
      return;
    }

    if (STEPS[currentStep].id === "create-app") {
      window.open("https://developers.deriv.com", "_blank");
      setCurrentStep(prev => prev + 1);
      return;
    }

    if (STEPS[currentStep].id === "client-id") {
      if (!formData.clientId) {
        alert("Please paste your Client ID first.");
        return;
      }
      setCurrentStep(prev => prev + 1);
      return;
    }

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
    if (!formData.name || !formData.email || !formData.whatsapp || !formData.domainName || !formData.clientId) {
      alert("Please fill in all registration fields, including your Client ID.");
      return;
    }
    if (!formData.acceptedTerms) {
      alert("Please accept the Terms & Conditions to proceed.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setSubmitSuccess(true);
      } else {
        const errorData = await res.json().catch(() => null);
        console.error("API Rejected:", errorData);
        alert("The server lacked the proper environment variables or rejected the request. Check your terminal logs.");
      }
    } catch (err) {
      console.error("Network crash:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center font-inter p-6 space-y-6">
        <div className="w-16 h-16 rounded-[1.5rem] bg-accent/10 border border-accent/20 flex items-center justify-center shadow-[0_0_60px_rgba(255,68,79,0.4)]">
          <CheckCircle2 className="w-8 h-8 text-accent animate-pulse" />
        </div>
        <div className="text-center space-y-4 max-w-lg">
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter italic">Infrastructure Initialized</h1>
          <p className="text-foreground/60 text-sm sm:text-base font-bold leading-relaxed pt-2">
            The database profile for <span className="text-accent">{formData.domainName || "your domain"}</span> has been fully locked in.
            <br/><br/>
            Because we utilize a Zero-Trust architecture, we have dispatched a highly-secure <span className="text-accent uppercase tracking-widest">Puzzle Key Token</span> directly to your email. 
          </p>
          <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-center justify-center gap-3 mt-6">
            <Globe className="w-4 h-4 text-foreground/40" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-foreground/40 text-left">Check Spam/Junk if missing</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-inter selection:bg-accent/30 text-xs sm:text-sm">
      {/* Header */}
      <header className="p-6 border-b border-white/[0.05] bg-[#020617]/50 backdrop-blur-xl fixed top-0 w-full z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <ArrowLeft className="w-4 h-4 text-foreground/50 group-hover:text-accent transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50">Return Home</span>
          </Link>
          <div className="flex items-center gap-3 text-accent font-black uppercase tracking-[0.2em] text-[10px] sm:text-xs italic">
            Mesoflix Setup Funnel
          </div>
          <div className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest hidden sm:block">
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
              <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-8 shadow-2xl transition-all hover:scale-105 hover:bg-white/[0.05]">
                {step.icon}
              </div>

              <div>
                <h1 className="text-3xl sm:text-5xl font-black mb-4 tracking-tight uppercase leading-[0.9]">
                  {step.title}
                </h1>
                <p className="text-foreground/60 text-base sm:text-lg leading-relaxed font-bold">
                  {step.description}
                </p>
              </div>

              {/* Conditional Step Content */}
              {step.id === "client-id" ? (
                <div className="space-y-4 pt-4">
                  <InputField 
                    label="Paste Your Client ID" 
                    placeholder="Found in your developer app dashboard" 
                    value={formData.clientId} 
                    onChange={(e) => setFormData({...formData, clientId: e.target.value})} 
                  />
                  <p className="text-[10px] text-accent font-black uppercase tracking-widest">
                    Tip: You'll find this after creating your app in the developer portal.
                  </p>
                  <button 
                    onClick={handleNext}
                    className="w-full h-16 bg-accent text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 mt-4"
                  >
                    Continue
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ) : step.id === "create-account" ? (
                <div className="flex flex-col gap-4 pt-4">
                  <button 
                    onClick={() => router.push(`/campaign?auth_token=req_v2_${Math.random().toString(36).substring(7)}`)}
                    className="w-full h-16 bg-accent text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 group"
                  >
                    Create the new V2 account for your developer portal
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={handleNext}
                    className="w-full h-14 border border-white/10 text-white/50 rounded-[1rem] font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-white/[0.05] hover:text-white transition-all"
                  >
                    I have already created my V2 Account
                  </button>
                </div>
              ) : step.id === "create-app" ? (
                <div className="space-y-6 pt-4">
                  <div className="p-6 bg-white/[0.01] border border-white/[0.05] rounded-[2rem] space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Guided Setup:</p>
                    <ul className="text-xs sm:text-sm font-bold text-foreground/60 space-y-4">
                      <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-accent shrink-0" /> Open developer portal</li>
                      <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-accent shrink-0" /> Click "Create App"</li>
                      <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-accent shrink-0" /> Application Name: "Mesoflix Systems"</li>
                      <li className="flex items-start gap-3"><CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-1" /> Set Redirect URL to your intended Domain (e.g. https://yourdomain.com)</li>
                      <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-accent shrink-0" /> Submit and Copy your Client ID</li>
                    </ul>
                  </div>
                  <button 
                    onClick={handleNext}
                    className="w-full h-16 bg-accent text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 mt-4 group"
                  >
                    Open Developer Portal
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ) : step.id === "registration" ? (
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField 
                      label="Full Name" 
                      placeholder="e.g. John Doe" 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})} 
                    />
                    <InputField 
                      label="Email Address" 
                      placeholder="e.g. john@example.com" 
                      type="email"
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField 
                      label="Domain Name" 
                      placeholder="e.g. mysite.com" 
                      value={formData.domainName} 
                      onChange={(e) => setFormData({...formData, domainName: e.target.value})} 
                    />
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 px-1 italic">Domain Provider</label>
                      <select 
                        value={formData.domainProvider}
                        onChange={(e) => setFormData({...formData, domainProvider: e.target.value})}
                        className="w-full h-14 bg-white/[0.02] border border-white/[0.08] rounded-xl px-5 text-sm font-bold focus:border-accent/50 outline-none transition-colors appearance-none cursor-pointer"
                      >
                        <option value="GoDaddy" className="bg-[#020617] text-white">GoDaddy</option>
                        <option value="Truehost" className="bg-[#020617] text-white">Truehost</option>
                        <option value="Namecheap" className="bg-[#020617] text-white">Namecheap</option>
                        <option value="Other" className="bg-[#020617] text-white">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField 
                      label="WhatsApp Number" 
                      placeholder="+123..." 
                      value={formData.whatsapp} 
                      onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} 
                    />
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 px-1 italic">API Configuration</label>
                      <select 
                        value={formData.apiConfig}
                        onChange={(e) => setFormData({...formData, apiConfig: e.target.value})}
                        className={`w-full h-14 bg-white/[0.02] border border-white/[0.08] rounded-xl px-5 text-sm font-bold focus:border-accent/50 outline-none transition-colors appearance-none cursor-pointer ${formData.apiConfig === "Both APIs" ? "text-amber-400" : "text-white"}`}
                      >
                        <option value="New API" className="bg-[#020617] text-white">New API Site Only (Included)</option>
                        <option value="Legacy API" className="bg-[#020617] text-white">Legacy Site Only (Included)</option>
                        <option value="Both APIs" className="bg-[#020617] text-amber-400 font-black">Both APIs (+ $2,000 / month)</option>
                      </select>
                    </div>
                  </div>

                  {formData.apiConfig === "Both APIs" && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500/80 text-xs font-bold flex gap-3 items-center">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      Please note: Subscribing to "Both APIs" incurs an extra $2,000 monthly fee until the legacy API is officially removed.
                    </motion.div>
                  )}

                  <div className="flex items-center gap-4 p-4 bg-white/[0.01] rounded-xl border border-white/[0.05] mt-4">
                    {/* Modern Custom Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, acceptedTerms: !formData.acceptedTerms})}
                      className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none shrink-0 ${formData.acceptedTerms ? 'bg-accent' : 'bg-white/10'}`}
                    >
                      <span className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${formData.acceptedTerms ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                    <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
                      I agree to the <Link href="/terms" target="_blank" className="text-accent underline hover:text-white transition-colors">Terms of Service</Link> & <Link href="/privacy" target="_blank" className="text-accent underline hover:text-white transition-colors">Privacy Policy</Link>
                    </span>
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full h-16 bg-accent text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 mt-4"
                  >
                    {isSubmitting ? "Initializing Dashboard..." : "Complete Setup"}
                    <Rocket className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={handleNext}
                    className="w-full h-16 bg-accent text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-accent/20 flex items-center justify-center gap-3 group"
                  >
                    {step.buttonText}
                    {step.id === "create-account" && <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              )}

              {currentStep > 0 && (
                <button 
                  onClick={handleBack}
                  className="w-full h-14 border border-white/10 text-white/20 hover:text-white rounded-xl font-black uppercase text-[10px] tracking-[0.3em] transition-all mt-4"
                >
                  Go Back
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <footer className="p-8 border-t border-white/[0.05] bg-white/[0.01] text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/10 italic">
          Mesoflix Systems Institutional Flow | Secure Identity Linked
        </p>
      </footer>
    </div>
  );
}

export default function Onboarding() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#020617] flex items-center justify-center font-inter">
        <Rocket className="w-6 h-6 text-accent animate-pulse" />
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}

function InputField({ label, placeholder, type = "text", value, onChange }: { label: string, placeholder: string, type?: string, value: string, onChange: (e: any) => void }) {
  return (
    <div className="space-y-2 flex-1">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 px-1 italic">{label}</label>
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full h-14 bg-white/[0.02] border border-white/[0.08] rounded-xl px-5 text-sm font-bold placeholder:text-foreground/10 focus:border-accent/50 outline-none transition-colors"
      />
    </div>
  );
}
