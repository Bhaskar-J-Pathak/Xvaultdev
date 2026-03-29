"use client";

import { useState } from "react";

/* ─── password ─────────────────────────────── */
const DECK_PASSWORD = "xvault2026";

/* ─── palette ──────────────────────────────── */
const V   = "#7C3AED";
const VL  = "#A78BFA";
const W   = "#FAFAF8";
const M   = "#78716C";
const C1  = "#141210";
const AM  = "#D97706";
const BG  = "#0D0B0A";

const sans = "var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif";

/* ─── shared slide wrapper ─────────────────── */
function Slide({ n, children, glow = "left" }: {
  n: number;
  children: React.ReactNode;
  glow?: "left" | "right" | "center" | "none";
}) {
  const glowPos = { left: "0% 50%", right: "100% 50%", center: "50% 50%", none: "50% 50%" };
  return (
    <section
      className="slide"
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        background: BG,
        overflow: "hidden",
        fontFamily: sans,
        pageBreakAfter: "always",
        breakAfter: "page",
      }}
    >
      {glow !== "none" && (
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse 55% 70% at ${glowPos[glow]}, #1A0D3D 0%, ${BG} 60%)`,
          pointerEvents: "none",
        }} />
      )}
      {/* left accent strip */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 5, height: "100%", background: V }} />
      {/* slide number */}
      <span style={{ position: "absolute", bottom: "3.5%", right: "3%", color: "#3C3530", fontSize: "min(1.2vw, 13px)", fontWeight: 600, fontFamily: sans }}>
        {String(n).padStart(2, "0")} / 18
      </span>
      <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 6.5%" }}>
        {children}
      </div>
    </section>
  );
}

function Label({ text, color = VL }: { text: string; color?: string }) {
  return (
    <div style={{ display: "inline-flex", background: "#1A0D3D", borderRadius: 8, padding: "5px 14px", marginBottom: "2.5%" }}>
      <span style={{ color, fontSize: "min(1.1vw, 12px)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const }}>{text}</span>
    </div>
  );
}

function H({ children, size = 72 }: { children: React.ReactNode; size?: number }) {
  return (
    <h2 style={{ color: W, fontSize: `min(${size * 0.055}vw, ${size}px)`, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, margin: "0 0 2.5%", fontFamily: sans }}>
      {children}
    </h2>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return <p style={{ color: M, fontSize: "min(2vw, 20px)", lineHeight: 1.75, margin: 0, fontFamily: sans }}>{children}</p>;
}

function GreenBadge({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#0F2A0F", border: "1px solid #1A4D1A", borderRadius: 10, padding: "12px 18px", display: "inline-block", marginTop: "3%" }}>
      <span style={{ color: "#4ADE80", fontSize: "min(1.3vw, 14px)", fontWeight: 700 }}>{children}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 01 — COVER
═══════════════════════════════════════════ */
function S01() {
  return (
    <Slide n={1} glow="right">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "4%" }}>
        <div style={{ width: 24, height: 2, background: V }} />
        <span style={{ color: V, fontSize: "min(1.2vw, 13px)", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const }}>Pre-Seed Round — 2026</span>
      </div>

      <h1 style={{ color: W, fontSize: "min(9vw, 104px)", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.045em", margin: 0, fontFamily: sans }}>
        XVault Studio
      </h1>
      <p style={{ color: VL, fontSize: "min(3.8vw, 44px)", fontWeight: 600, letterSpacing: "-0.02em", margin: "1.5% 0 0" }}>
        The AI Story OS for Novelists &amp; Screenwriters
      </p>

      <div style={{ display: "flex", gap: 32, marginTop: "6%" }}>
        {[["TAM", "$4.2B"], ["SAM", "$1.05B"], ["MRR Target (Y3)", "$1M+"]].map(([label, val]) => (
          <div key={label} style={{ borderLeft: `3px solid ${V}`, paddingLeft: 20 }}>
            <div style={{ color: M, fontSize: "min(1.1vw, 12px)", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.2em" }}>{label}</div>
            <div style={{ color: W, fontSize: "min(2.8vw, 32px)", fontWeight: 700, marginTop: 6 }}>{val}</div>
          </div>
        ))}
      </div>

      <p style={{ color: M, fontSize: "min(1.8vw, 18px)", marginTop: "6%", letterSpacing: "0.05em" }}>xvault.dev</p>
    </Slide>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 02 — PROBLEM
═══════════════════════════════════════════ */
function S02() {
  const problems = [
    {
      n: "01",
      title: "No continuity safety net",
      body: "A 100K-word novel has hundreds of characters, timelines, and plot threads. One contradiction in chapter 3 can break the story by chapter 22. No tool catches this automatically.",
    },
    {
      n: "02",
      title: "The medium gap",
      body: "A finished novel is worth far more as a screenplay, webtoon, or game — but adapting it requires a completely different skill set. Most writers can't do it. Hiring costs thousands.",
    },
    {
      n: "03",
      title: "AI tools are amnesiac",
      body: "ChatGPT, Claude, Jasper — they generate text but don't understand your story's world: who the characters are, what happened in chapter 5, what threads are unresolved.",
    },
  ];

  return (
    <Slide n={2} glow="left">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "3%" }}>
        <div style={{ width: 24, height: 2, background: V }} />
        <span style={{ color: V, fontSize: "min(1.2vw, 13px)", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const }}>The Problem</span>
      </div>
      <H size={68}>Writers have no<br />intelligent infrastructure.</H>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5%", marginTop: "3%" }}>
        {problems.map((p) => (
          <div key={p.n} style={{ background: C1, borderRadius: 14, padding: "5% 6%", borderTop: `3px solid ${V}` }}>
            <div style={{ color: V, fontSize: "min(1.1vw, 11px)", fontWeight: 700, letterSpacing: "0.24em", marginBottom: "5%" }}>{p.n}</div>
            <div style={{ color: W, fontSize: "min(2.2vw, 22px)", fontWeight: 700, lineHeight: 1.3, marginBottom: "4%" }}>{p.title}</div>
            <div style={{ color: M, fontSize: "min(1.7vw, 16px)", lineHeight: 1.7 }}>{p.body}</div>
          </div>
        ))}
      </div>
    </Slide>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 03 — SOLUTION
═══════════════════════════════════════════ */
function S03() {
  const pillars = [
    { icon: "◈", title: "World Graph", desc: "Extracts characters, locations, events and maps relationships in real time. The memory layer your AI needs." },
    { icon: "✦", title: "Co-Author AI", desc: "Full manuscript context. Makes changes anywhere, suggests plot moves, catches contradictions as you write." },
    { icon: "⇌", title: "Adaptation Engine", desc: "Novel → screenplay → webtoon → game narrative in one click. No equivalent exists anywhere." },
  ];

  return (
    <Slide n={3} glow="right">
      <div style={{ display: "flex", height: "100%", alignItems: "center", gap: "7%" }}>
        <div style={{ flex: "0 0 46%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "4%" }}>
            <div style={{ width: 24, height: 2, background: V }} />
            <span style={{ color: V, fontSize: "min(1.2vw, 13px)", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const }}>The Solution</span>
          </div>
          <h2 style={{ color: W, fontSize: "min(6.5vw, 74px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, margin: "0 0 4%" }}>
            A writing IDE<br />that <span style={{ color: VL }}>knows<br />your story.</span>
          </h2>
          <Body>XVault builds a living knowledge graph of your story as you write — and uses it to power an AI that actually understands your world.</Body>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2.5%" }}>
          {pillars.map((p) => (
            <div key={p.title} style={{ background: C1, borderRadius: 14, padding: "4.5% 5%", display: "flex", gap: "4%", alignItems: "flex-start" }}>
              <div style={{ color: V, fontSize: "min(2.5vw, 26px)", lineHeight: 1, flexShrink: 0 }}>{p.icon}</div>
              <div>
                <div style={{ color: W, fontSize: "min(2vw, 21px)", fontWeight: 700, marginBottom: 8 }}>{p.title}</div>
                <div style={{ color: M, fontSize: "min(1.6vw, 16px)", lineHeight: 1.65 }}>{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 04 — JUST SHIPPED
═══════════════════════════════════════════ */
function S04_Shipped() {
  const shipped = [
    { label: "Zen editor", sub: "Lexical-based, distraction-free, full manuscript" },
    { label: "Live World Graph", sub: "Auto-extracts entities & relations as you type" },
    { label: "Co-Author AI", sub: "Full context, ghost write, voice-matched suggestions" },
    { label: "Dead Branch Detection", sub: "Real-time plot hole & continuity alerts" },
    { label: "Global Entity Replace", sub: "Rename a character across 80K words in one click" },
    { label: "Sprint Mode + Ambience", sub: "Focus tools writers actually asked for" },
    { label: "Web platform + Auth", sub: "OTP sign-in → deep link to desktop app" },
    { label: "Subscriptions live", sub: "Free → Pro → Pro+ → Ultra via Dodo Payments" },
    { label: "AI infrastructure", sub: "Cloudflare edge, model-routed by plan tier" },
  ];

  return (
    <Slide n={4} glow="left">
      <div style={{ display: "flex", height: "100%", alignItems: "center", gap: "7%" }}>
        <div style={{ flex: "0 0 42%" }}>
          <div style={{ display: "inline-flex", background: "#0F2A0F", border: "1px solid #1A4D1A", borderRadius: 8, padding: "6px 16px", marginBottom: "4%" }}>
            <span style={{ color: "#4ADE80", fontSize: "min(1.1vw, 12px)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const }}>
              ● MVP Launched — March 23, 2026
            </span>
          </div>
          <h2 style={{ color: W, fontSize: "min(6.5vw, 74px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, margin: "0 0 4%", fontFamily: sans }}>
            Fully functional.<br />
            <span style={{ color: VL }}>Shipped last week.</span>
          </h2>
          <Body>
            Mac · Windows · Linux. Hybrid offline + background sync. Every core feature is live and working end-to-end. This is not a prototype.
          </Body>
          <div style={{ marginTop: "5%", padding: "4% 5%", background: C1, borderRadius: 14, borderLeft: `4px solid ${V}` }}>
            <p style={{ color: VL, fontSize: "min(1.7vw, 17px)", margin: 0, lineHeight: 1.65, fontFamily: sans }}>
              &ldquo;The first desktop AI Story OS that automatically builds and maintains a living knowledge graph of your entire world as you write — locally, in real time.&rdquo;
            </p>
          </div>
        </div>
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2%" }}>
          {shipped.map((item) => (
            <div key={item.label} style={{ background: C1, borderRadius: 12, padding: "4% 4%", borderLeft: `3px solid ${V}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ color: "#4ADE80", fontSize: "min(1.1vw, 12px)" }}>✓</span>
                <span style={{ color: W, fontSize: "min(1.5vw, 15px)", fontWeight: 700 }}>{item.label}</span>
              </div>
              <div style={{ color: M, fontSize: "min(1.2vw, 13px)", lineHeight: 1.5 }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 05 — PRODUCT DEMO
═══════════════════════════════════════════ */
function S04() {
  return (
    <Slide n={5} glow="center">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: "4%" }}>
          <div style={{ width: 24, height: 2, background: V }} />
          <span style={{ color: V, fontSize: "min(1.2vw, 13px)", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const }}>Product Demo</span>
          <div style={{ width: 24, height: 2, background: V }} />
        </div>
        <div style={{
          width: "72%", aspectRatio: "16/9",
          background: C1, border: "1px solid #2A2320", borderRadius: 18,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          position: "relative",
          boxShadow: "0 0 80px rgba(124,58,237,0.2)",
        }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: V, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
            <div style={{ width: 0, height: 0, borderTop: "14px solid transparent", borderBottom: "14px solid transparent", borderLeft: "24px solid #fff", marginLeft: 5 }} />
          </div>
          <p style={{ color: W, fontSize: "min(2.4vw, 26px)", fontWeight: 700, margin: 0 }}>Full product walkthrough</p>
          <p style={{ color: M, fontSize: "min(1.8vw, 18px)", margin: "10px 0 0" }}>xvault.dev/demo</p>
          {/* corner badges */}
          <div style={{ position: "absolute", top: "10%", left: "3%", background: "#1A0D3D", borderRadius: 8, padding: "5px 12px" }}>
            <span style={{ color: VL, fontSize: "min(1.2vw, 13px)", fontWeight: 600 }}>Zen Editor</span>
          </div>
          <div style={{ position: "absolute", top: "10%", right: "3%", background: "#1A0D3D", borderRadius: 8, padding: "5px 12px" }}>
            <span style={{ color: VL, fontSize: "min(1.2vw, 13px)", fontWeight: 600 }}>World Graph</span>
          </div>
          <div style={{ position: "absolute", bottom: "10%", left: "3%", background: "#1A0D3D", borderRadius: 8, padding: "5px 12px" }}>
            <span style={{ color: VL, fontSize: "min(1.2vw, 13px)", fontWeight: 600 }}>Co-Author AI</span>
          </div>
          <div style={{ position: "absolute", bottom: "10%", right: "3%", background: "#1A0D3D", borderRadius: 8, padding: "5px 12px" }}>
            <span style={{ color: VL, fontSize: "min(1.2vw, 13px)", fontWeight: 600 }}>Dead Branch Alerts</span>
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 06 — WORLD BUILDER
═══════════════════════════════════════════ */
function S05() {
  return (
    <Slide n={6} glow="left">
      <div style={{ display: "flex", height: "100%", alignItems: "center", gap: "6%" }}>
        <div style={{ flex: "0 0 44%" }}>
          <Label text="Feature 01" />
          <H size={70}>Automatic<br />World Builder</H>
          <Body>As you write, XVault extracts every character, location, faction, and event — and maps their relationships in a live knowledge graph. No tagging, no manual entry required.</Body>
          <GreenBadge>Not available in any other writing tool — including AI-native ones.</GreenBadge>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2%" }}>
          {[
            { name: "Kael Dra'eth", type: "Character", icon: "◉", tags: ["Protagonist", "Mage"], rels: 12 },
            { name: "The Obsidian Keep", type: "Location", icon: "◈", tags: ["Fortress", "Ch.3–8"], rels: 7 },
            { name: "The Ash Covenant", type: "Faction", icon: "◆", tags: ["Antagonist", "Political"], rels: 9 },
          ].map((e) => (
            <div key={e.name} style={{ background: C1, borderRadius: 14, padding: "3.5% 4%", display: "flex", alignItems: "center", gap: "3%" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#1A0D3D", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ color: VL, fontSize: 18 }}>{e.icon}</span>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: W, fontSize: "min(1.9vw, 19px)", fontWeight: 700 }}>{e.name}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                  {e.tags.map(t => (
                    <span key={t} style={{ background: "#1A0D3D", color: VL, fontSize: "min(1.1vw, 12px)", fontWeight: 600, borderRadius: 6, padding: "2px 10px" }}>{t}</span>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: M, fontSize: "min(1.1vw, 12px)" }}>Relations</div>
                <div style={{ color: V, fontSize: "min(2.8vw, 28px)", fontWeight: 700 }}>{e.rels}</div>
              </div>
            </div>
          ))}
          <div style={{ background: "#1A0D3D", borderRadius: 14, padding: "3% 4%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: VL, fontSize: "min(1.5vw, 15px)" }}>Graph auto-updates as you type</span>
            <span style={{ color: W, fontSize: "min(1.5vw, 15px)", fontWeight: 700 }}>47 entities · 183 relations</span>
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 07 — CO-AUTHOR
═══════════════════════════════════════════ */
function S06() {
  return (
    <Slide n={7} glow="right">
      <div style={{ display: "flex", height: "100%", alignItems: "center", gap: "6%" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{ background: C1, borderRadius: 16, padding: "4%", display: "flex", flexDirection: "column", gap: "3%" }}>
            {[
              { from: "ai", text: "I noticed you haven't resolved the Obsidian Key subplot from Chapter 3. Kael found it but never used it — this is a dead branch. Want me to weave it into Chapter 12?" },
              { from: "user", text: "Yes, and also make the ending of chapter 11 foreshadow it." },
              { from: "ai", text: 'Updated Ch.11 para 4: "Kael\'s hand brushed the cold iron key at his belt — the one thing from the Keep he hadn\'t yet understood." Preview → Apply?' },
            ].map((msg, i) => (
              <div key={i} style={{ display: "flex", gap: "2.5%", justifyContent: msg.from === "user" ? "flex-end" : "flex-start" }}>
                {msg.from === "ai" && (
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#1A0D3D", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ color: VL, fontSize: 11, fontWeight: 700 }}>AI</span>
                  </div>
                )}
                <div style={{
                  background: msg.from === "ai" ? "#1A0D3D" : "#2A2320",
                  borderRadius: msg.from === "ai" ? "0 12px 12px 12px" : "12px 0 12px 12px",
                  padding: "3% 4%", maxWidth: "85%",
                }}>
                  <div style={{ color: msg.from === "ai" ? VL : W, fontSize: "min(1.5vw, 15px)", lineHeight: 1.65 }}>{msg.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: "0 0 42%" }}>
          <Label text="Feature 02" />
          <H size={70}>Co-Author AI</H>
          <Body>Not a writing assistant. An actual co-author. It holds your entire manuscript in context, makes changes anywhere, and proactively surfaces ideas — without being asked.</Body>
          <div style={{ marginTop: "4%", display: "flex", flexDirection: "column", gap: "2%" }}>
            {[
              "Full manuscript context — not just the current chapter",
              "Makes targeted edits anywhere in the document",
              "Proactively flags issues and suggests plot moves",
              "Knows your characters, their voice, their history",
            ].map(f => (
              <div key={f} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: V, marginTop: 9, flexShrink: 0 }} />
                <span style={{ color: M, fontSize: "min(1.6vw, 16px)", lineHeight: 1.6 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 08 — ONE-CLICK ADAPTATION
═══════════════════════════════════════════ */
function S07() {
  return (
    <Slide n={8} glow="left">
      <div style={{ display: "flex", height: "100%", alignItems: "center", gap: "6%" }}>
        <div style={{ flex: "0 0 42%" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, marginBottom: "4%" }}>
            <Label text="Feature 03" />
            <div style={{ display: "inline-flex", background: "#2A1500", border: "1px solid #7C4A00", borderRadius: 8, padding: "5px 14px", marginBottom: "2.5%" }}>
              <span style={{ color: AM, fontSize: "min(1.1vw, 12px)", fontWeight: 700 }}>In Development</span>
            </div>
          </div>
          <H size={68}>One-Click<br />Adaptation</H>
          <Body>A novelist can't turn their novel into a webtoon or screenplay themselves. Now they can — in one click. No equivalent exists in any tool on the market.</Body>
          <GreenBadge>Expands TAM from novelists → all storytelling mediums</GreenBadge>
        </div>
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5%" }}>
          {[
            { name: "Screenplay", icon: "🎬", desc: "Final Draft-style format. Scene headings, action lines, dialogue blocks." },
            { name: "Webtoon Outline", icon: "🎨", desc: "Panel-by-panel scene breakdown with visual beat descriptions." },
            { name: "Game Narrative", icon: "🎮", desc: "Branching dialogue, quest structure, character flags." },
            { name: "Podcast Script", icon: "🎙️", desc: "Audio drama format with SFX cues and voiceover instructions." },
          ].map(f => (
            <div key={f.name} style={{ background: C1, borderRadius: 14, padding: "7% 7%" }}>
              <div style={{ fontSize: "min(3vw, 32px)", marginBottom: "4%" }}>{f.icon}</div>
              <div style={{ color: W, fontSize: "min(1.9vw, 20px)", fontWeight: 700, marginBottom: "3%" }}>{f.name}</div>
              <div style={{ color: M, fontSize: "min(1.5vw, 16px)", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 09 — DEAD BRANCH DETECTION
═══════════════════════════════════════════ */
function S08() {
  return (
    <Slide n={9} glow="right">
      <div style={{ display: "flex", height: "100%", alignItems: "center", gap: "6%" }}>
        <div style={{ flex: 1 }}>
          <div style={{ background: C1, borderRadius: 14, padding: "4%", marginBottom: "2%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "3%" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444" }} />
              <span style={{ color: "#EF4444", fontSize: "min(1.2vw, 13px)", fontWeight: 700, letterSpacing: "0.1em" }}>DEAD BRANCH DETECTED</span>
            </div>
            <div style={{ color: W, fontSize: "min(1.9vw, 19px)", fontWeight: 700, marginBottom: "2%" }}>The Obsidian Key — introduced Ch.3, unresolved</div>
            <div style={{ color: M, fontSize: "min(1.5vw, 15px)", lineHeight: 1.65, marginBottom: "3%" }}>
              Kael found the Obsidian Key in the Keep vault (Ch.3 p.47). Referenced again in Ch.7. Never explained or used. 9 chapters remain open.
            </div>
            <div style={{ display: "flex", gap: "2%" }}>
              <div style={{ background: "#1A0D3D", borderRadius: 8, padding: "8px 16px" }}>
                <span style={{ color: VL, fontSize: "min(1.3vw, 13px)", fontWeight: 600 }}>Suggest resolution →</span>
              </div>
              <div style={{ background: "#2A2320", borderRadius: 8, padding: "8px 16px" }}>
                <span style={{ color: M, fontSize: "min(1.3vw, 13px)" }}>Mark as intentional</span>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "2%" }}>
            {[
              { label: "Dead branches", val: "3", color: "#EF4444" },
              { label: "Continuity warnings", val: "7", color: AM },
              { label: "Active threads", val: "14", color: "#4ADE80" },
            ].map(s => (
              <div key={s.label} style={{ background: C1, borderRadius: 12, padding: "4% 5%", flex: 1 }}>
                <div style={{ color: M, fontSize: "min(1.2vw, 12px)", marginBottom: 6 }}>{s.label}</div>
                <div style={{ color: s.color, fontSize: "min(3vw, 32px)", fontWeight: 700 }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: "0 0 42%" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: "4%" }}>
            <Label text="Feature 04" />
            <div style={{ display: "inline-flex", background: "#0F2A0F", border: "1px solid #1A4D1A", borderRadius: 8, padding: "5px 14px", marginBottom: "2.5%" }}>
              <span style={{ color: "#4ADE80", fontSize: "min(1.1vw, 12px)", fontWeight: 700 }}>Live in app</span>
            </div>
          </div>
          <H size={68}>Dead Branch<br />Detection</H>
          <Body>Plot threads you introduced and never resolved. Continuity breaks. Character contradictions. XVault catches them automatically, in real time, as you write.</Body>
          <p style={{ color: M, fontSize: "min(1.6vw, 16px)", lineHeight: 1.7, marginTop: "4%" }}>
            A human editor charges $2,000–$5,000 for a single continuity pass on a 100K-word novel. XVault does it continuously, free, as you draft.
          </p>
        </div>
      </div>
    </Slide>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 10 — MARKETPLACE
═══════════════════════════════════════════ */
function S09() {
  return (
    <Slide n={10} glow="left">
      <div style={{ display: "flex", height: "100%", alignItems: "center", gap: "6%" }}>
        <div style={{ flex: "0 0 44%" }}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const, marginBottom: "4%" }}>
            <Label text="Feature 05" />
            <div style={{ display: "inline-flex", background: "#2A1500", border: "1px solid #7C4A00", borderRadius: 8, padding: "5px 14px", marginBottom: "2.5%" }}>
              <span style={{ color: AM, fontSize: "min(1.1vw, 12px)", fontWeight: 700 }}>Planned — Q3 2027 Roadmap</span>
            </div>
          </div>
          <H size={68}>World<br />Marketplace</H>
          <Body>Writers export their knowledge graph — characters, relationships, magic systems, lore — as a &ldquo;World Pack&rdquo; and sell it to other writers. We take 25%.</Body>
          <div style={{ display: "flex", gap: "4%", marginTop: "5%" }}>
            {[["75%", "Creator keeps"], ["25%", "XVault takes"]].map(([pct, lbl]) => (
              <div key={pct} style={{ textAlign: "center" }}>
                <div style={{ color: pct === "75%" ? "#4ADE80" : V, fontSize: "min(3.8vw, 42px)", fontWeight: 800 }}>{pct}</div>
                <div style={{ color: M, fontSize: "min(1.3vw, 13px)", marginTop: 4 }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2.5%" }}>
          {[
            { name: "Medieval Fantasy Pack", desc: "200 entities · 500 relations · 3 magic systems · 12 factions", price: "$4.99", dl: "342" },
            { name: "Cyberpunk Megacity Pack", desc: "180 entities · 420 relations · 5 corps · 8 districts", price: "$2.99", dl: "218" },
            { name: "Wuxia Realm — Official Canon", desc: "Fan fiction starter pack from published author", price: "$9.99", dl: "107" },
          ].map((p) => (
            <div key={p.name} style={{ background: C1, borderRadius: 14, padding: "4% 5%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: W, fontSize: "min(1.9vw, 18px)", fontWeight: 700, marginBottom: 6 }}>{p.name}</div>
                <div style={{ color: M, fontSize: "min(1.4vw, 14px)" }}>{p.desc}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, marginLeft: "3%" }}>
                <div style={{ color: V, fontSize: "min(2vw, 20px)", fontWeight: 700 }}>{p.price}</div>
                <div style={{ color: M, fontSize: "min(1.2vw, 12px)", marginTop: 4 }}>{p.dl} downloads</div>
              </div>
            </div>
          ))}
          <div style={{ background: "#1A0D3D", borderRadius: 14, padding: "3.5% 5%" }}>
            <div style={{ color: VL, fontSize: "min(1.5vw, 15px)", fontWeight: 600, marginBottom: 6 }}>Why VCs love marketplaces</div>
            <div style={{ color: M, fontSize: "min(1.4vw, 14px)", lineHeight: 1.6 }}>Network effects · Data moat · Creator economy · Roblox/Unity Asset Store pattern applied to storytelling</div>
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 11 — MARKET SIZE
═══════════════════════════════════════════ */
function S10() {
  return (
    <Slide n={11} glow="right">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2.5%" }}>
        <div style={{ width: 24, height: 2, background: V }} />
        <span style={{ color: V, fontSize: "min(1.2vw, 13px)", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const }}>Market Opportunity</span>
      </div>
      <H size={64}>A real, reachable market — built bottom-up.</H>

      {/* Bottom-up hero number */}
      <div style={{ background: C1, borderRadius: 16, padding: "3.5% 4%", marginBottom: "2%", display: "flex", alignItems: "center", gap: "5%", borderLeft: `4px solid ${V}` }}>
        <div>
          <div style={{ color: M, fontSize: "min(1.2vw, 13px)", textTransform: "uppercase" as const, letterSpacing: "0.2em", marginBottom: 6 }}>Bottom-up starting point</div>
          <div style={{ color: W, fontSize: "min(4.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em" }}>2M+ indie authors</div>
          <div style={{ color: VL, fontSize: "min(1.8vw, 18px)", fontWeight: 600, marginTop: 4 }}>actively publishing on Amazon KDP today</div>
        </div>
        <div style={{ width: 1, background: "#2A2320", alignSelf: "stretch" }} />
        <div style={{ flex: 1 }}>
          {[
            ["AI writing tool spend", "Growing 40% YoY — $500M+ category in 2026"],
            ["Willingness to pay", "Grammarly: 30M paid users proves writers pay for tools"],
            ["Target segment", "English-speaking, digital-first, AI-open writers"],
          ].map(([label, val]) => (
            <div key={label as string} style={{ marginBottom: "3.5%" }}>
              <div style={{ color: VL, fontSize: "min(1.3vw, 13px)", fontWeight: 600 }}>{label}</div>
              <div style={{ color: M, fontSize: "min(1.4vw, 14px)", lineHeight: 1.5 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2%" }}>
        {[
          {
            tier: "TAM", val: "$4.2B",
            sub: "8M novelists + 2M scriptwriters × $35/mo ARPU",
            proxies: ["Scrivener 1M+ paid", "NaNoWriMo 500K/yr", "WGA 11.5K active pros"],
            color: V,
          },
          {
            tier: "SAM", val: "$1.05B",
            sub: "2.5M English-speaking digital-first writers",
            proxies: ["3M+ KDP active authors", "AI-tool adoption accelerating", "Desktop tool price tolerance high"],
            color: VL,
          },
          {
            tier: "SOM Year 3", val: "$12M ARR",
            sub: "25K users × $40 blended ARPU = $1M MRR",
            proxies: ["0.5% of SAM — very conservative", "Ulysses (writing app) ~$5M ARR by year 5"],
            color: "#4ADE80",
          },
        ].map((m) => (
          <div key={m.tier} style={{ background: C1, borderRadius: 14, padding: "4% 4.5%", borderTop: `3px solid ${m.color}` }}>
            <div style={{ color: m.color, fontSize: "min(1.1vw, 11px)", fontWeight: 700, letterSpacing: "0.24em", marginBottom: "3%" }}>{m.tier}</div>
            <div style={{ color: W, fontSize: "min(3vw, 34px)", fontWeight: 800, marginBottom: "2%" }}>{m.val}</div>
            <div style={{ color: M, fontSize: "min(1.3vw, 13px)", lineHeight: 1.6, marginBottom: "3%", borderBottom: "1px solid #2A2320", paddingBottom: "3%" }}>{m.sub}</div>
            {m.proxies.map(p => (
              <div key={p} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: "2.5%" }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: m.color, marginTop: 8, flexShrink: 0 }} />
                <span style={{ color: M, fontSize: "min(1.2vw, 13px)", lineHeight: 1.5 }}>{p}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Slide>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 12 — PATH TO $1M MRR
═══════════════════════════════════════════ */
function S11() {
  const phases = [
    {
      phase: "Phase 1", time: "0–12 months",
      target: "$190K MRR",
      metrics: "5,000 paid users · SaaS only",
      lines: ["Pro ($20): 2,500 users", "Pro+ ($60): 1,500 users", "Ultra ($200): 1,000 users"],
      color: VL,
    },
    {
      phase: "Phase 2", time: "12–24 months",
      target: "$695K MRR",
      metrics: "15,000 users + Marketplace live",
      lines: ["SaaS base: ~$570K MRR", "Marketplace GMV: $500K/mo × 25% = $125K", "CAC drops via writer word-of-mouth"],
      color: V,
    },
    {
      phase: "Phase 3", time: "24–30 months",
      target: "$1M+ MRR",
      metrics: "22,000 users + Marketplace + Enterprise",
      lines: ["SaaS base: ~$836K MRR", "Marketplace: $150K MRR", "3 enterprise contracts × $10K/mo = $30K"],
      color: "#4ADE80",
    },
  ];

  return (
    <Slide n={12} glow="left">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2.5%" }}>
        <div style={{ width: 24, height: 2, background: V }} />
        <span style={{ color: V, fontSize: "min(1.2vw, 13px)", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const }}>Revenue Path</span>
      </div>
      <H size={64}>Path to $1M MRR in 30 months.</H>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2%", marginTop: "3%" }}>
        {phases.map((p) => (
          <div key={p.phase} style={{ background: C1, borderRadius: 14, padding: "5%", borderTop: `3px solid ${p.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4%" }}>
              <div>
                <div style={{ color: p.color, fontSize: "min(1.1vw, 11px)", fontWeight: 700, letterSpacing: "0.2em" }}>{p.phase}</div>
                <div style={{ color: M, fontSize: "min(1.2vw, 13px)", marginTop: 4 }}>{p.time}</div>
              </div>
              <div style={{ color: W, fontSize: "min(2.6vw, 26px)", fontWeight: 800 }}>{p.target}</div>
            </div>
            <div style={{ color: VL, fontSize: "min(1.3vw, 13px)", marginBottom: "4%", padding: "8px 12px", background: "#1A0D3D", borderRadius: 8 }}>{p.metrics}</div>
            {p.lines.map(l => (
              <div key={l} style={{ display: "flex", gap: 8, marginBottom: "2.5%", alignItems: "flex-start" }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: p.color, marginTop: 9, flexShrink: 0 }} />
                <span style={{ color: M, fontSize: "min(1.4vw, 14px)", lineHeight: 1.5 }}>{l}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "2.5%", padding: "2.5% 3%", background: C1, borderRadius: 12, display: "flex", gap: "4%" }}>
        {["CAC ~$15 (content + community)", "Churn ~4%/mo", "Blended ARPU $38", "No paid ads in Phase 1"].map(a => (
          <span key={a} style={{ color: M, fontSize: "min(1.3vw, 13px)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: M, flexShrink: 0, display: "inline-block" }} />
            {a}
          </span>
        ))}
      </div>
    </Slide>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 13 — BUSINESS MODEL
═══════════════════════════════════════════ */
function S12() {
  return (
    <Slide n={13} glow="right">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2.5%" }}>
        <div style={{ width: 24, height: 2, background: V }} />
        <span style={{ color: V, fontSize: "min(1.2vw, 13px)", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const }}>Business Model</span>
      </div>
      <H size={64}>Three revenue streams. One flywheel.</H>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2%", marginTop: "3%" }}>
        {[
          {
            stream: "SaaS Subscriptions",
            tiers: [
              { name: "Free", price: "$0", note: "300 trial credits" },
              { name: "Pro", price: "$20/mo", note: "500 credits/mo" },
              { name: "Pro+", price: "$60/mo", note: "2,000 credits — most popular" },
              { name: "Ultra", price: "$200/mo", note: "10,000 credits" },
            ],
            note: "Recurring, predictable, low churn once writers are in their workflow.",
            color: V,
          },
          {
            stream: "World Marketplace",
            tiers: [
              { name: "Pack sales", price: "$2–$10", note: "per world pack" },
              { name: "XVault cut", price: "25%", note: "of every transaction" },
              { name: "Network effect", price: "∞", note: "more packs = more buyers = more creators" },
            ],
            note: "GMV-based. Self-reinforcing. Competitors can't replicate the pack library.",
            color: VL,
          },
          {
            stream: "Enterprise (B2B)",
            tiers: [
              { name: "Publishers", price: "$5–50K/yr", note: "series consistency checker" },
              { name: "Game studios", price: "$10–100K/yr", note: "narrative tools + lore management" },
              { name: "IP holders", price: "Custom", note: "franchise planning + spin-off suggester" },
            ],
            note: "ARPU 250× higher than consumer. Unlocked after marketplace gives social proof.",
            color: "#4ADE80",
          },
        ].map((s) => (
          <div key={s.stream} style={{ background: C1, borderRadius: 14, padding: "5%", borderTop: `3px solid ${s.color}` }}>
            <div style={{ color: s.color, fontSize: "min(1.1vw, 11px)", fontWeight: 700, letterSpacing: "0.2em", marginBottom: "3%", textTransform: "uppercase" as const }}>{s.stream}</div>
            <div style={{ marginBottom: "4%" }}>
              {s.tiers.map(t => (
                <div key={t.name} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #2A2320", padding: "3% 0" }}>
                  <span style={{ color: M, fontSize: "min(1.4vw, 14px)" }}>{t.name} · <span style={{ color: "#5A534E" }}>{t.note}</span></span>
                  <span style={{ color: W, fontSize: "min(1.5vw, 15px)", fontWeight: 700, flexShrink: 0, marginLeft: 8 }}>{t.price}</span>
                </div>
              ))}
            </div>
            <div style={{ color: M, fontSize: "min(1.3vw, 13px)", lineHeight: 1.6 }}>{s.note}</div>
          </div>
        ))}
      </div>
    </Slide>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 14 — VISION
═══════════════════════════════════════════ */
function S13() {
  const steps = [
    { label: "NOW", title: "Writer Tool", sub: "Desktop IDE + AI", color: V, corner: "12px 0 0 12px" },
    { label: "NEXT", title: "Reader Platform", sub: "Public stories + AI companion", color: VL, corner: "0" },
    { label: "THEN", title: "Creator Economy", sub: "World Marketplace, 25% take rate", color: V, corner: "0" },
    { label: "FUTURE", title: "Enterprise Layer", sub: "Publishers, studios, IP holders", color: VL, corner: "0" },
    { label: "2028+", title: "Webtoon Studio", sub: "Native drawing + AI panel generation", color: AM, corner: "0 12px 12px 0" },
  ];

  return (
    <Slide n={14} glow="center">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "3%" }}>
        <div style={{ width: 24, height: 2, background: V }} />
        <span style={{ color: V, fontSize: "min(1.2vw, 13px)", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const }}>The Vision</span>
      </div>
      <h2 style={{ color: W, fontSize: "min(6.5vw, 76px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, margin: "0 0 2%" }}>
        We&apos;re not a writing app.
      </h2>
      <h2 style={{ color: VL, fontSize: "min(6.5vw, 76px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, margin: "0 0 5%" }}>
        We&apos;re the creative infrastructure layer<br />for the next generation of storytelling.
      </h2>
      <div style={{ display: "flex", gap: 0 }}>
        {steps.map((s) => (
          <div key={s.label} style={{ flex: 1, background: "#141210", borderRadius: s.corner, padding: "4% 5%", borderRight: "1px solid #1A1816" }}>
            <div style={{ color: s.color, fontSize: "min(1.1vw, 11px)", fontWeight: 700, letterSpacing: "0.24em", marginBottom: "4%" }}>{s.label}</div>
            <div style={{ color: W, fontSize: "min(2vw, 22px)", fontWeight: 700, lineHeight: 1.3, marginBottom: "3%" }}>{s.title}</div>
            <div style={{ color: M, fontSize: "min(1.5vw, 15px)", lineHeight: 1.5 }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </Slide>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 15 — COMPETITION (CLEAN 2×2)
═══════════════════════════════════════════ */
function S14() {
  const quadrants = [
    {
      title: "Scrivener / Word",
      sub: "Organization tools",
      desc: "Great for manuscript structure. Zero AI, zero world understanding, zero continuity checking. Built for the pre-AI era.",
      tags: ["✓ Organizes chapters", "✗ No AI", "✗ No world graph", "✗ No dead branches"],
      color: M,
    },
    {
      title: "ChatGPT / Claude / Gemini",
      sub: "General AI assistants",
      desc: "Brilliant at generating text. Completely amnesiac — no memory of your characters, your plot, your world. Every session starts from scratch.",
      tags: ["✓ Generates text", "✗ No story memory", "✗ Forgets everything", "✗ Not a writing tool"],
      color: M,
    },
    {
      title: "Sudowrite / NovelCrafter",
      sub: "AI writing assistants",
      desc: "The closest competitors. Help with prose and offer basic story bibles. But web-based, no live world graph, no real-time dead branch detection, no adaptation engine.",
      tags: ["✓ AI writing help", "Partial story bibles", "✗ No live world graph", "✗ No dead branch detection"],
      color: AM,
    },
    {
      title: "XVault Studio",
      sub: "AI Story OS — the gap we fill",
      desc: "The only tool that automatically builds a living knowledge graph as you write, catches dead branches in real time, and runs locally. Desktop-native. No subscription trap for the core editor.",
      tags: ["✓ Live world graph", "✓ Dead branch detection", "✓ Local + offline", "✓ Adaptation engine"],
      color: "#4ADE80",
      highlight: true,
    },
  ];

  return (
    <Slide n={15} glow="left">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2.5%" }}>
        <div style={{ width: 24, height: 2, background: V }} />
        <span style={{ color: V, fontSize: "min(1.2vw, 13px)", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const }}>Competitive Landscape</span>
      </div>
      <H size={58}>Every competitor solves one piece.<br />We&apos;re the only complete system — and the only desktop-native one.</H>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2%", marginTop: "2%" }}>
        {quadrants.map((q) => (
          <div key={q.title} style={{
            background: q.highlight ? "#1A0D3D" : C1,
            borderRadius: 14, padding: "4% 5%",
            border: q.highlight ? `1px solid ${V}` : "1px solid transparent",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "3%" }}>
              <div>
                <div style={{ color: W, fontSize: "min(1.9vw, 20px)", fontWeight: 700 }}>{q.title}</div>
                <div style={{ color: q.color, fontSize: "min(1.2vw, 13px)", marginTop: 4, fontWeight: 600 }}>{q.sub}</div>
              </div>
              {q.highlight && <span style={{ color: V, fontSize: 20 }}>●</span>}
            </div>
            <p style={{ color: M, fontSize: "min(1.4vw, 15px)", lineHeight: 1.65, margin: "0 0 4%" }}>{q.desc}</p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {q.tags.map(t => (
                <span key={t} style={{
                  background: t.startsWith("✓") ? "#0F2A0F" : t.startsWith("✗") ? "#1A0A0A" : "#2A1500",
                  color: t.startsWith("✓") ? "#4ADE80" : t.startsWith("✗") ? "#4A3530" : AM,
                  fontSize: "min(1.2vw, 12px)", fontWeight: 600,
                  borderRadius: 6, padding: "3px 10px",
                }}>{t}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Slide>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 16 — WHAT WE'VE BUILT
═══════════════════════════════════════════ */
function S15() {
  return (
    <Slide n={16} glow="right">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "2.5%" }}>
        <div style={{ width: 24, height: 2, background: V }} />
        <span style={{ color: V, fontSize: "min(1.2vw, 13px)", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const }}>Traction</span>
      </div>
      <H size={64}>The foundation is laid.<br />Ready to acquire.</H>
      <p style={{ color: M, fontSize: "min(1.7vw, 17px)", margin: "0 0 4%", lineHeight: 1.7 }}>
        Pre-revenue, pre-users. Full-stack product is built, tested, and working end-to-end. This is a seed round to go from &ldquo;built&rdquo; to &ldquo;acquired 10,000 users.&rdquo;
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2%" }}>
        {[
          {
            title: "Desktop App",
            tech: "Tauri v2 + Rust + ChromaDB",
            items: ["Zen editor (Lexical)", "Live world graph", "Co-Author AI + Ghost Write", "Dead Branch Detection", "Global replace, Sprint mode", "Ambience player, CorkBoard"],
            color: V,
          },
          {
            title: "Web Platform",
            tech: "Next.js + Supabase + Dodo Payments",
            items: ["Landing page + marketing site", "Email OTP auth → deep link to app", "Dashboard, pricing, account pages", "Dodo Payments webhook (subscriptions)", "Plan tiers: Free → Pro → Pro+ → Ultra"],
            color: VL,
          },
          {
            title: "AI Infrastructure",
            tech: "Cloudflare Workers + Gemini 1.5 Pro",
            items: ["Model routing by plan tier", "Credit metering + monthly resets", "Brainstorm, Ghost Write, Continuity tasks", "Context injection from world graph", "Zero latency via edge deployment"],
            color: "#4ADE80",
          },
        ].map((col) => (
          <div key={col.title} style={{ background: C1, borderRadius: 14, padding: "5%" }}>
            <div style={{ color: col.color, fontSize: "min(1.1vw, 11px)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: "3%" }}>{col.tech}</div>
            <div style={{ color: W, fontSize: "min(2vw, 20px)", fontWeight: 700, marginBottom: "4%", borderBottom: "1px solid #2A2320", paddingBottom: "4%" }}>{col.title}</div>
            {col.items.map(item => (
              <div key={item} style={{ display: "flex", gap: 8, marginBottom: "2.5%", alignItems: "flex-start" }}>
                <span style={{ color: col.color, flexShrink: 0, marginTop: 4 }}>✓</span>
                <span style={{ color: M, fontSize: "min(1.4vw, 14px)", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Slide>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 17 — TEAM
═══════════════════════════════════════════ */
function S17_Team() {
  return (
    <Slide n={17} glow="left">
      <div style={{ display: "flex", height: "100%", alignItems: "center", gap: "8%" }}>
        <div style={{ flex: "0 0 44%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "4%" }}>
            <div style={{ width: 24, height: 2, background: V }} />
            <span style={{ color: V, fontSize: "min(1.2vw, 13px)", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const }}>The Team</span>
          </div>
          <H size={68}>Built by a writer<br />who ships.</H>
          <Body>
            Solo founder. Novelist turned engineer. The 3,000+ rejections and dead plot branches I&apos;ve personally written are the product spec for XVault. I built the tool I always needed.
          </Body>
          <div style={{ marginTop: "5%", padding: "4% 5%", background: C1, borderRadius: 14, borderLeft: `4px solid ${V}` }}>
            <p style={{ color: VL, fontSize: "min(1.7vw, 17px)", margin: 0, lineHeight: 1.65, fontFamily: sans }}>
              &ldquo;Full-stack desktop app, web platform, AI infrastructure, and payment system — all shipped solo in under 6 months. The pace doesn&apos;t slow down after funding, it accelerates.&rdquo;
            </p>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2.5%" }}>
          {[
            {
              area: "Product",
              items: ["Fiction writer — the primary user is me", "Understand the exact pain points from lived experience", "Shipped full MVP from zero in under 6 months"],
              color: V,
            },
            {
              area: "Engineering",
              items: ["Full-stack: Rust (Tauri), React, Next.js, TypeScript", "Systems: Cloudflare Workers, Supabase, ChromaDB", "AI integration: model routing, credit metering, RAG pipeline"],
              color: VL,
            },
            {
              area: "Distribution instinct",
              items: ["Deeply embedded in writing communities (NaNoWriMo, Royal Road, KDP forums)", "Knows how writers discover and share tools", "Content-led growth is the playbook — organic from day 1"],
              color: "#4ADE80",
            },
          ].map((s) => (
            <div key={s.area} style={{ background: C1, borderRadius: 12, padding: "3.5% 4%", display: "flex", gap: "3%", alignItems: "flex-start" }}>
              <div style={{ width: 3, background: s.color, borderRadius: 2, alignSelf: "stretch", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ color: s.color, fontSize: "min(1.1vw, 11px)", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: "2.5%" }}>{s.area}</div>
                {s.items.map(i => (
                  <div key={i} style={{ color: M, fontSize: "min(1.4vw, 14px)", lineHeight: 1.6, marginBottom: "1.5%" }}>· {i}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Slide>
  );
}

/* ═══════════════════════════════════════════
   SLIDE 18 — THE ASK
═══════════════════════════════════════════ */
function S16() {
  return (
    <Slide n={18} glow="center">
      <div style={{ display: "flex", height: "100%", alignItems: "center", gap: "8%" }}>
        <div style={{ flex: "0 0 50%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "3%" }}>
            <div style={{ width: 24, height: 2, background: V }} />
            <span style={{ color: V, fontSize: "min(1.2vw, 13px)", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase" as const }}>The Ask</span>
          </div>
          <h2 style={{ color: W, fontSize: "min(6.5vw, 76px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.05, margin: "0 0 3%" }}>
            Joining<br /><span style={{ color: V }}>Speedrun.</span>
          </h2>
          <Body>MVP is live. Product is working. The goal for Speedrun is focused and specific: ship Marketplace v1, acquire the first 500 paying users, and hit $20K MRR in 12 weeks.</Body>
          <div style={{ marginTop: "4%", display: "flex", flexDirection: "column", gap: "2.5%" }}>
            {[
              { label: "Week 1–3", val: "Launch to writing communities, first 50 paying users" },
              { label: "Week 4–8", val: "Ship One-Click Adaptation, 200 users" },
              { label: "Week 9–12", val: "Marketplace v1 live, 500 users, $20K MRR" },
            ].map(g => (
              <div key={g.label} style={{ display: "flex", gap: "3%", alignItems: "flex-start" }}>
                <div style={{ background: "#1A0D3D", borderRadius: 6, padding: "4px 12px", flexShrink: 0 }}>
                  <span style={{ color: VL, fontSize: "min(1.2vw, 13px)", fontWeight: 600 }}>{g.label}</span>
                </div>
                <span style={{ color: M, fontSize: "min(1.4vw, 14px)", lineHeight: 1.6 }}>{g.val}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "3%" }}>
          {[
            { use: "User Acquisition", pct: "40%", desc: "Writing communities, content marketing, influencer seeding" },
            { use: "Engineering", pct: "30%", desc: "One-Click Adaptation + Marketplace v1" },
            { use: "Operations", pct: "20%", desc: "Infrastructure, legal, design" },
            { use: "Reserve", pct: "10%", desc: "Runway buffer" },
          ].map((u) => (
            <div key={u.use} style={{ background: C1, borderRadius: 14, padding: "4% 5%", display: "flex", gap: "4%", alignItems: "center" }}>
              <div style={{ color: V, fontSize: "min(2.8vw, 28px)", fontWeight: 800, flexShrink: 0, width: "15%" }}>{u.pct}</div>
              <div>
                <div style={{ color: W, fontSize: "min(1.7vw, 17px)", fontWeight: 700, marginBottom: 4 }}>{u.use}</div>
                <div style={{ color: M, fontSize: "min(1.4vw, 14px)", lineHeight: 1.5 }}>{u.desc}</div>
              </div>
            </div>
          ))}
          <div style={{ background: "#1A0D3D", borderRadius: 14, padding: "3.5% 5%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: VL, fontSize: "min(1.5vw, 15px)", fontWeight: 600 }}>Contact</span>
            <span style={{ color: W, fontSize: "min(1.6vw, 16px)", fontWeight: 700 }}>xvault.dev · founders@xvault.dev</span>
          </div>
        </div>
      </div>
    </Slide>
  );
}

/* ═══════════════════════════════════════════
   PASSWORD GATE
═══════════════════════════════════════════ */
function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const attempt = () => {
    if (pw === DECK_PASSWORD) {
      onUnlock();
    } else {
      setError(true);
      setPw("");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: sans,
    }}>
      <div style={{ textAlign: "center", maxWidth: 400 }}>
        <div style={{ color: V, fontSize: 40, marginBottom: 24 }}>◈</div>
        <h1 style={{ color: W, fontSize: 28, fontWeight: 700, margin: "0 0 8px" }}>XVault Studio</h1>
        <p style={{ color: M, fontSize: 16, margin: "0 0 40px" }}>Pitch Deck — Confidential</p>
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
          <input
            type="password"
            placeholder="Enter access code"
            value={pw}
            onChange={e => { setPw(e.target.value); setError(false); }}
            onKeyDown={e => e.key === "Enter" && attempt()}
            style={{
              background: C1, border: `1px solid ${error ? "#EF4444" : "#2A2320"}`, borderRadius: 10,
              padding: "14px 18px", color: W, fontSize: 16, outline: "none", fontFamily: sans,
            }}
          />
          {error && <p style={{ color: "#EF4444", fontSize: 13, margin: 0 }}>Incorrect access code.</p>}
          <button
            onClick={attempt}
            style={{
              background: V, color: "#fff", border: "none", borderRadius: 10,
              padding: "14px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: sans,
            }}
          >
            View Deck →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function PitchDeckPage() {
  const [unlocked, setUnlocked] = useState(false);

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;

  return (
    <>
      <style>{``}</style>

      {/* ── Toolbar (hidden on print) ── */}
      <div className="no-print" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(13,11,10,0.92)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #2A2320", padding: "14px 32px",
        display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: sans,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: V, fontSize: 18 }}>◈</span>
          <span style={{ color: W, fontSize: 15, fontWeight: 700 }}>XVault Studio</span>
          <span style={{ color: "#3C3530", fontSize: 13, marginLeft: 4 }}>— Pitch Deck · Confidential</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ color: M, fontSize: 13, alignSelf: "center" }}>18 slides · Fully editable in Google Slides</span>
          <a
            href="/api/pitch-deck"
            download="xvault-pitch-deck-2026.pptx"
            style={{
              background: V, color: "#fff", border: "none", borderRadius: 8,
              padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: sans,
              textDecoration: "none", display: "inline-block",
            }}
          >
            Download PPTX →
          </a>
        </div>
      </div>

      {/* ── Slides ── */}
      <div className="deck-wrapper" style={{ paddingTop: 57, background: "#0D0B0A", minHeight: "100vh" }}>
        <S01 /><S02 /><S03 /><S04_Shipped /><S04 />
        <S05 /><S06 /><S07 /><S08 />
        <S09 /><S10 /><S11 /><S12 />
        <S13 /><S14 /><S15 /><S17_Team /><S16 />
      </div>
    </>
  );
}
