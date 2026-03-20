"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, CreditCard, Shield, Trash2, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
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
  nextBillingDate: string;
}

export default function AccountClient({ email, plan, planLabel, inTrial, nextBillingDate }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function handleDeleteAccount() {
    if (deleteInput !== "delete my account") {
      setError('Please type "delete my account" to confirm.');
      return;
    }
    setDeleting(true);
    // Call server-side route to delete account via service role
    const res = await fetch("/api/account/delete", { method: "DELETE" });
    if (!res.ok) {
      setError("Failed to delete account. Please contact support.");
      setDeleting(false);
      return;
    }
    await supabase.auth.signOut();
    router.push("/?deleted=1");
  }

  const isPaid = plan !== "free" && !inTrial;

  return (
    <div className="relative min-h-screen px-4 py-24 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(159,245,214,0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-xl">
        {/* Back link */}
        <motion.div {...revealProps(0)} className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white/70"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
        </motion.div>

        <motion.div {...revealProps(0.05)} className="mb-8">
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">
            Account settings
          </h1>
          <p className="mt-1.5 text-sm text-white/50">
            Manage your subscription, billing, and account.
          </p>
        </motion.div>

        {/* Profile info */}
        <motion.div {...revealProps(0.1)} className="premium-panel mb-4 rounded-[1.8rem] border border-white/10 p-6">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
            <User className="h-3.5 w-3.5" />
            Profile
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/8 font-semibold text-white/60">
              {email.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-medium text-white">{email}</div>
              <div className="mt-0.5 text-xs text-white/40">Signed in via email OTP</div>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-4 w-full rounded-xl border border-white/8 bg-white/[0.03] py-2.5 text-sm text-white/50 transition-colors hover:bg-white/[0.07] hover:text-white/80"
          >
            Sign out
          </button>
        </motion.div>

        {/* Subscription */}
        <motion.div {...revealProps(0.16)} className="premium-panel mb-4 rounded-[1.8rem] border border-white/10 p-6">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
            <CreditCard className="h-3.5 w-3.5" />
            Subscription
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-white">Current plan</div>
              <div className="mt-0.5 text-xs text-white/40">
                {isPaid
                  ? `Next billing: ${nextBillingDate}`
                  : inTrial
                    ? "Free trial active"
                    : "No active subscription"}
              </div>
            </div>
            <span className="rounded-full border border-white/12 bg-white/6 px-3 py-1 text-xs font-semibold text-white/70">
              {planLabel}
            </span>
          </div>

          <div className="space-y-2.5">
            <Link
              href="/pricing"
              className="flex w-full items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.07] hover:text-white"
            >
              Change plan
              <ArrowRight className="h-4 w-4 text-white/30" />
            </Link>

            {isPaid && (
              <button
                onClick={() => {
                  // Dodo Payments customer portal or mailto fallback
                  window.open(
                    "mailto:support@xvault.dev?subject=Cancel subscription",
                    "_blank"
                  );
                }}
                className="flex w-full items-center justify-between rounded-xl border border-red-500/15 bg-red-500/5 px-4 py-3 text-sm font-medium text-red-400/80 transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                Cancel subscription
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Danger zone */}
        <motion.div {...revealProps(0.22)} className="rounded-[1.8rem] border border-red-500/12 bg-red-500/[0.03] p-6">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-red-400/70">
            <Shield className="h-3.5 w-3.5" />
            Danger zone
          </div>

          {!deleteConfirm ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white/80">Delete account</div>
                <p className="mt-0.5 text-xs text-white/40">
                  Permanently delete your account and all data.
                </p>
              </div>
              <button
                onClick={() => setDeleteConfirm(true)}
                className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/14"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-white/60">
                This action is irreversible. Type{" "}
                <span className="font-mono text-white/80">delete my account</span> to confirm.
              </p>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => { setDeleteInput(e.target.value); setError(""); }}
                placeholder="delete my account"
                className="w-full rounded-xl border border-red-500/20 bg-white/[0.04] px-4 py-3 text-sm text-white/80 placeholder-white/20 outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/20"
              />
              {error && (
                <div className="flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {error}
                </div>
              )}
              <div className="flex gap-2.5">
                <button
                  onClick={() => { setDeleteConfirm(false); setDeleteInput(""); setError(""); }}
                  className="flex-1 rounded-xl border border-white/8 bg-white/[0.04] py-2.5 text-sm text-white/50 transition-colors hover:text-white/80"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 rounded-xl bg-red-600/80 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                >
                  {deleting ? "Deleting…" : "Delete account"}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
