"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError(searchParams.get("error_description") || "Authentication failed");
        return;
      }

      const storedState = sessionStorage.getItem("oauth_state");
      if (state !== storedState) {
        setError("Invalid state (CSRF Protection). Please try again.");
        return;
      }

      const codeVerifier = sessionStorage.getItem("pkce_code_verifier");
      if (!code || !codeVerifier) {
        setError("Missing authentication code or verifier.");
        return;
      }

      try {
        const res = await fetch("/api/auth/deriv/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            codeVerifier,
            clientId: "336vWZldUrkjFRLJ2Aws8"
          })
        });

        const data = await res.json();

        if (res.ok) {
          localStorage.setItem("deriv_access_token", data.access_token);
          router.push("/onboarding?auth=success");
        } else {
          setError(data.error || "Token exchange failed");
        }
      } catch (err) {
        console.error(err);
        setError("An unexpected error occurred during token exchange.");
      }
    }

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full p-8 border border-white/[0.05] bg-white/[0.01] rounded-3xl"
      >
        {error ? (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-black">Authentication Error</h1>
            <p className="text-foreground/60 text-sm">{error}</p>
            <button 
              onClick={() => router.push("/onboarding")}
              className="w-full h-14 bg-white text-black rounded-xl font-black uppercase text-xs tracking-widest"
            >
              Back to Onboarding
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <Loader2 className="w-12 h-12 text-accent animate-spin mx-auto" />
            <h1 className="text-2xl font-black">Finalizing Authorization</h1>
            <p className="text-foreground/60 text-sm">Linking your Deriv account to your Mesoflix workspace...</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function DerivCallback() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-accent animate-spin" />
    </div>}>
      <CallbackContent />
    </Suspense>
  );
}
