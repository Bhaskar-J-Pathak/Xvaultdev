"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const STEPS = [
  {
    num: "01",
    color:      "#7C3AED",
    textColor:  "text-violet-600",
    bgColor:    "bg-violet-50",
    borderColor:"border-violet-200/70",
    label:      "Setup",
    title:      "Download in 30 seconds",
    body:       "A 47\u202fMB native app. Mac, Windows, Linux. No cloud setup, no account required — open it and start writing.",
    detail:     "Available now \u00b7 Free \u00b7 No card needed",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 3v10M7 9l4 4 4-4M4 16h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "02",
    color:      "#E11D48",
    textColor:  "text-rose-600",
    bgColor:    "bg-rose-50",
    borderColor:"border-rose-200/70",
    label:      "Import",
    title:      "Bring your world",
    body:       "Import existing chapters or start fresh. XVault extracts entities immediately and builds your knowledge graph as you type.",
    detail:     "Accepts .txt \u00b7 .docx \u00b7 .md",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M4 7h14M4 11h10M4 15h7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        <path d="M17 13l3 2-3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "03",
    color:      "#D97706",
    textColor:  "text-amber-600",
    bgColor:    "bg-amber-50",
    borderColor:"border-amber-200/70",
    label:      "Write",
    title:      "Write. Let it help.",
    body:       "Real-time ghost suggestions, continuity alerts, and a story bible that updates as you write. Stay in the flow \u2014 always.",
    detail:     "AI trained on your voice",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M4 17L8 6l4 8 3-5 3 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    num: "04",
    color:      "#059669",
    textColor:  "text-emerald-600",
    bgColor:    "bg-emerald-50",
    borderColor:"border-emerald-200/70",
    label:      "Export",
    title:      "Ship your draft",
    body:       "Export clean PDF, DOCX, or EPUB with one click. Your manuscript, publisher-ready, exactly as you wrote it.",
    detail:     "PDF \u00b7 DOCX \u00b7 EPUB",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <path d="M11 14V4M7 8l4-4 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 16v2h14v-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
];

function Step({
  step,
  index,
  inView,
}: {
  step: typeof STEPS[number];
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.08 + index * 0.18, duration: 0.75, ease }}
      className="relative grid grid-cols-[1fr_auto] items-start gap-8 border-t border-black/[0.07] py-14 lg:py-20"
    >
      {/* Watermark number — decorative, positioned behind */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-8 select-none font-display font-bold leading-none tracking-tight text-stone-100"
        style={{ fontSize: "clamp(5rem, 14vw, 11rem)" }}
      >
        {step.num}
      </span>

      {/* Content */}
      <div className="relative z-10 max-w-lg">
        <div className={`mb-4 font-mono text-[0.6rem] font-bold uppercase tracking-[0.24em] ${step.textColor}`}>
          {step.num}&nbsp;&nbsp;&middot;&nbsp;&nbsp;{step.label}
        </div>
        <h3
          className="mb-4 font-display font-bold leading-[1.08] tracking-[-0.035em] text-stone-900"
          style={{ fontSize: "clamp(1.6rem,3vw,2.6rem)" }}
        >
          {step.title}
        </h3>
        <p className="text-[0.9375rem] leading-[1.85] text-stone-500">{step.body}</p>
        <div className="mt-6 text-[0.7rem] font-medium text-stone-400">{step.detail}</div>
      </div>

      {/* Icon circle */}
      <div
        className={`relative z-10 mt-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${step.borderColor} ${step.bgColor} ${step.textColor}`}
      >
        {step.icon}
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const hRef   = useRef<HTMLDivElement>(null);
  const hInView = useInView(hRef,   { once: true, margin: "-60px" });
  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyInView = useInView(bodyRef, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="relative bg-white px-6 py-24 lg:px-10 lg:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/[0.07] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-black/[0.07] to-transparent" />

      <div className="mx-auto max-w-[1380px]">

        {/* Header */}
        <div ref={hRef} className="mb-4 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={hInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="mb-6 flex items-center gap-3"
          >
            <div className="h-px w-8 bg-stone-300" />
            <span className="text-[0.63rem] font-semibold uppercase tracking-[0.28em] text-stone-400">
              Getting Started
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              animate={hInView ? { y: "0%" } : {}}
              transition={{ delay: 0.06, duration: 0.85, ease }}
              className="font-display font-bold leading-[1.03] tracking-[-0.04em] text-stone-900"
              style={{ fontSize: "clamp(2.4rem,4.8vw,4.2rem)" }}
            >
              From blank page
            </motion.h2>
          </div>
          <div className="overflow-hidden">
            <motion.h2
              initial={{ y: "100%" }}
              animate={hInView ? { y: "0%" } : {}}
              transition={{ delay: 0.13, duration: 0.85, ease }}
              className="font-display font-bold leading-[1.03] tracking-[-0.04em] text-stone-400"
              style={{ fontSize: "clamp(2.4rem,4.8vw,4.2rem)" }}
            >
              to finished draft.
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={hInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.75, ease }}
            className="mt-5 text-[0.9375rem] leading-[1.82] text-stone-500"
          >
            No configuration. No tutorials. Open the app, paste in your chapters, and write.
          </motion.p>
        </div>

        {/* Steps */}
        <div ref={bodyRef}>
          {STEPS.map((step, i) => (
            <Step key={step.num} step={step} index={i} inView={bodyInView} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={bodyInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.0, duration: 0.65, ease }}
          className="mt-4 flex justify-start"
        >
          <a
            href="/#download"
            className="btn-shimmer inline-flex items-center gap-2.5 rounded-full bg-stone-950 px-7 py-3.5 text-[0.875rem] font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
          >
            Download free
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 2v8M3 7l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>

      </div>
    </section>
  );
}
