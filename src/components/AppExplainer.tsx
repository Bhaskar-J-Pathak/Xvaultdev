"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// ─── Shared window chrome ──────────────────────────────────────────────────

function WindowChrome({
  title,
  badge,
}: {
  title: string;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-black/[0.055] bg-white px-4 py-2.5">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-2.5 w-2.5 rounded-full bg-white" />
        ))}
      </div>
      <span className="text-[0.66rem] font-medium tracking-wide text-stone-400">
        {title}
      </span>
      <div className="flex items-center gap-1.5">{badge}</div>
    </div>
  );
}

// ─── Mockup 1: Story Bible ─────────────────────────────────────────────────

const ENTITIES = [
  { kind: "Character", name: "Marcus Vex",   refs: "Ch 1, 3, 7–12", hue: "violet" },
  { kind: "Character", name: "Elena Voss",   refs: "Ch 3, 4, 9",    hue: "violet" },
  { kind: "Character", name: "The Oracle",   refs: "Ch 5, 11",      hue: "violet" },
  { kind: "Location",  name: "Veldris City", refs: "6 references",  hue: "amber"  },
  { kind: "Location",  name: "The Vault",    refs: "3 references",  hue: "amber"  },
  { kind: "Object",    name: "Silver Pendant", refs: "Ch 5, 8, 12", hue: "rose"   },
] as const;

const KIND_COLOR: Record<string, string> = {
  violet: "bg-violet-50 text-violet-600",
  amber:  "bg-amber-50 text-amber-600",
  rose:   "bg-rose-50 text-rose-600",
};

function StoryBibleMockup({ live }: { live: boolean }) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-black/[0.07] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.03),0_24px_64px_rgba(0,0,0,0.07)]">
      <WindowChrome
        title="Story Bible"
        badge={
          <>
            <motion.div
              animate={live ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.4 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-violet-500"
            />
            <span className="text-[0.61rem] font-semibold text-violet-600">Live</span>
          </>
        }
      />

      <div className="p-4 pb-5">
        <div className="mb-3 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-stone-400">
          Chapter 5 · 6 entities detected
        </div>

        <div className="space-y-0.5">
          {ENTITIES.map((e, i) => (
            <motion.div
              key={e.name}
              initial={{ opacity: 0, x: -12 }}
              animate={live ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.45, ease }}
              className="flex items-center justify-between rounded-lg px-2.5 py-1.5 transition-colors hover:bg-stone-50/80"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`rounded px-1.5 py-0.5 text-[0.56rem] font-semibold uppercase tracking-wide ${KIND_COLOR[e.hue]}`}
                >
                  {e.kind}
                </span>
                <span className="text-[0.795rem] font-medium text-stone-800">{e.name}</span>
              </div>
              <span className="text-[0.66rem] text-stone-400">{e.refs}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={live ? { opacity: 1 } : {}}
          transition={{ delay: 1.35, duration: 0.5 }}
          className="mt-4 flex items-center justify-between border-t border-black/[0.05] pt-3.5"
        >
          <span className="text-[0.65rem] text-stone-400">2,847 total entities indexed</span>
          <span className="text-[0.65rem] font-semibold text-violet-600 transition-opacity hover:opacity-70">
            Open full bible →
          </span>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Mockup 2: Continuity Error ────────────────────────────────────────────

function ContinuityMockup({ live }: { live: boolean }) {
  const [warn, setWarn] = useState(false);

  useEffect(() => {
    if (!live) return;
    const t = setTimeout(() => setWarn(true), 950);
    return () => clearTimeout(t);
  }, [live]);

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-black/[0.07] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.03),0_24px_64px_rgba(0,0,0,0.07)]">
      <WindowChrome
        title="Chapter 5 — Draft"
        badge={
          <>
            <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            <span className="text-[0.61rem] font-semibold text-amber-600">1 warning</span>
          </>
        }
      />

      <div className="p-5 pb-4">
        <p className="font-serif text-[0.875rem] leading-[1.95] text-stone-600">
          Marcus reached into his coat for the{" "}
          <span className="relative font-medium text-stone-900">
            silver pendant
            <motion.span
              initial={{ scaleX: 0 }}
              animate={live ? { scaleX: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.55, ease: "easeOut" }}
              style={{ originX: "left" as const }}
              className="absolute -bottom-px left-0 right-0 block h-[2px] rounded-full bg-amber-400"
            />
          </span>{" "}
          he&apos;d carried since childhood. The cold weight was a comfort against
          the chaos of Veldris.
        </p>

        <AnimatePresence>
          {warn && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.38, ease }}
              className="mt-4 rounded-xl border border-amber-200/60 bg-amber-50 p-3.5"
            >
              <p className="text-[0.71rem] font-semibold text-amber-800">
                Continuity Warning
              </p>
              <p className="mt-1 text-[0.69rem] leading-relaxed text-amber-700">
                &quot;Silver pendant&quot; has no prior mention in Chapters 1–4.
                Introducing it here may break reader immersion.
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <button className="rounded-lg bg-amber-200/60 px-2.5 py-1 text-[0.63rem] font-semibold text-amber-900 transition-colors hover:bg-amber-200">
                  Add setup in Ch. 2
                </button>
                <button className="text-[0.63rem] text-amber-600 transition-opacity hover:opacity-60">
                  Ignore
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Mockup 3: Ghost Writer ────────────────────────────────────────────────

function GhostMockup({ live }: { live: boolean }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!live) return;
    const t = setTimeout(() => setPhase(1), 650);
    return () => clearTimeout(t);
  }, [live]);

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-black/[0.07] bg-white shadow-[0_4px_6px_rgba(0,0,0,0.03),0_24px_64px_rgba(0,0,0,0.07)]">
      <WindowChrome
        title="Zen Editor"
        badge={
          <>
            <motion.div
              animate={live ? { opacity: [0.4, 1, 0.4] } : { opacity: 0.4 }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-violet-500"
            />
            <span className="text-[0.61rem] font-semibold text-violet-600">
              Ghost active
            </span>
          </>
        }
      />

      <div className="p-5 pb-4">
        <p className="font-serif text-[0.875rem] leading-[1.95] text-stone-700">
          The fog rolled in from the north, carrying with it the scent of—{" "}
          {phase === 0 && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.55, repeat: Infinity, repeatType: "reverse" }}
              className="inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-stone-700"
            />
          )}
          {phase >= 1 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease }}
              className="italic text-stone-400"
            >
              old iron and forgotten promises
            </motion.span>
          )}
        </p>

        <AnimatePresence>
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.38, ease }}
              className="mt-4 flex items-center gap-2.5 border-t border-black/[0.05] pt-3.5"
            >
              <kbd className="rounded-md border border-black/[0.09] bg-stone-100 px-2 py-0.5 font-sans text-[0.62rem] font-semibold text-stone-600">
                Tab
              </kbd>
              <span className="text-[0.66rem] text-stone-500">to accept</span>
              <kbd className="rounded-md border border-black/[0.09] bg-stone-100 px-2 py-0.5 font-sans text-[0.62rem] font-semibold text-stone-600">
                Esc
              </kbd>
              <span className="text-[0.66rem] text-stone-500">to dismiss</span>
              <span className="ml-auto text-[0.59rem] text-stone-300">
                trained on your voice
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Chapter Row ───────────────────────────────────────────────────────────

function Chapter({
  num,
  label,
  headline,
  body,
  children,
  flip = false,
}: {
  num: string;
  label: string;
  headline: React.ReactNode;
  body: string;
  children: (live: boolean) => React.ReactNode;
  flip?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <div ref={ref} className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-24">
      {/* Mockup */}
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.85, ease }}
        className={flip ? "lg:order-2" : ""}
      >
        {children(isInView)}
      </motion.div>

      {/* Copy */}
      <div className={flip ? "lg:order-1" : ""}>
        {/* Large decorative number */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-4 flex items-center gap-4"
        >
          <span className="select-none font-display text-[6rem] font-bold leading-none tracking-tight text-stone-200">
            {num}
          </span>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.65, ease }}
            style={{ originX: "left" as const }}
            className="h-px flex-1 bg-stone-200"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.12, duration: 0.75, ease }}
        >
          <div className="mb-3 text-[0.63rem] font-semibold uppercase tracking-[0.25em] text-violet-600">
            {label}
          </div>
          <h3 className="font-display text-[clamp(1.85rem,3.2vw,2.7rem)] font-bold leading-[1.05] tracking-tight text-stone-900">
            {headline}
          </h3>
          <p className="mt-5 max-w-[34ch] text-[0.9375rem] leading-[1.82] text-stone-500">
            {body}
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────

export default function AppExplainer() {
  const introRef = useRef<HTMLDivElement>(null);
  const isIntroInView = useInView(introRef, { once: true, margin: "-60px" });

  return (
    <section className="relative overflow-hidden bg-white px-6 py-24 lg:px-10 lg:py-36">
      {/* Subtle dot grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.022]"
        style={{
          backgroundImage: "radial-gradient(rgba(0,0,0,0.9) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="relative mx-auto max-w-[1380px]">

        {/* ── Intro ── */}
        <div ref={introRef} className="mb-28 lg:mb-36">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={isIntroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="mb-7 flex items-center gap-3"
          >
            <div className="h-px w-8 bg-stone-300" />
            <span className="text-[0.63rem] font-semibold uppercase tracking-[0.28em] text-stone-400">
              The Method
            </span>
          </motion.div>

          <div className="grid gap-10 lg:grid-cols-[1fr_28ch] lg:items-end">
            <motion.h2
              initial={{ opacity: 0, y: 26 }}
              animate={isIntroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.07, duration: 0.9, ease }}
              className="font-display text-[clamp(2.7rem,5.8vw,4.8rem)] font-bold leading-[1.01] tracking-[-0.043em] text-stone-900"
            >
              Most writing tools
              <br />
              forget everything.
              <br />
              <span className="gradient-text">XVault remembers it all.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={isIntroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.22, duration: 0.75, ease }}
              className="text-balance text-[0.9375rem] leading-[1.85] text-stone-500 lg:text-right"
            >
              A narrative operating system that lives alongside your draft — indexing,
              cross-referencing, and recalling every detail automatically.
            </motion.p>
          </div>
        </div>

        {/* ── Chapter 01 ── */}
        <Chapter
          num="01"
          label="Automatic Indexing"
          headline={<>Your manuscript,<br />fully indexed.</>}
          body="As you write, XVault extracts every character, location, object, and event — then builds a living knowledge graph. No manual Codex needed. No copy-pasting lore. Just write."
        >
          {(live) => <StoryBibleMockup live={live} />}
        </Chapter>

        {/* ── Divider ── */}
        <div className="my-24 h-px w-full bg-stone-200/60 lg:my-32" />

        {/* ── Chapter 02 ── */}
        <Chapter
          num="02"
          label="Continuity Intelligence"
          headline={<>Plot holes caught<br />before they&apos;re written.</>}
          body="XVault reads your entire manuscript before every session. Introduce a silver pendant in Chapter 5 without setting it up first? Flagged instantly, with context and a fix suggestion."
          flip
        >
          {(live) => <ContinuityMockup live={live} />}
        </Chapter>

        {/* ── Divider ── */}
        <div className="my-24 h-px w-full bg-stone-200/60 lg:my-32" />

        {/* ── Chapter 03 ── */}
        <Chapter
          num="03"
          label="Voice-Matched Ghostwriting"
          headline={<>Your voice,<br />accelerated.</>}
          body="Cursor-style ghost suggestions that complete your sentences — trained on your prose patterns, not a generic model. Accept with Tab. Stay in the flow. Ship the draft."
        >
          {(live) => <GhostMockup live={live} />}
        </Chapter>

      </div>
    </section>
  );
}
