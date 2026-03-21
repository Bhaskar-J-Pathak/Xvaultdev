"use client";

import { motion } from "framer-motion";
import { ArrowRight, Download, LayoutDashboard, Settings, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { createClient, TRIAL_CREDITS } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { Profile } from "@/lib/supabase";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

function revealProps(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.6, ease },
  };
}

interface Props {
  email: string;
  plan: Profile["plan"];
  planLabel: string;
  inTrial: boolean;
  used: number;
  limit: number;
  progressPct: number;
  trialDaysLeft: number;
  resetDaysLeft: number;
  planBadgeColor: string;
}

export default function DashboardClient({
  email,
  plan,
  planLabel,
  inTrial,
  used,
  limit,
  progressPct,
  trialDaysLeft,
  resetDaysLeft,
  planBadgeColor,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const barColor =
    progressPct > 85 ? "bg-red-500" : progressPct > 60 ? "bg-amber-400" : "bg-[#7C3AED]";

  return (
    <div className="relative min-h-screen bg-[#FAFAF8] px-4 py-24 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-2xl">
        {/* Header */}
        <motion.div {...revealProps(0)} className="mb-10">
          <div className="flex items-start justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-[#1A1A1A]/40">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-[#1A1A1A]">
                Welcome back
              </h1>
              <p className="mt-1 text-sm text-[#1A1A1A]/50">{email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-xl border border-black/8 bg-black/[0.04] px-4 py-2 text-sm text-[#1A1A1A]/50 transition-colors hover:bg-black/[0.07] hover:text-[#1A1A1A]/80"
            >
              Sign out
            </button>
          </div>
        </motion.div>

        {/* Plan card */}
        <motion.div {...revealProps(0.08)} className="mb-4 rounded-[1.8rem] border border-black/8 bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#7C3AED]/15 bg-[#7C3AED]/8">
                <Sparkles className="h-5 w-5 text-[#7C3AED]" strokeWidth={1.6} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-[#1A1A1A]/40">
                  Current plan
                </div>
                <div className="mt-0.5 font-display text-lg font-bold tracking-tight text-[#1A1A1A]">
                  {planLabel}
                </div>
              </div>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold tracking-wide ${planBadgeColor}`}>
              {planLabel}
            </span>
          </div>
        </motion.div>

        {/* Usage card */}
        <motion.div {...revealProps(0.14)} className="mb-4 rounded-[1.8rem] border border-black/8 bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#1A1A1A]/40" strokeWidth={1.6} />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1A1A1A]/40">
              AI credits
            </span>
          </div>

          <div className="mb-2 flex items-end justify-between">
            <div className="font-display text-2xl font-bold tracking-tight text-[#1A1A1A]">
              {used.toLocaleString()}
              <span className="ml-1 text-base font-normal text-[#1A1A1A]/40">
                / {limit.toLocaleString()}
              </span>
            </div>
            <span className="text-xs text-[#1A1A1A]/40">{progressPct}% used</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ delay: 0.4, duration: 0.8, ease }}
              className={`h-full rounded-full ${barColor}`}
            />
          </div>

          <p className="mt-3 text-xs text-[#1A1A1A]/36">
            {inTrial ? (
              <>
                Trial credits — {TRIAL_CREDITS - used} remaining.
                {trialDaysLeft > 0
                  ? ` Trial ends in ${trialDaysLeft} day${trialDaysLeft !== 1 ? "s" : ""}.`
                  : " Your trial has ended."}
              </>
            ) : (
              <>Monthly allowance resets in {resetDaysLeft} day{resetDaysLeft !== 1 ? "s" : ""}.</>
            )}
          </p>
        </motion.div>

        {/* Action cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          <motion.div {...revealProps(0.2)}>
            <Link
              href="/pricing"
              className="flex h-full flex-col rounded-[1.6rem] border border-black/8 bg-white p-5 shadow-[0_2px_4px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-[#7C3AED]/20 hover:shadow-[0_4px_12px_rgba(124,58,237,0.08)]"
            >
              <div className="flex h-full flex-col">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-[#7C3AED]/15 bg-[#7C3AED]/8">
                  <ArrowRight className="h-4 w-4 text-[#7C3AED]" strokeWidth={1.6} />
                </div>
                <div className="font-semibold tracking-tight text-[#1A1A1A]">
                  {plan === "free" ? "Upgrade plan" : "Manage subscription"}
                </div>
                <p className="mt-1.5 text-sm text-[#1A1A1A]/50">
                  {plan === "free"
                    ? "Unlock more AI credits and advanced features."
                    : "Change plan, view billing, or cancel."}
                </p>
                <div className="mt-auto pt-4 text-xs font-semibold text-[#7C3AED]/70">
                  {plan === "free" ? "View plans →" : "Manage →"}
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div {...revealProps(0.25)}>
            <Link
              href="/account"
              className="flex h-full flex-col rounded-[1.6rem] border border-black/8 bg-white p-5 shadow-[0_2px_4px_rgba(0,0,0,0.04)] transition-all duration-300 hover:border-black/14 hover:shadow-[0_4px_12px_rgba(0,0,0,0.07)]"
            >
              <div className="flex h-full flex-col">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.04]">
                  <Settings className="h-4 w-4 text-[#1A1A1A]/55" strokeWidth={1.6} />
                </div>
                <div className="font-semibold tracking-tight text-[#1A1A1A]">
                  Account settings
                </div>
                <p className="mt-1.5 text-sm text-[#1A1A1A]/50">
                  Billing details, plan changes, and account deletion.
                </p>
                <div className="mt-auto pt-4 text-xs font-semibold text-[#1A1A1A]/30">
                  Manage account →
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Download strip */}
        <motion.div {...revealProps(0.32)} className="mt-4">
          <div className="rounded-[1.8rem] border border-black/8 bg-white p-6 shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.04]">
                  <Download className="h-4 w-4 text-[#1A1A1A]/55" strokeWidth={1.6} />
                </div>
                <div>
                  <div className="font-semibold tracking-tight text-[#1A1A1A]">
                    Download XVault Studio
                  </div>
                  <p className="mt-0.5 text-sm text-[#1A1A1A]/50">Windows · macOS · Linux</p>
                </div>
              </div>
              <Link
                href="/#download"
                className="rounded-xl border border-black/8 bg-black/[0.04] px-4 py-2.5 text-sm font-semibold text-[#1A1A1A]/70 transition-colors hover:bg-black/[0.07]"
              >
                Download
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
