"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Demo: Entity Graph ────────────────────────────────────────────────────────

const GRAPH_NODES = [
  { id: "m", x: 60,  y: 30,  label: "Marcus Vex",  color: "#7C3AED", r: 7 },
  { id: "e", x: 240, y: 30,  label: "Elena Voss",   color: "#7C3AED", r: 7 },
  { id: "v", x: 150, y: 100, label: "The Vault",    color: "#D97706", r: 6 },
  { id: "c", x: 55,  y: 155, label: "Veldris City", color: "#D97706", r: 6 },
  { id: "o", x: 260, y: 155, label: "The Oracle",   color: "#E11D48", r: 6 },
] as const;

const GRAPH_EDGES = [
  ["m", "e"], ["m", "v"], ["e", "v"], ["v", "c"], ["v", "o"],
] as const;

function EntityGraph({ live }: { live: boolean }) {
  const getN = (id: string) => GRAPH_NODES.find((n) => n.id === id)!;
  return (
    <div className="rounded-xl bg-stone-50 p-3">
      <svg viewBox="0 0 315 185" className="w-full" aria-hidden="true">
        {GRAPH_EDGES.map(([a, b], i) => {
          const na = getN(a), nb = getN(b);
          return (
            <motion.path
              key={`${a}-${b}`}
              d={`M ${na.x} ${na.y} L ${nb.x} ${nb.y}`}
              stroke="#E2E0DC"
              strokeWidth="1.5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={live ? { pathLength: 1 } : {}}
              transition={{ delay: 0.15 + i * 0.18, duration: 0.55, ease: "easeOut" }}
            />
          );
        })}
        {GRAPH_NODES.map((node, i) => (
          <g key={node.id}>
            <motion.circle
              cx={node.x} cy={node.y}
              fill="white" stroke={node.color} strokeWidth="1.5"
              initial={{ r: 0 }} animate={live ? { r: node.r } : {}}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4, type: "spring", damping: 14 }}
            />
            <motion.circle
              cx={node.x} cy={node.y} fill={node.color}
              initial={{ r: 0 }} animate={live ? { r: node.r * 0.48 } : {}}
              transition={{ delay: 0.62 + i * 0.1, duration: 0.35, type: "spring", damping: 14 }}
            />
            <motion.text
              x={node.x + (node.x > 160 ? -(node.r + 4) : node.r + 4)}
              y={node.y + 3.5}
              textAnchor={node.x > 160 ? "end" : "start"}
              fontSize={7.5} fill="#78716C"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
              initial={{ opacity: 0 }} animate={live ? { opacity: 1 } : {}}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
            >
              {node.label}
            </motion.text>
          </g>
        ))}
      </svg>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={live ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 1.5, duration: 0.4, ease }}
        className="flex items-center gap-1.5 px-1 pt-1"
      >
        <motion.div
          animate={live ? { opacity: [0.4, 1, 0.4] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-1.5 w-1.5 rounded-full bg-violet-500"
        />
        <span className="text-[0.6rem] font-semibold text-stone-500">2,847 entities indexed</span>
      </motion.div>
    </div>
  );
}

// ─── Demo: Dead Branch ─────────────────────────────────────────────────────────

function DeadBranchDemo({ live }: { live: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!live) return;
    const t = setTimeout(() => setShow(true), 1100);
    return () => clearTimeout(t);
  }, [live]);

  return (
    <div className="rounded-xl bg-stone-50 p-4">
      <p className="font-serif text-[0.82rem] leading-[1.85] text-stone-600">
        He reached for{" "}
        <span className="relative font-medium text-stone-900">
          the obsidian key
          <motion.span
            initial={{ scaleX: 0 }}
            animate={live ? { scaleX: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.55, ease: "easeOut" }}
            style={{ originX: "left" as const }}
            className="absolute -bottom-px left-0 right-0 block h-[2px] rounded-full bg-rose-400"
          />
        </span>
        {" "}&mdash; the one he&apos;d found in the ruins.
      </p>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.36, ease }}
            className="mt-3 flex items-start gap-2 rounded-lg border border-rose-200/50 bg-rose-50 px-2.5 py-2"
          >
            <span className="mt-px text-[0.65rem] text-rose-500">&#9888;</span>
            <div>
              <p className="text-[0.64rem] font-semibold text-rose-700">Dead Branch Detected</p>
              <p className="text-[0.61rem] leading-relaxed text-rose-600">
                &ldquo;Obsidian key&rdquo; introduced in Ch.&thinsp;2 &mdash; never resolved.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Demo: Ghost Writing ───────────────────────────────────────────────────────

function GhostWritingDemo({ live }: { live: boolean }) {
  const TYPED = "He stepped into the darkness, his hand outstretched \u2014 ";
  const GHOST = "fingers brushing cold stone as the vault door swung open.";
  const [chars, setChars] = useState(0);
  const [showGhost, setShowGhost] = useState(false);

  useEffect(() => {
    if (!live) { setChars(0); setShowGhost(false); return; }
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setChars(i);
      if (i >= TYPED.length) {
        clearInterval(interval);
        setTimeout(() => setShowGhost(true), 460);
      }
    }, 26);
    return () => clearInterval(interval);
  }, [live]);

  return (
    <div className="rounded-xl bg-stone-50 p-4">
      <div className="font-serif text-[0.82rem] leading-[2] text-stone-700 min-h-[3.5rem]">
        {TYPED.slice(0, chars)}
        {chars < TYPED.length && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity }}
            className="inline-block h-[13px] w-[2px] translate-y-[2px] rounded-sm bg-stone-800"
          />
        )}
        {showGhost && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-violet-400/60"
          >
            {GHOST}
          </motion.span>
        )}
      </div>
      <AnimatePresence>
        {showGhost && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="mt-3 flex items-center gap-1.5"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
            <span className="text-[0.62rem] font-medium text-stone-400">
              Ghost suggestion &middot; Tab to accept
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Demo: Global Replace ──────────────────────────────────────────────────────

const REPLACE_LINES = [
  { pre: "\u201c",      name: "Elena", post: ",\u201d he said quietly." },
  { pre: "",            name: "Elena", post: " rode toward the gate." },
  { pre: "He watched ", name: "Elena", post: " disappear into fog." },
];

function GlobalReplaceDemo({ live }: { live: boolean }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!live) return;
    const ts = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 980),
      setTimeout(() => setPhase(3), 1460),
    ];
    return () => ts.forEach(clearTimeout);
  }, [live]);

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-md bg-stone-100 px-2.5 py-1">
          <span className="text-[0.6rem] text-stone-400">Find</span>
          <span className="text-[0.7rem] font-semibold text-rose-600">Elena</span>
        </div>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-stone-300">
          <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="flex items-center gap-1.5 rounded-md bg-stone-100 px-2.5 py-1">
          <span className="text-[0.6rem] text-stone-400">Replace</span>
          <span className="text-[0.7rem] font-semibold text-emerald-600">Sarah</span>
        </div>
      </div>
      <div className="space-y-1.5">
        {REPLACE_LINES.map((line, i) => (
          <div
            key={i}
            className="flex items-baseline gap-1 rounded-lg bg-stone-50 px-3 py-2 font-serif text-[0.75rem] text-stone-600"
          >
            <span>{line.pre}</span>
            <span className="relative inline-block min-w-[2.8rem]">
              <AnimatePresence mode="wait">
                {phase <= i ? (
                  <motion.span key="old" exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}>
                    {line.name}
                  </motion.span>
                ) : (
                  <motion.span
                    key="new"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="font-medium text-emerald-600"
                  >
                    Sarah
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
            <span>{line.post}</span>
          </div>
        ))}
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-2.5 text-[0.62rem] text-stone-400"
      >
        3 of 47 replacements &mdash; done
      </motion.p>
    </div>
  );
}

// ─── Demo: Sprint Mode ─────────────────────────────────────────────────────────

function SprintDemo({ live }: { live: boolean }) {
  const [count, setCount] = useState(1203);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!live) return;
    intervalRef.current = setInterval(() => {
      setCount((c) => {
        if (c >= 1500) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 1500;
        }
        return c + 1;
      });
    }, 210);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [live]);

  const pct = Math.min(((count - 1203) / 297) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-2.5 rounded-xl bg-stone-950 px-5 py-5 text-center">
      <div className="text-[0.56rem] font-semibold uppercase tracking-[0.22em] text-stone-500">
        Sprint Mode &middot; F11
      </div>
      <motion.div
        key={count}
        initial={{ scale: 0.93, opacity: 0.7 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.08 }}
        className="font-display text-[2.4rem] font-bold tabular-nums leading-none text-white"
      >
        {count.toLocaleString()}
      </motion.div>
      <div className="text-[0.6rem] text-stone-500">words &middot; goal: 1,500</div>
      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-stone-800">
        <motion.div
          className="h-full rounded-full bg-violet-500"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.2, ease: "linear" }}
        />
      </div>
      <span className="text-[0.58rem] text-stone-600">{Math.round(pct)}% to goal</span>
    </div>
  );
}

// ─── Feature data ──────────────────────────────────────────────────────────────

const FEATURES = [
  {
    id: "knowledge-graph",
    num: "01",
    category: "Knowledge",
    title: "Story Bible & Entity Graph",
    description:
      "Every character, location, and object extracted as you write. Your story\u2019s universe organized automatically into a live knowledge graph \u2014 no spreadsheets needed.",
    demo: (live: boolean) => <EntityGraph live={live} />,
  },
  {
    id: "dead-branch",
    num: "02",
    category: "Plot Intel",
    title: "Dead Branch Detection",
    description:
      "Introduced something in Chapter 3 that never pays off? XVault flags it before it ever becomes a plot hole. No checklist required.",
    demo: (live: boolean) => <DeadBranchDemo live={live} />,
  },
  {
    id: "ghost-writing",
    num: "03",
    category: "AI Writing",
    title: "Ghost Writing",
    description:
      "AI suggestions that sound exactly like you. Trained on your existing chapters \u2014 every sentence in your voice, your rhythm, your style.",
    demo: (live: boolean) => <GhostWritingDemo live={live} />,
  },
  {
    id: "global-replace",
    num: "04",
    category: "Editing",
    title: "Global Replace",
    description:
      "Rename a character once. It propagates everywhere \u2014 preserving voice, tense, and context across your entire manuscript automatically.",
    demo: (live: boolean) => <GlobalReplaceDemo live={live} />,
  },
  {
    id: "sprint-mode",
    num: "05",
    category: "Focus",
    title: "Sprint Mode",
    description:
      "Full-screen writing with a live word goal, countdown timer, and ambience player. Hit F11 to enter the zone and stay there.",
    demo: (live: boolean) => <SprintDemo live={live} />,
  },
];

// ─── Feature row ───────────────────────────────────────────────────────────────

function FeatureRow({
  num,
  category,
  title,
  description,
  isActive,
  onHover,
  delay,
  inView,
}: {
  num: string;
  category: string;
  title: string;
  description: string;
  isActive: boolean;
  onHover: () => void;
  delay: number;
  inView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.65, ease }}
      className="group relative cursor-default border-b border-black/[0.07]"
      onMouseEnter={onHover}
    >
      {/* Fill BG — wipes from left on hover */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-stone-950"
        initial={false}
        animate={{ scaleX: isActive ? 1 : 0, opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ originX: "left" as const }}
      />

      {/* Row content */}
      <div className="relative z-10 flex items-center gap-4 py-5 lg:py-6">
        {/* Number */}
        <span
          className={`w-8 shrink-0 font-mono text-[0.6rem] font-bold tracking-[0.2em] transition-colors duration-300 ${
            isActive ? "text-stone-500" : "text-stone-300"
          }`}
        >
          {num}
        </span>

        {/* Title */}
        <h3
          className={`flex-1 font-display font-bold tracking-[-0.028em] transition-colors duration-300`}
          style={{ fontSize: "clamp(1.15rem,2.1vw,1.75rem)" }}
        >
          <span className={isActive ? "text-white" : "text-stone-900"}>{title}</span>
        </h3>

        {/* Category */}
        <span
          className={`hidden shrink-0 text-[0.67rem] font-medium uppercase tracking-[0.18em] transition-colors duration-300 sm:block ${
            isActive ? "text-stone-500" : "text-stone-400"
          }`}
        >
          {category}
        </span>

        {/* Arrow */}
        <motion.svg
          width="16" height="16" viewBox="0 0 16 16" fill="none"
          className={`shrink-0 transition-colors duration-300 ${
            isActive ? "text-white/50" : "text-stone-300"
          }`}
          animate={{ x: isActive ? 4 : 0 }}
          transition={{ duration: 0.3, ease }}
        >
          <path
            d="M2 8h12M9 3l5 5-5 5"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          />
        </motion.svg>
      </div>

      {/* Description — mobile only (always visible) */}
      <p
        className={`relative z-10 pb-4 text-[0.875rem] leading-[1.78] lg:hidden ${
          isActive ? "text-stone-400" : "text-stone-500"
        }`}
      >
        {description}
      </p>
    </motion.div>
  );
}

// ─── Spotlight demo panel ─────────────────────────────────────────────────────

function DemoPanel({
  features,
  activeRow,
}: {
  features: typeof FEATURES;
  activeRow: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const opacity = useMotionValue(0);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = panelRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
      opacity.set(1);
    },
    [mouseX, mouseY, opacity]
  );

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]: number[]) =>
      `radial-gradient(300px circle at ${x}px ${y}px, rgba(124,58,237,0.07), transparent 70%)`
  );

  return (
    <div
      ref={panelRef}
      onMouseMove={onMouseMove}
      onMouseLeave={() => opacity.set(0)}
      className="relative hidden shrink-0 lg:block lg:w-[340px] xl:w-[400px]"
    >
      {/* Spotlight glow overlay */}
      <motion.div
        aria-hidden="true"
        style={{ background, opacity }}
        transition={{ opacity: { duration: 0.3 } }}
        className="pointer-events-none absolute inset-0 z-0 rounded-[1.25rem]"
      />

      <div className="sticky top-28">
        <AnimatePresence mode="wait">
          {features.map((feat, i) =>
            activeRow === i ? (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease }}
                className="relative z-10"
              >
                <p className="mb-5 text-[0.875rem] leading-[1.8] text-stone-500">
                  {feat.description}
                </p>
                <div className="overflow-hidden rounded-[1.25rem] border border-black/[0.07] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,0,0,0.06)]">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-violet-600">
                      {feat.category}
                    </span>
                    <span className="font-mono text-[0.58rem] text-stone-400">{feat.num}</span>
                  </div>
                  {feat.demo(true)}
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────

export default function Features() {
  const [activeRow, setActiveRow] = useState(0);

  const hRef   = useRef<HTMLDivElement>(null);
  const hInView = useInView(hRef,   { once: true, margin: "-60px" });
  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyInView = useInView(bodyRef, { once: true, margin: "-60px" });

  return (
    <section id="features" className="bg-white px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1380px]">

        {/* Header */}
        <div ref={hRef} className="mb-14 grid gap-6 lg:grid-cols-[1fr_28ch] lg:items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={hInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55 }}
              className="mb-5 flex items-center gap-3"
            >
              <div className="h-px w-8 bg-stone-300" />
              <span className="text-[0.63rem] font-semibold uppercase tracking-[0.28em] text-stone-400">
                Full Arsenal
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
                The tools serious
              </motion.h2>
            </div>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "100%" }}
                animate={hInView ? { y: "0%" } : {}}
                transition={{ delay: 0.12, duration: 0.85, ease }}
                className="font-display font-bold leading-[1.03] tracking-[-0.04em] text-stone-400"
                style={{ fontSize: "clamp(2.4rem,4.8vw,4.2rem)" }}
              >
                novelists reach for.
              </motion.h2>
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={hInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.28, duration: 0.72, ease }}
            className="text-balance text-[0.9375rem] leading-[1.82] text-stone-500 lg:text-right"
          >
            No GPT wrapper. No prompt box. Real tools built for long-form fiction.
          </motion.p>
        </div>

        {/* ── Index + sticky demo ── */}
        <div ref={bodyRef} className="flex flex-col gap-0 lg:flex-row lg:items-start lg:gap-16 xl:gap-24">

          {/* Left: feature index rows */}
          <div className="min-w-0 flex-1 border-t border-black/[0.07]">
            {FEATURES.map((feat, i) => (
              <FeatureRow
                key={feat.id}
                num={feat.num}
                category={feat.category}
                title={feat.title}
                description={feat.description}
                isActive={activeRow === i}
                onHover={() => setActiveRow(i)}
                delay={i * 0.07}
                inView={bodyInView}
              />
            ))}
          </div>

          {/* Right: sticky demo panel (desktop only) */}
          <DemoPanel features={FEATURES} activeRow={activeRow} />

        </div>

      </div>
    </section>
  );
}
