"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Step = "email" | "otp" | "success";

export default function AuthPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const supabase = createClient();

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });
    if (err) {
      setError(err.message);
    } else {
      setStep("otp");
    }
    setLoading(false);
  }

  function handleOtpInput(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(""));
      otpRefs.current[5]?.focus();
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    const token = otp.join("");
    if (token.length < 6) return;
    setLoading(true);
    setError("");
    const { data, error: err } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    if (data.session) {
      const { access_token, refresh_token } = data.session;
      const deepLink = `xvault://auth?access_token=${access_token}&refresh_token=${refresh_token}`;
      // Attempt to open the Tauri app
      window.location.href = deepLink;
    }
    // Show success state whether or not the app opened
    setTimeout(() => {
      setStep("success");
      setLoading(false);
    }, 800);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-24">
      {/* Background orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(159,245,214,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/3 h-64 w-64 rounded-full opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mb-10 flex justify-center"
        >
          <Link href="/" className="flex items-center gap-3 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/8 text-xs font-semibold tracking-[0.24em] text-white/70">
              XV
            </span>
            <span className="font-display text-xl tracking-tight">
              XVault<span className="ml-1 text-white/44">Studio</span>
            </span>
          </Link>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ── Step 1: Email ── */}
          {step === "email" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease }}
            >
              <div className="premium-panel animated-border rounded-[2rem] border border-white/10 p-8">
                <div className="mb-7 text-center">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-white">
                    Sign in to XVault
                  </h1>
                  <p className="mt-2.5 text-sm leading-6 text-white/55">
                    No password needed. No credit card.
                  </p>
                </div>

                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#9ff5d6]/15 bg-[#9ff5d6]/6 px-4 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#9ff5d6]/12">
                    <span className="text-base">✦</span>
                  </span>
                  <p className="text-sm font-medium text-[#9ff5d6]/90">
                    Start with 300 free AI credits
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/44"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/28 outline-none ring-0 transition-all focus:border-[#9ff5d6]/30 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#9ff5d6]/20"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-semibold tracking-[0.02em] text-black transition-all disabled:opacity-50 hover:not-disabled:-translate-y-0.5"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Send code
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-6 text-center text-xs text-white/32">
                  By continuing you agree to our{" "}
                  <Link href="/terms" className="text-white/52 underline-offset-2 hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-white/52 underline-offset-2 hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: OTP ── */}
          {step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease }}
            >
              <div className="premium-panel animated-border rounded-[2rem] border border-white/10 p-8">
                <div className="mb-7 text-center">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-white">
                    Check your email
                  </h1>
                  <p className="mt-2.5 text-sm leading-6 text-white/55">
                    We sent a 6-digit code to{" "}
                    <span className="font-medium text-white/80">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <label className="mb-4 block text-center text-xs font-semibold uppercase tracking-[0.16em] text-white/44">
                      Enter code
                    </label>
                    <div
                      className="flex justify-center gap-2.5"
                      onPaste={handleOtpPaste}
                    >
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => { otpRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpInput(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className="h-14 w-12 rounded-xl border border-white/10 bg-white/[0.05] text-center text-xl font-bold text-white outline-none transition-all focus:border-[#9ff5d6]/40 focus:bg-white/[0.08] focus:ring-1 focus:ring-[#9ff5d6]/25"
                        />
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-sm text-red-400">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || otp.join("").length < 6}
                    className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-semibold tracking-[0.02em] text-black transition-all disabled:opacity-50 hover:not-disabled:-translate-y-0.5"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        Sign in
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => { setStep("email"); setError(""); setOtp(["","","","","",""]); }}
                      className="text-sm text-white/40 transition-colors hover:text-white/70"
                    >
                      Use a different email
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {/* ── Step 3: Success ── */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease }}
            >
              <div className="premium-panel animated-border rounded-[2rem] border border-white/10 p-8 text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#9ff5d6]/20 bg-[#9ff5d6]/8">
                  <CheckCircle2 className="h-8 w-8 text-[#9ff5d6]" />
                </div>
                <h1 className="font-display text-2xl font-bold tracking-tight text-white">
                  You&apos;re signed in
                </h1>
                <p className="mt-3 text-sm leading-6 text-white/55">
                  XVault Studio is opening on your computer. If nothing happened,
                  open the app manually or download it below.
                </p>

                <div className="mt-7 space-y-3">
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] py-3.5 text-sm font-semibold text-white/80 transition-colors hover:bg-white/[0.09]"
                  >
                    View dashboard
                  </Link>
                  <Link
                    href="/#download"
                    className="block text-center text-sm text-white/36 transition-colors hover:text-white/60"
                  >
                    Download the app
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
