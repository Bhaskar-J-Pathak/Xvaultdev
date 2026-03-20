"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Crown } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface Tier {
  id: "free" | "pro" | "pro_plus" | "ultra";
  name: string;
  price: string;
  period: string;
  tagline: string;
  credits: string;
  aiPower: string;
  dot: string;
  features: string[];
  cta: string;
  popular?: boolean;
  envKey?: "NEXT_PUBLIC_DODO_LINK_PRO" | "NEXT_PUBLIC_DODO_LINK_PRO_PLUS" | "NEXT_PUBLIC_DODO_LINK_ULTRA";
}

const tiers: Tier[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    tagline: "Start writing with AI. No card required.",
    credits: "300 trial credits, then 50/mo",
    aiPower: "Fast AI",
    dot: "bg-stone-300",
    features: [
      "Zen editor + world graph",
      "300 trial AI credits",
      "50 AI credits / month after trial",
      "Ghost Write during trial",
      "Community support",
    ],
    cta: "Download free",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$20",
    period: "/month",
    tagline: "For writers ready to write every day.",
    credits: "500 AI credits / month",
    aiPower: "Powerful AI",
    dot: "bg-blue-400",
    features: [
      "Everything in Free",
      "500 AI credits / month",
      "Ghost Write — always on",
      "Continuity checker",
      "Email support",
    ],
    cta: "Get Pro",
    envKey: "NEXT_PUBLIC_DODO_LINK_PRO",
  },
  {
    id: "pro_plus",
    name: "Pro+",
    price: "$60",
    period: "/month",
    tagline: "For serious novelists and daily drafters.",
    credits: "2,000 AI credits / month",
    aiPower: "Advanced AI",
    dot: "bg-violet-500",
    features: [
      "Everything in Pro",
      "2,000 AI credits / month",
      "Advanced AI model",
      "Priority response queue",
      "Priority support",
    ],
    cta: "Get Pro+",
    popular: true,
    envKey: "NEXT_PUBLIC_DODO_LINK_PRO_PLUS",
  },
  {
    id: "ultra",
    name: "Ultra",
    price: "$200",
    period: "/month",
    tagline: "For power users and professional authors.",
    credits: "10,000 AI credits / month",
    aiPower: "Best-in-class AI",
    dot: "bg-amber-400",
    features: [
      "Everything in Pro+",
      "10,000 AI credits / month",
      "Best-in-class AI model",
      "Dedicated support channel",
      "Early access to new features",
    ],
    cta: "Get Ultra",
    envKey: "NEXT_PUBLIC_DODO_LINK_ULTRA",
  },
];

function buildCheckoutUrl(envKey: string, user: User | null): string | null {
  const base =
    envKey === "NEXT_PUBLIC_DODO_LINK_PRO"
      ? process.env.NEXT_PUBLIC_DODO_LINK_PRO
      : envKey === "NEXT_PUBLIC_DODO_LINK_PRO_PLUS"
        ? process.env.NEXT_PUBLIC_DODO_LINK_PRO_PLUS
        : process.env.NEXT_PUBLIC_DODO_LINK_ULTRA;

  if (!base) return null;
  if (!user) return null;
  const url = new URL(base);
  url.searchParams.set("email", user.email ?? "");
  url.searchParams.set("metadata_userId", user.id);
  return url.toString();
}

export default function PricingPage() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-4 pb-28 pt-28 sm:px-6">

      {/* Subtle top fade from hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/[0.07] to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-[1200px]">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mb-16 max-w-2xl"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-8 bg-stone-300" />
            <span className="text-[0.63rem] font-semibold uppercase tracking-[0.28em] text-stone-400">
              Pricing
            </span>
          </div>

          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "108%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.08, duration: 0.88, ease }}
              className="font-display font-bold leading-[1.03] tracking-[-0.04em] text-stone-900"
              style={{ fontSize: "clamp(2.6rem, 5vw, 4.4rem)" }}
            >
              Write more.
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: "108%" }}
              animate={{ y: "0%" }}
              transition={{ delay: 0.15, duration: 0.88, ease }}
              className="font-display font-bold italic leading-[1.03] tracking-[-0.04em] text-stone-400"
              style={{ fontSize: "clamp(2.6rem, 5vw, 4.4rem)" }}
            >
              Pay less.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.72, ease }}
            className="mt-5 text-[0.9375rem] leading-[1.82] text-stone-500"
          >
            Start free with 300 AI credits. Upgrade when your writing demands more.
            Cancel any time — no questions asked.
          </motion.p>
        </motion.div>

        {/* ── Tier grid ── */}
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-4">
          {tiers.map((tier, i) => {
            const isPopular = tier.popular;

            let ctaHref: string;
            let ctaExternal = false;

            if (tier.id === "free") {
              ctaHref = "/#download";
            } else if (!user) {
              ctaHref = `/auth?next=/pricing`;
            } else if (tier.envKey) {
              const url = buildCheckoutUrl(tier.envKey, user);
              ctaHref = url ?? "/auth";
              ctaExternal = !!url;
            } else {
              ctaHref = "/auth";
            }

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.09, duration: 0.65, ease }}
                className={`group relative flex flex-col rounded-2xl border p-6 transition-all duration-300 ${
                  isPopular
                    ? "border-violet-200 bg-violet-50/60 shadow-[0_0_0_1px_theme(colors.violet.200),0_8px_40px_-8px_rgba(124,58,237,0.12)]"
                    : "border-stone-200/80 bg-white hover:border-stone-300 hover:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)]"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3.5 left-6">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-white px-3 py-1 text-[0.68rem] font-semibold text-violet-700 shadow-sm">
                      <Crown className="h-2.5 w-2.5" />
                      Most popular
                    </span>
                  </div>
                )}

                {/* Tier header */}
                <div className="mb-6 pt-1">
                  <div className="mb-1 text-[0.6rem] font-bold uppercase tracking-[0.24em] text-stone-400">
                    {tier.name}
                  </div>
                  <div
                    className="font-display font-bold tracking-tight text-stone-900"
                    style={{ fontSize: "clamp(1.8rem, 2.8vw, 2.2rem)", lineHeight: 1 }}
                  >
                    {tier.price}
                    <span className="ml-1.5 text-sm font-normal text-stone-400">
                      {tier.period}
                    </span>
                  </div>
                  <p className="mt-2.5 text-[0.8rem] leading-[1.6] text-stone-500">
                    {tier.tagline}
                  </p>
                </div>

                {/* AI power badge */}
                <div
                  className={`mb-5 flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 ${
                    isPopular
                      ? "border-violet-200/60 bg-violet-50"
                      : "border-stone-100 bg-stone-50/80"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${tier.dot}`} />
                  <span className="text-[0.72rem] font-medium text-stone-600">{tier.aiPower}</span>
                  <span className="ml-auto text-[0.65rem] text-stone-400">{tier.credits}</span>
                </div>

                {/* Features */}
                <ul className="mb-8 flex-1 space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[0.8rem] leading-[1.55] text-stone-600">
                      <Check
                        className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${isPopular ? "text-violet-500" : "text-stone-400"}`}
                        strokeWidth={2.5}
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {ctaExternal ? (
                  <a
                    href={ctaHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 rounded-xl py-3 text-[0.8rem] font-semibold tracking-[0.01em] transition-all duration-300 ${
                      isPopular
                        ? "bg-stone-950 text-white hover:-translate-y-0.5 hover:bg-stone-800"
                        : "border border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50"
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <Link
                    href={ctaHref}
                    className={`flex items-center justify-center gap-2 rounded-xl py-3 text-[0.8rem] font-semibold tracking-[0.01em] transition-all duration-300 ${
                      isPopular
                        ? "bg-stone-950 text-white hover:-translate-y-0.5 hover:bg-stone-800"
                        : "border border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50"
                    }`}
                  >
                    {tier.cta}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* ── Trust note ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.07] pt-8"
        >
          <p className="text-[0.75rem] text-stone-400">
            Prices in USD. Billed monthly. Cancel any time from your{" "}
            <Link href="/account" className="text-stone-600 underline-offset-2 hover:underline">
              account settings
            </Link>
            .
          </p>
          <div className="flex items-center gap-5">
            {["No lock-in", "Instant access", "Secure checkout"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-[0.72rem] text-stone-400">
                <span className="h-1 w-1 rounded-full bg-stone-300" />
                {t}
              </span>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
