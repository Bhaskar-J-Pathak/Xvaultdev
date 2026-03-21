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
    if (!data.session) {
      setError("Verification succeeded but no session was returned. Please try again.");
      setLoading(false);
      return;
    }
    const { access_token, refresh_token } = data.session;
    const deepLink = `xvault://auth?access_token=${encodeURIComponent(access_token)}&refresh_token=${encodeURIComponent(refresh_token)}`;
    window.location.href = deepLink;
    setTimeout(() => {
      setStep("success");
      setLoading(false);
    }, 800);
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAFAF8] px-4 py-24">
      {/* Background gradient orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-1/4 h-80 w-80 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%)",
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
          <Link href="/" className="flex items-center gap-3 text-[#1A1A1A]">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-[#1A1A1A] text-xs font-semibold tracking-[0.24em] text-white">
              XV
            </span>
            <span className="font-display text-xl tracking-tight text-[#1A1A1A]">
              XVault<span className="ml-1 text-[#1A1A1A]/44">Studio</span>
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
              <div className="animated-border rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_4px_6px_rgba(0,0,0,0.04),0_20px_60px_rgba(0,0,0,0.07)]">
                <div className="mb-7 text-center">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-[#1A1A1A]">
                    Sign in to XVault
                  </h1>
                  <p className="mt-2.5 text-sm leading-6 text-[#1A1A1A]/55">
                    No password needed. No credit card.
                  </p>
                </div>

                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-[#7C3AED]/12 bg-[#7C3AED]/5 px-4 py-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#7C3AED]/10">
                    <span className="text-base text-[#7C3AED]">✦</span>
                  </span>
                  <p className="text-sm font-medium text-[#7C3AED]">
                    Start with 300 free AI credits
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#1A1A1A]/44"
                    >
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1A1A1A]/30" />
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-black/10 bg-black/[0.03] py-3.5 pl-11 pr-4 text-sm text-[#1A1A1A] placeholder-[#1A1A1A]/28 outline-none transition-all focus:border-[#7C3AED]/40 focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/12"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-50 px-4 py-3 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] py-3.5 text-sm font-semibold tracking-[0.02em] text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
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

                <p className="mt-6 text-center text-xs text-[#1A1A1A]/32">
                  By continuing you agree to our{" "}
                  <Link href="/terms" className="text-[#1A1A1A]/52 underline-offset-2 hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#1A1A1A]/52 underline-offset-2 hover:underline">
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
              <div className="animated-border rounded-[2rem] border border-black/8 bg-white p-8 shadow-[0_4px_6px_rgba(0,0,0,0.04),0_20px_60px_rgba(0,0,0,0.07)]">
                <div className="mb-7 text-center">
                  <h1 className="font-display text-2xl font-bold tracking-tight text-[#1A1A1A]">
                    Check your email
                  </h1>
                  <p className="mt-2.5 text-sm leading-6 text-[#1A1A1A]/55">
                    We sent a 6-digit code to{" "}
                    <span className="font-medium text-[#1A1A1A]/80">{email}</span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <div>
                    <label className="mb-4 block text-center text-xs font-semibold uppercase tracking-[0.16em] text-[#1A1A1A]/44">
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
                          className="h-14 w-12 rounded-xl border border-black/10 bg-black/[0.03] text-center text-xl font-bold text-[#1A1A1A] outline-none transition-all focus:border-[#7C3AED]/50 focus:bg-white focus:ring-2 focus:ring-[#7C3AED]/15"
                        />
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-50 px-4 py-3 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || otp.join("").length < 6}
                    className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] py-3.5 text-sm font-semibold tracking-[0.02em] text-white transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
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
                      className="text-sm text-[#1A1A1A]/40 transition-colors hover:text-[#1A1A1A]/70"
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
              <div className="animated-border rounded-[2rem] border border-black/8 bg-white p-8 text-center shadow-[0_4px_6px_rgba(0,0,0,0.04),0_20px_60px_rgba(0,0,0,0.07)]">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/8">
                  <CheckCircle2 className="h-8 w-8 text-[#7C3AED]" />
                </div>
                <h1 className="font-display text-2xl font-bold tracking-tight text-[#1A1A1A]">
                  You&apos;re signed in
                </h1>
                <p className="mt-3 text-sm leading-6 text-[#1A1A1A]/55">
                  XVault Studio is opening on your computer. If nothing happened,
                  open the app manually or download it below.
                </p>

                <div className="mt-7 space-y-3">
                  <Link
                    href="/dashboard"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-black/8 bg-black/[0.03] py-3.5 text-sm font-semibold text-[#1A1A1A]/80 transition-colors hover:bg-black/[0.06]"
                  >
                    View dashboard
                  </Link>
                  <Link
                    href="/#download"
                    className="block text-center text-sm text-[#1A1A1A]/36 transition-colors hover:text-[#1A1A1A]/60"
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
