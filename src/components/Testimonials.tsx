"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const HERO_WORDS = ["\u201cXVault", "found", "it", "instantly.\u201d"];

const STATS = [
  { value: "50K+", label: "Writers using XVault" },
  { value: "4.9\u2605", label: "App Store rating" },
  { value: "98%",  label: "Say AI sounds like them" },
  { value: "300",  label: "Free AI credits to start" },
];

const QUOTES = [
  {
    text: "Like having a script editor living inside my document. Every planted clue \u2014 tracked automatically so I never lose the thread.",
    author: "Alex Kim",
    role: "Fantasy Author \u00b7 The Shattered Crowns",
  },
  {
    text: "Three years. Six novels. One world. XVault is the only reason my worldbuilding hasn\u2019t completely collapsed under its own weight.",
    author: "Marcus Webb",
    role: "Epic Fantasy \u00b7 The Ashfall Chronicles",
  },
  {
    text: "The first time it finished my sentence, I genuinely couldn\u2019t tell who wrote it. That\u2019s never happened with any other AI tool.",
    author: "Priya Nair",
    role: "Romance Saga Author \u00b7 6-book series",
  },
];

export default function Testimonials() {
  const heroRef  = useRef<HTMLDivElement>(null);
  const heroInView  = useInView(heroRef,  { once: true, margin: "-80px" });
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-60px" });
  const quotesRef = useRef<HTMLDivElement>(null);
  const quotesInView = useInView(quotesRef, { once: true, margin: "-60px" });

  return (
    <section className="bg-[#FAFAF8] px-6 py-28 lg:px-10 lg:py-44">
      <div className="mx-auto max-w-[1380px]">

        {/* ── Label + hero pull quote ── */}
        <div ref={heroRef}>
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="mb-10 flex items-center gap-3"
          >
            <div className="h-px w-8 bg-stone-300" />
            <span className="text-[0.63rem] font-semibold uppercase tracking-[0.28em] text-stone-400">
              Proof
            </span>
          </motion.div>

          {/* Hero quote — word-by-word mask reveal */}
          <h2 className="mb-7 font-display text-[clamp(3rem,6.5vw,6rem)] font-bold italic leading-[1.0] tracking-[-0.045em] text-stone-900">
            {HERO_WORDS.map((word, i) => (
              <span key={i} className="mr-[0.22em] inline-block overflow-hidden last:mr-0">
                <motion.span
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={heroInView ? { y: "0%" } : {}}
                  transition={{ delay: 0.08 + i * 0.08, duration: 0.78, ease }}
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.54, duration: 0.6, ease }}
            className="text-[0.82rem] text-stone-500"
          >
            Sarah Chen&nbsp;&nbsp;&middot;&nbsp;&nbsp;Author&nbsp;&nbsp;&middot;&nbsp;&nbsp;
            <span className="text-stone-400">The Meridian Cycle &middot; 4 books &middot; 180k copies sold</span>
          </motion.p>
        </div>

        {/* ── Stats row ── */}
        <div
          ref={statsRef}
          className="mt-20 grid grid-cols-2 gap-y-12 border-t border-black/[0.07] pt-16 sm:grid-cols-4"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 14 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.09, duration: 0.7, ease }}
            >
              <div className="font-display text-[clamp(1.8rem,3vw,2.8rem)] font-bold leading-none tracking-tight text-stone-900">
                {s.value}
              </div>
              <div className="mt-2 text-[0.77rem] text-stone-500">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Editorial quotes — 3 columns, no card borders ── */}
        <div
          ref={quotesRef}
          className="mt-20 border-t border-black/[0.07] lg:grid lg:grid-cols-3"
        >
          {QUOTES.map((q, i) => (
            <motion.div
              key={q.author}
              initial={{ opacity: 0, y: 18 }}
              animate={quotesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.72, ease }}
              className={`py-12 ${
                i < QUOTES.length - 1
                  ? "border-b border-black/[0.07] lg:border-b-0 lg:border-r"
                  : ""
              } ${i > 0 ? "lg:pl-10" : ""} ${i < QUOTES.length - 1 ? "lg:pr-10" : ""}`}
            >
              <p className="mb-7 font-display text-[1.05rem] italic leading-[1.8] tracking-[-0.01em] text-stone-700">
                &ldquo;{q.text}&rdquo;
              </p>
              <div>
                <div className="text-[0.8rem] font-semibold text-stone-900">{q.author}</div>
                <div className="mt-1 text-[0.72rem] text-stone-400">{q.role}</div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
