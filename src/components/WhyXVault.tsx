"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Marquee ─────────────────────────────────────────────────────────────────

const ROW_1 = [
  "Story Bible",
  "Dead Branch Detection",
  "Ghost Writing",
  "Global Replace",
  "Sprint Mode",
  "Entity Graph",
  "Local-first",
  "Export PDF · DOCX · EPUB",
  "Continuity Checker",
  "Voice-Trained AI",
];

const ROW_2 = [
  "Tauri v2 + Rust",
  "Apple Silicon + Intel",
  "Windows 10+",
  "Linux AppImage",
  "300 Free AI Credits",
  "Offline by Default",
  "14-Day Full Access",
  "No Subscription Lock-in",
  "Native Desktop App",
  "Privacy by Design",
];

function Pill({ label }: { label: string }) {
  return (
    <span className="group mr-2.5 inline-flex shrink-0 cursor-default items-center gap-2 rounded-full border border-black/[0.08] bg-stone-50 px-4 py-2 text-[0.72rem] font-medium text-stone-500 transition-all duration-200 hover:scale-105 hover:border-violet-200/80 hover:bg-violet-50 hover:text-violet-700 hover:shadow-sm">
      <span className="h-1 w-1 rounded-full bg-stone-300 transition-colors duration-200 group-hover:bg-violet-400" />
      {label}
    </span>
  );
}

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-1.5">
      <motion.div
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: 26, ease: "linear", repeat: Infinity }}
        className="flex whitespace-nowrap"
      >
        {doubled.map((label, i) => (
          <Pill key={i} label={label} />
        ))}
      </motion.div>
    </div>
  );
}

// ─── Problem row ──────────────────────────────────────────────────────────────

const PROBLEMS = [
  {
    num: "01",
    problem: "I renamed a character everywhere\u2026 except the 47 places I missed.",
    solution: "Global Replace",
    detail: "Finds every instance across your entire manuscript automatically.",
    badge: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-500",
  },
  {
    num: "02",
    problem: "The AI writes suggestions that sound nothing like me.",
    solution: "Ghost Writing",
    detail: "Trained on your existing chapters. Every word in your voice and rhythm.",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
  {
    num: "03",
    problem: "I planted a mysterious key in Chapter 2. By Chapter 22, it was gone.",
    solution: "Dead Branch Detection",
    detail: "Nothing introduced in your story slips through unresolved.",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  {
    num: "04",
    problem: "I sit down to write and spend the first 25 minutes getting into the zone.",
    solution: "Sprint Mode",
    detail: "F11. Full screen. Word goal. Ambience. Deep work, instantly.",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
];

function ProblemRow({
  data,
  index,
}: {
  data: (typeof PROBLEMS)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const a = index * 0.1;           // row appear
  const s = a + 0.3;               // strike start
  const r = s + 0.55;              // resolve start

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: a, duration: 0.72, ease }}
      className="group grid items-start gap-5 border-b border-black/[0.07] py-8 lg:grid-cols-[2.5rem_1fr_260px] lg:gap-10 lg:py-10"
    >
      {/* Step number */}
      <span className="font-mono text-[0.6rem] font-bold tracking-[0.22em] text-stone-300 lg:pt-2.5">
        {data.num}
      </span>

      {/* Problem text + animated strike */}
      <div className="relative self-start">
        <motion.div
          initial={{ opacity: 0.9 }}
          animate={inView ? { opacity: [0.9, 0.7] } : {}}
          transition={{ delay: s + 0.3, duration: 0.4 }}
        >
          <p className="font-display text-[clamp(1.05rem,2vw,1.42rem)] italic leading-[1.52] tracking-[-0.015em] text-stone-700">
            &ldquo;{data.problem}&rdquo;
          </p>
        </motion.div>
        {/* Strike-through drawn left to right */}
        <motion.span
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: s, duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
          style={{ originX: "left" as const }}
          className="pointer-events-none absolute left-0 right-0 top-[50%] block h-[1.5px] -translate-y-1/2 bg-stone-400/70"
        />
      </div>

      {/* Solution — appears after strike */}
      <motion.div
        initial={{ opacity: 0, x: 14 }}
        animate={inView ? { opacity: 1, x: 0 } : {}}
        transition={{ delay: r, duration: 0.52, ease }}
        className="flex flex-col gap-2"
      >
        <span
          className={`inline-flex w-fit items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.7rem] font-semibold ${data.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${data.dot}`} />
          {data.solution}
        </span>
        <p className="text-[0.78rem] leading-[1.7] text-stone-400">{data.detail}</p>
      </motion.div>
    </motion.div>
  );
}

// ─── Product facts strip ──────────────────────────────────────────────────────

const FACTS = [
  {
    value: "Free",
    detail: "to download — no card required",
  },
  {
    value: "300",
    detail: "AI credits included with every install",
  },
  {
    value: "47\u202fMB",
    detail: "native app — Mac, Windows, Linux",
  },
  {
    value: "100%",
    detail: "local storage — your manuscript never leaves your machine",
  },
];

function FactsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div
      ref={ref}
      className="mt-16 grid grid-cols-2 gap-y-8 border-t border-black/[0.07] pt-14 sm:grid-cols-4"
    >
      {FACTS.map((fact, i) => (
        <motion.div
          key={fact.value}
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: i * 0.08, duration: 0.65, ease }}
        >
          <div className="font-display text-[clamp(1.6rem,2.8vw,2.4rem)] font-bold leading-none tracking-[-0.04em] text-stone-900">
            {fact.value}
          </div>
          <div className="mt-2.5 max-w-[18ch] text-[0.77rem] leading-[1.55] text-stone-500">
            {fact.detail}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function WhyXVault() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const hRef  = useRef<HTMLDivElement>(null);
  const hInView = useInView(hRef, { once: true, margin: "-60px" });

  // Subtle background parallax watermark
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white px-6 py-20 lg:px-10 lg:py-32">

      {/* Decorative large watermark — parallax */}
      <motion.div
        aria-hidden="true"
        style={{ y: bgY }}
        className="pointer-events-none absolute -right-12 top-1/2 -translate-y-1/2 select-none font-display text-[22vw] font-bold italic leading-none tracking-tight text-stone-100/80"
      >
        XV
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1380px]">

        {/* ── Feature marquee ── */}
        <div className="-mx-6 mb-16 overflow-hidden lg:-mx-10">
          <MarqueeRow items={ROW_1} />
          <MarqueeRow items={ROW_2} reverse />
        </div>

        {/* ── Header ── */}
        <div ref={hRef} className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={hInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="mb-6 flex items-center gap-3"
          >
            <div className="h-px w-8 bg-stone-300" />
            <span className="text-[0.63rem] font-semibold uppercase tracking-[0.28em] text-stone-400">
              The honest case
            </span>
          </motion.div>

          {/* Multi-line mask reveal */}
          {[
            { text: "Writing long-form fiction", italic: false, dim: false },
            { text: "without the right tools",   italic: false, dim: true  },
            { text: "is self-sabotage.",          italic: true,  dim: false },
          ].map(({ text, italic, dim }, i) => (
            <div key={i} className="overflow-hidden">
              <motion.h2
                initial={{ y: "108%" }}
                animate={hInView ? { y: "0%" } : {}}
                transition={{ delay: 0.06 + i * 0.1, duration: 0.88, ease }}
                className={`block font-display font-bold leading-[1.04] tracking-[-0.04em] ${italic ? "italic" : ""} ${dim ? "text-stone-400" : "text-stone-900"}`}
                style={{ fontSize: "clamp(2.4rem, 4.8vw, 4.2rem)" }}
              >
                {text}
              </motion.h2>
            </div>
          ))}

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={hInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.42, duration: 0.72, ease }}
            className="mt-5 max-w-[42ch] text-[0.9375rem] leading-[1.82] text-stone-500"
          >
            Every novelist hits these walls. We built XVault to tear them down, one problem at a time.
          </motion.p>
        </div>

        {/* ── Problem → Solution rows ── */}
        <div className="border-t border-black/[0.07]">
          {PROBLEMS.map((p, i) => (
            <ProblemRow key={p.num} data={p} index={i} />
          ))}
        </div>

        {/* ── Product facts ── */}
        <FactsStrip />

      </div>
    </section>
  );
}
