import { NextResponse } from "next/server";
import pptxgen from "pptxgenjs";

/* ── palette (no #) ─────────────────────── */
const BG = "0D0B0A";
const V  = "7C3AED";
const VL = "A78BFA";
const W  = "FAFAF8";
const M  = "78716C";
const C1 = "141210";
const DV = "1A0D3D";
const AM = "D97706";
const GR = "4ADE80";
const RD = "EF4444";

const SW = 13.33;
const SH = 7.5;
const PL = 0.87;

type S = ReturnType<InstanceType<typeof pptxgen>["addSlide"]>;
type Pptx = InstanceType<typeof pptxgen>;

/* ────────────────────────────────────────
   HELPERS
──────────────────────────────────────── */
function base(s: S, n: number) {
  s.background = { color: BG };
  // left accent strip
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (s as any).addShape("rect", { x: 0, y: 0, w: 0.06, h: SH, fill: { color: V }, line: { type: "none" } });
  s.addText(`${String(n).padStart(2, "0")} / 18`, {
    x: SW - 1.2, y: SH - 0.38, w: 1.1, h: 0.28,
    fontSize: 8, color: "3C3530", fontFace: "Arial", align: "right",
  });
}

function secLabel(s: S, text: string, x: number, y: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (s as any).addShape("rect", { x, y: y + 0.1, w: 0.22, h: 0.015, fill: { color: V }, line: { type: "none" } });
  s.addText(text, { x: x + 0.32, y, w: 6, h: 0.25, fontSize: 8, bold: true, color: V, fontFace: "Arial", charSpacing: 2.5 });
}

function h1(s: S, text: string, x: number, y: number, w: number, size = 36, color = W): number {
  const lines = text.split("\n").length;
  const ht = ((size * 1.2) / 72) * lines + 0.12;
  s.addText(text, { x, y, w, h: ht, fontSize: size, bold: true, color, fontFace: "Arial", charSpacing: -0.4, lineSpacingMultiple: 1.1, wrap: true });
  return y + ht;
}

function para(s: S, text: string, x: number, y: number, w: number, size = 13, color = M): number {
  const approxLines = Math.max(Math.ceil(text.length / (w * 9)), 1);
  const ht = Math.max((approxLines * size * 1.55) / 72, 0.3);
  s.addText(text, { x, y, w, h: ht, fontSize: size, color, fontFace: "Arial", wrap: true, lineSpacingMultiple: 1.45 });
  return y + ht + 0.05;
}

function box(s: S, x: number, y: number, w: number, h: number, fill = C1, border?: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (s as any).addShape("rect", {
    x, y, w, h,
    fill: { color: fill },
    line: border ? { color: border, pt: 0.8 } : { type: "none" },
    rectRadius: 0.08,
  });
}

function dot(s: S, x: number, y: number, color = V) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (s as any).addShape("ellipse", { x, y, w: 0.07, h: 0.07, fill: { color }, line: { type: "none" } });
}

function bullets(s: S, items: string[], x: number, y: number, w: number, dotColor = V, size = 11): number {
  let cy = y;
  for (const item of items) {
    dot(s, x, cy + 0.07, dotColor);
    s.addText(item, { x: x + 0.18, y: cy, w: w - 0.18, h: 0.3, fontSize: size, color: M, fontFace: "Arial", wrap: true });
    cy += 0.32;
  }
  return cy;
}

function checks(s: S, items: string[], x: number, y: number, w: number, cc = GR, size = 11): number {
  let cy = y;
  for (const item of items) {
    s.addText("✓", { x, y: cy, w: 0.22, h: 0.28, fontSize: size, color: cc, fontFace: "Arial", bold: true });
    s.addText(item, { x: x + 0.22, y: cy, w: w - 0.22, h: 0.28, fontSize: size, color: M, fontFace: "Arial", wrap: true });
    cy += 0.31;
  }
  return cy;
}

function greenBadge(s: S, text: string, x: number, y: number, w: number) {
  box(s, x, y, w, 0.4, "0F2A0F", "1A4D1A");
  s.addText(text, { x: x + 0.15, y, w: w - 0.2, h: 0.4, fontSize: 9.5, color: GR, fontFace: "Arial", bold: true, valign: "middle" });
}

function indevBadge(s: S, text: string, x: number, y: number) {
  const bw = text.length * 0.083 + 0.28;
  box(s, x, y, bw, 0.26, "2A1500");
  s.addText(text, { x: x + 0.1, y, w: bw - 0.1, h: 0.26, fontSize: 8, bold: true, color: AM, fontFace: "Arial", valign: "middle" });
}

function topStripe(s: S, x: number, y: number, w: number, color: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (s as any).addShape("rect", { x, y, w, h: 0.04, fill: { color }, line: { type: "none" } });
}

/* ────────────────────────────────────────
   SLIDE 01 — COVER
──────────────────────────────────────── */
function s01(pptx: Pptx) {
  const s = pptx.addSlide();
  base(s, 1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (s as any).addShape("rect", { x: 6.5, y: 0, w: 6.83, h: SH, fill: { color: DV }, line: { type: "none" } });
  secLabel(s, "PRE-SEED ROUND — 2026", PL, 0.65);
  h1(s, "XVault Studio", PL, 1.05, 9.5, 60);
  s.addText("The AI Story OS for Novelists & Screenwriters", {
    x: PL, y: 2.65, w: 9, h: 0.6, fontSize: 26, color: VL, fontFace: "Arial", bold: true, charSpacing: -0.3,
  });
  const stats: [string, string][] = [["TAM", "$4.2B"], ["SAM", "$1.05B"], ["MRR Target Y3", "$1M+"]];
  stats.forEach(([label, val], i) => {
    const x = PL + i * 3.1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (s as any).addShape("rect", { x, y: 3.55, w: 0.03, h: 0.85, fill: { color: V }, line: { type: "none" } });
    s.addText(label, { x: x + 0.14, y: 3.55, w: 2.7, h: 0.28, fontSize: 8, color: M, fontFace: "Arial", bold: true, charSpacing: 2 });
    s.addText(val, { x: x + 0.14, y: 3.88, w: 2.7, h: 0.52, fontSize: 22, color: W, fontFace: "Arial", bold: true });
  });
  s.addText("xvault.dev", { x: PL, y: 6.25, w: 3, h: 0.35, fontSize: 13, color: M, fontFace: "Arial", charSpacing: 2 });
}

/* ────────────────────────────────────────
   SLIDE 02 — PROBLEM
──────────────────────────────────────── */
function s02(pptx: Pptx) {
  const s = pptx.addSlide();
  base(s, 2);
  secLabel(s, "THE PROBLEM", PL, 0.52);
  h1(s, "Writers have no intelligent infrastructure.", PL, 0.87, 11, 34);
  const probs = [
    ["01", "No continuity safety net", "A 100K-word novel has hundreds of characters, timelines, and plot threads. One contradiction in chapter 3 can break the story by chapter 22. No tool catches this automatically."],
    ["02", "The medium gap", "A finished novel is worth far more as a screenplay, webtoon, or game — but adapting it requires a completely different skill set. Most writers can't do it. Hiring costs thousands."],
    ["03", "AI tools are amnesiac", "ChatGPT, Claude, Jasper — they generate text but don't understand your story: who the characters are, what happened in chapter 5, what threads are unresolved. They forget everything."],
  ];
  const cw = 3.82;
  probs.forEach(([n, title, body], i) => {
    const x = PL + i * (cw + 0.19);
    box(s, x, 2.1, cw, 4.85);
    topStripe(s, x, 2.1, cw, V);
    s.addText(n, { x: x + 0.24, y: 2.28, w: 0.5, h: 0.25, fontSize: 8, color: V, fontFace: "Arial", bold: true, charSpacing: 2 });
    s.addText(title, { x: x + 0.24, y: 2.6, w: cw - 0.45, h: 0.65, fontSize: 15.5, color: W, fontFace: "Arial", bold: true, wrap: true });
    s.addText(body, { x: x + 0.24, y: 3.35, w: cw - 0.45, h: 3.3, fontSize: 11.5, color: M, fontFace: "Arial", wrap: true, lineSpacingMultiple: 1.4 });
  });
}

/* ────────────────────────────────────────
   SLIDE 03 — SOLUTION
──────────────────────────────────────── */
function s03(pptx: Pptx) {
  const s = pptx.addSlide();
  base(s, 3);
  secLabel(s, "THE SOLUTION", PL, 0.52);
  h1(s, "A writing IDE that\nknows your story.", PL, 0.87, 5.5, 36);
  s.addText("XVault builds a living knowledge graph of your story as you write — and uses it to power an AI that actually understands your world.", {
    x: PL, y: 2.78, w: 5.5, h: 0.9, fontSize: 13, color: M, fontFace: "Arial", wrap: true, lineSpacingMultiple: 1.4,
  });
  const pillars = [
    ["◈", "World Graph", "Extracts characters, locations, events and maps relationships in real time. The memory layer your AI needs."],
    ["✦", "Co-Author AI", "Full manuscript context. Makes changes anywhere, suggests plot moves, catches contradictions as you write."],
    ["⇌", "Adaptation Engine", "Novel → screenplay → webtoon → game narrative in one click. No equivalent exists anywhere."],
  ];
  pillars.forEach(([icon, title, desc], i) => {
    const y = 0.6 + i * 2.18;
    box(s, 6.75, y, 6.05, 1.98);
    s.addText(icon, { x: 7.05, y: y + 0.37, w: 0.6, h: 0.6, fontSize: 22, color: V, fontFace: "Arial" });
    s.addText(title, { x: 7.75, y: y + 0.18, w: 4.8, h: 0.38, fontSize: 15, color: W, fontFace: "Arial", bold: true });
    s.addText(desc, { x: 7.75, y: y + 0.62, w: 4.8, h: 1.1, fontSize: 11.5, color: M, fontFace: "Arial", wrap: true, lineSpacingMultiple: 1.4 });
  });
}

/* ────────────────────────────────────────
   SLIDE 04 — JUST SHIPPED
──────────────────────────────────────── */
function s04Shipped(pptx: Pptx) {
  const s = pptx.addSlide();
  base(s, 4);
  greenBadge(s, "● MVP Launched — March 23, 2026", PL, 0.5, 3.6);
  h1(s, "Fully functional.\nShipped last week.", PL, 1.05, 5.5, 34);
  para(s, "Mac · Windows · Linux. Hybrid offline + background sync. Every core feature is live and working end-to-end. This is not a prototype.", PL, 2.82, 5.5, 13);
  box(s, PL, 3.88, 5.5, 1.45);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (s as any).addShape("rect", { x: PL, y: 3.88, w: 0.04, h: 1.45, fill: { color: V }, line: { type: "none" } });
  s.addText('"The first desktop AI Story OS that automatically builds and maintains a living knowledge graph of your entire world as you write — locally, in real time."', {
    x: PL + 0.28, y: 4.02, w: 5.0, h: 1.15, fontSize: 11.5, color: VL, fontFace: "Arial", italic: true, wrap: true, lineSpacingMultiple: 1.4,
  });
  const items = [
    ["Zen editor", "Lexical-based, full manuscript"], ["Live World Graph", "Auto-extracts entities & relations"],
    ["Co-Author AI", "Full context, voice-matched"], ["Dead Branch Detection", "Real-time plot hole alerts"],
    ["Global Entity Replace", "Rename across 80K words instantly"], ["Sprint Mode + Ambience", "Focus tools writers love"],
    ["Web platform + Auth", "OTP → deep link to desktop app"], ["Subscriptions live", "Free → Pro → Pro+ → Ultra"],
    ["AI infrastructure", "Cloudflare edge, model-routed"],
  ];
  const cw = (SW - 6.85 - 0.5 - 0.3) / 3;
  items.forEach(([label, sub], i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 6.85 + col * (cw + 0.15);
    const y = 0.48 + row * 2.2;
    box(s, x, y, cw, 2.0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (s as any).addShape("rect", { x, y, w: 0.03, h: 2.0, fill: { color: V }, line: { type: "none" } });
    s.addText("✓ " + label, { x: x + 0.14, y: y + 0.12, w: cw - 0.2, h: 0.3, fontSize: 11, color: W, fontFace: "Arial", bold: true });
    s.addText(sub, { x: x + 0.14, y: y + 0.48, w: cw - 0.2, h: 0.8, fontSize: 9.5, color: M, fontFace: "Arial", wrap: true });
  });
}

/* ────────────────────────────────────────
   SLIDE 05 — PRODUCT DEMO
──────────────────────────────────────── */
function s05Demo(pptx: Pptx) {
  const s = pptx.addSlide();
  base(s, 5);
  secLabel(s, "PRODUCT DEMO", PL, 0.52);
  const bx = PL, by = 1.05, bw = SW - PL - 0.5, bh = 5.5;
  box(s, bx, by, bw, bh, C1, "2A2320");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (s as any).addShape("ellipse", { x: bx + bw / 2 - 0.55, y: by + bh / 2 - 0.6, w: 1.1, h: 1.1, fill: { color: V }, line: { type: "none" } });
  s.addText("▶", { x: bx + bw / 2 - 0.28, y: by + bh / 2 - 0.35, w: 0.65, h: 0.65, fontSize: 20, color: W, fontFace: "Arial", align: "center" });
  s.addText("Full product walkthrough", { x: bx + bw / 2 - 2.5, y: by + bh / 2 + 0.42, w: 5, h: 0.45, fontSize: 20, color: W, fontFace: "Arial", bold: true, align: "center" });
  s.addText("xvault.dev/demo", { x: bx + bw / 2 - 2.5, y: by + bh / 2 + 0.92, w: 5, h: 0.35, fontSize: 14, color: M, fontFace: "Arial", align: "center" });
  // corner labels
  [[bx + 0.2, by + 0.2, "Zen Editor"], [bx + bw - 1.55, by + 0.2, "World Graph"],
   [bx + 0.2, by + bh - 0.45, "Co-Author AI"], [bx + bw - 1.9, by + bh - 0.45, "Dead Branch Alerts"]
  ].forEach(([cx, cy, txt]) => {
    const lw = (txt as string).length * 0.09 + 0.28;
    box(s, cx as number, cy as number, lw, 0.26, DV);
    s.addText(txt as string, { x: (cx as number) + 0.1, y: cy as number, w: lw - 0.1, h: 0.26, fontSize: 9, color: VL, fontFace: "Arial", bold: true, valign: "middle" });
  });
  s.addText("📌  Replace this placeholder with your product demo video in Google Slides", {
    x: PL, y: SH - 0.38, w: SW - PL - 0.2, h: 0.28, fontSize: 9, color: "4A3530", fontFace: "Arial", italic: true,
  });
}

/* ────────────────────────────────────────
   SLIDE 06 — WORLD BUILDER
──────────────────────────────────────── */
function s06WorldBuilder(pptx: Pptx) {
  const s = pptx.addSlide();
  base(s, 6);
  box(s, PL, 0.5, 1.5, 0.27, DV);
  s.addText("FEATURE 01", { x: PL + 0.1, y: 0.5, w: 1.35, h: 0.27, fontSize: 8, color: VL, fontFace: "Arial", bold: true, charSpacing: 2, valign: "middle" });
  h1(s, "Automatic\nWorld Builder", PL, 0.95, 5.5, 34);
  para(s, "As you write, XVault extracts every character, location, faction, and event — and maps their relationships in a live knowledge graph. No tagging, no manual entry required.", PL, 2.72, 5.5, 13);
  greenBadge(s, "✓  Not available in any other writing tool — including AI-native ones.", PL, 3.82, 5.5);
  const entities = [
    ["Kael Dra'eth", "Protagonist · Mage", "12"],
    ["The Obsidian Keep", "Fortress · Ch.3–8", "7"],
    ["The Ash Covenant", "Antagonist · Political", "9"],
  ];
  entities.forEach(([name, tags, rels], i) => {
    const y = 0.55 + i * 1.65;
    box(s, 6.8, y, 6, 1.5);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (s as any).addShape("ellipse", { x: 7.1, y: y + 0.45, w: 0.6, h: 0.6, fill: { color: DV }, line: { type: "none" } });
    s.addText(name, { x: 7.88, y: y + 0.18, w: 3.8, h: 0.38, fontSize: 14, color: W, fontFace: "Arial", bold: true });
    s.addText(tags, { x: 7.88, y: y + 0.62, w: 3.8, h: 0.3, fontSize: 10, color: VL, fontFace: "Arial" });
    s.addText("Relations", { x: 11.55, y: y + 0.28, w: 1.05, h: 0.25, fontSize: 9, color: M, fontFace: "Arial" });
    s.addText(rels, { x: 11.55, y: y + 0.58, w: 1.05, h: 0.5, fontSize: 24, color: V, fontFace: "Arial", bold: true });
  });
  box(s, 6.8, 5.65, 6, 0.5, DV);
  s.addText("Graph auto-updates as you type", { x: 7.05, y: 5.72, w: 3, h: 0.35, fontSize: 11, color: VL, fontFace: "Arial" });
  s.addText("47 entities · 183 relations", { x: 10.15, y: 5.72, w: 2.45, h: 0.35, fontSize: 12, color: W, fontFace: "Arial", bold: true, align: "right" });
}

/* ────────────────────────────────────────
   SLIDE 07 — CO-AUTHOR
──────────────────────────────────────── */
function s07CoAuthor(pptx: Pptx) {
  const s = pptx.addSlide();
  base(s, 7);
  const msgs: [string, string][] = [
    ["ai", "I noticed you haven't resolved the Obsidian Key subplot from Ch.3. Kael found it but never used it — this is a dead branch. Want me to weave it into Ch.12?"],
    ["user", "Yes, and make the ending of chapter 11 foreshadow it."],
    ["ai", "Updated Ch.11 para 4: \"Kael's hand brushed the cold iron key at his belt — the one thing from the Keep he hadn't yet understood.\" Preview → Apply?"],
  ];
  let cy = 0.5;
  msgs.forEach(([from, text]) => {
    const isAi = from === "ai";
    const bx = isAi ? PL : PL + 0.5;
    const bw = 5.0;
    const h = Math.max(Math.ceil(text.length / 46) * 0.29 + 0.22, 0.52);
    box(s, bx, cy, bw, h, isAi ? DV : "2A2320");
    s.addText(text, { x: bx + 0.18, y: cy + 0.07, w: bw - 0.32, h: h - 0.12, fontSize: 10.5, color: isAi ? VL : W, fontFace: "Arial", wrap: true, lineSpacingMultiple: 1.38 });
    cy += h + 0.15;
  });
  box(s, 6.8, 0.5, 1.5, 0.27, DV);
  s.addText("FEATURE 02", { x: 6.9, y: 0.5, w: 1.35, h: 0.27, fontSize: 8, color: VL, fontFace: "Arial", bold: true, charSpacing: 2, valign: "middle" });
  h1(s, "Co-Author AI", 6.8, 0.95, 5.85, 38);
  para(s, "Not a writing assistant. An actual co-author. It holds your entire manuscript in context, makes changes anywhere, and proactively surfaces ideas — without being asked.", 6.8, 2.55, 5.85, 13);
  bullets(s, ["Full manuscript context — not just the current chapter", "Makes targeted edits anywhere in the document", "Proactively flags issues and suggests plot moves", "Knows your characters, their voice, their history"], 6.8, 4.05, 5.85);
}

/* ────────────────────────────────────────
   SLIDE 08 — ONE-CLICK ADAPTATION
──────────────────────────────────────── */
function s08Adapt(pptx: Pptx) {
  const s = pptx.addSlide();
  base(s, 8);
  box(s, PL, 0.5, 1.5, 0.27, DV);
  s.addText("FEATURE 03", { x: PL + 0.1, y: 0.5, w: 1.35, h: 0.27, fontSize: 8, color: VL, fontFace: "Arial", bold: true, charSpacing: 2, valign: "middle" });
  indevBadge(s, "IN DEVELOPMENT", PL + 1.68, 0.5);
  h1(s, "One-Click\nAdaptation", PL, 0.95, 5.5, 34);
  para(s, "A novelist can't turn their novel into a webtoon or screenplay themselves. Now they can — in one click. No equivalent exists in any tool on the market.", PL, 2.72, 5.5, 13);
  greenBadge(s, "✓  Expands TAM from novelists → all storytelling mediums", PL, 3.82, 5.5);
  const formats = [
    ["🎬", "Screenplay", "Final Draft-style. Scene headings, action lines, dialogue blocks."],
    ["🎨", "Webtoon Outline", "Panel-by-panel scene breakdown with visual beat descriptions."],
    ["🎮", "Game Narrative", "Branching dialogue, quest structure, character flags."],
    ["🎙️", "Podcast Script", "Audio drama format with SFX cues and voiceover instructions."],
  ];
  formats.forEach(([, title, desc], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 6.75 + col * 3.22, y = 0.5 + row * 3.48;
    box(s, x, y, 3.0, 3.2);
    s.addText(title as string, { x: x + 0.22, y: y + 0.48, w: 2.58, h: 0.4, fontSize: 15, color: W, fontFace: "Arial", bold: true });
    s.addText(desc as string, { x: x + 0.22, y: y + 0.98, w: 2.58, h: 2.0, fontSize: 11.5, color: M, fontFace: "Arial", wrap: true, lineSpacingMultiple: 1.4 });
  });
}

/* ────────────────────────────────────────
   SLIDE 09 — DEAD BRANCH DETECTION
──────────────────────────────────────── */
function s09DeadBranch(pptx: Pptx) {
  const s = pptx.addSlide();
  base(s, 9);
  box(s, PL, 0.48, 6.05, 4.05);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (s as any).addShape("ellipse", { x: PL + 0.24, y: 0.76, w: 0.13, h: 0.13, fill: { color: RD }, line: { type: "none" } });
  s.addText("DEAD BRANCH DETECTED", { x: PL + 0.5, y: 0.69, w: 5.2, h: 0.28, fontSize: 9, color: RD, fontFace: "Arial", bold: true, charSpacing: 1.5 });
  s.addText("The Obsidian Key — introduced Ch.3, unresolved", { x: PL + 0.24, y: 1.12, w: 5.6, h: 0.38, fontSize: 14, color: W, fontFace: "Arial", bold: true });
  s.addText("Kael found the Obsidian Key in the Keep vault (Ch.3 p.47). Referenced again in Ch.7. Never explained or used. 9 chapters remain open.", { x: PL + 0.24, y: 1.6, w: 5.58, h: 0.88, fontSize: 11.5, color: M, fontFace: "Arial", wrap: true, lineSpacingMultiple: 1.4 });
  box(s, PL + 0.24, 2.7, 2.05, 0.42, DV);
  s.addText("Suggest resolution →", { x: PL + 0.35, y: 2.73, w: 1.9, h: 0.35, fontSize: 10.5, color: VL, fontFace: "Arial", bold: true, valign: "middle" });
  box(s, PL + 2.42, 2.7, 1.85, 0.42, "2A2320");
  s.addText("Mark as intentional", { x: PL + 2.52, y: 2.73, w: 1.7, h: 0.35, fontSize: 10.5, color: M, fontFace: "Arial", valign: "middle" });
  const stats: [string, string, string][] = [["Dead branches", "3", RD], ["Continuity warnings", "7", AM], ["Active threads", "14", GR]];
  stats.forEach(([label, val, color], i) => {
    const x = PL + i * 2.05;
    box(s, x, 4.72, 1.9, 1.38);
    s.addText(label, { x: x + 0.15, y: 4.88, w: 1.62, h: 0.28, fontSize: 9.5, color: M, fontFace: "Arial" });
    s.addText(val, { x: x + 0.15, y: 5.22, w: 1.62, h: 0.65, fontSize: 28, color, fontFace: "Arial", bold: true });
  });
  box(s, 6.8, 0.5, 1.5, 0.27, DV);
  s.addText("FEATURE 04", { x: 6.9, y: 0.5, w: 1.35, h: 0.27, fontSize: 8, color: VL, fontFace: "Arial", bold: true, charSpacing: 2, valign: "middle" });
  box(s, 6.8 + 1.68, 0.5, 1.4, 0.27, "0F2A0F");
  s.addText("LIVE IN APP", { x: 6.8 + 1.78, y: 0.5, w: 1.25, h: 0.27, fontSize: 8, color: GR, fontFace: "Arial", bold: true, valign: "middle" });
  h1(s, "Dead Branch\nDetection", 6.8, 0.95, 5.85, 34);
  para(s, "Plot threads you introduced and never resolved. Continuity breaks. Character contradictions. XVault catches them automatically, in real time, as you write.", 6.8, 2.7, 5.85, 13);
  para(s, "A human editor charges $2,000–$5,000 for a single continuity pass on a 100K-word novel. XVault does it continuously, free, as you draft.", 6.8, 4.2, 5.85, 13);
}

/* ────────────────────────────────────────
   SLIDE 10 — MARKETPLACE
──────────────────────────────────────── */
function s10Marketplace(pptx: Pptx) {
  const s = pptx.addSlide();
  base(s, 10);
  box(s, PL, 0.5, 1.5, 0.27, DV);
  s.addText("FEATURE 05", { x: PL + 0.1, y: 0.5, w: 1.35, h: 0.27, fontSize: 8, color: VL, fontFace: "Arial", bold: true, charSpacing: 2, valign: "middle" });
  indevBadge(s, "PLANNED — Q3 2027", PL + 1.68, 0.5);
  h1(s, "World\nMarketplace", PL, 0.95, 5.5, 34);
  para(s, "Writers export their knowledge graph — characters, relationships, magic systems, lore — as a \"World Pack\" and sell it to other writers. We take 25%.", PL, 2.72, 5.5, 13);
  s.addText("75%", { x: PL, y: 4.05, w: 2, h: 0.75, fontSize: 36, color: GR, fontFace: "Arial", bold: true });
  s.addText("Creator keeps", { x: PL, y: 4.85, w: 2, h: 0.28, fontSize: 11, color: M, fontFace: "Arial" });
  s.addText("25%", { x: PL + 2.5, y: 4.05, w: 2, h: 0.75, fontSize: 36, color: V, fontFace: "Arial", bold: true });
  s.addText("XVault takes", { x: PL + 2.5, y: 4.85, w: 2, h: 0.28, fontSize: 11, color: M, fontFace: "Arial" });
  const packs: [string, string, string, string][] = [
    ["Medieval Fantasy Pack", "200 entities · 500 relations · 3 magic systems", "$4.99", "342"],
    ["Cyberpunk Megacity Pack", "180 entities · 420 relations · 5 corps · 8 districts", "$2.99", "218"],
    ["Wuxia Realm — Official Canon", "Fan fiction starter pack from published author", "$9.99", "107"],
  ];
  packs.forEach(([name, desc, price, dl], i) => {
    const y = 0.55 + i * 1.68;
    box(s, 6.8, y, 6.05, 1.52);
    s.addText(name, { x: 7.05, y: y + 0.17, w: 3.85, h: 0.38, fontSize: 14, color: W, fontFace: "Arial", bold: true });
    s.addText(desc, { x: 7.05, y: y + 0.62, w: 3.85, h: 0.55, fontSize: 10.5, color: M, fontFace: "Arial", wrap: true });
    s.addText(price, { x: 11.38, y: y + 0.18, w: 1.22, h: 0.45, fontSize: 18, color: V, fontFace: "Arial", bold: true });
    s.addText(dl + " downloads", { x: 11.38, y: y + 0.68, w: 1.22, h: 0.3, fontSize: 9.5, color: M, fontFace: "Arial" });
  });
  box(s, 6.8, 5.72, 6.05, 0.88, DV);
  s.addText("Why VCs love marketplaces:", { x: 7.05, y: 5.82, w: 5.5, h: 0.28, fontSize: 11, color: VL, fontFace: "Arial", bold: true });
  s.addText("Network effects · Data moat · Creator economy · Roblox/Unity Asset Store pattern applied to storytelling", { x: 7.05, y: 6.14, w: 5.5, h: 0.35, fontSize: 10, color: M, fontFace: "Arial", wrap: true });
}

/* ────────────────────────────────────────
   SLIDE 11 — MARKET
──────────────────────────────────────── */
function s11Market(pptx: Pptx) {
  const s = pptx.addSlide();
  base(s, 11);
  secLabel(s, "MARKET OPPORTUNITY", PL, 0.48);
  h1(s, "A real, reachable market — built bottom-up.", PL, 0.82, 12, 30);
  // hero
  box(s, PL, 1.7, SW - PL - 0.5, 1.52);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (s as any).addShape("rect", { x: PL, y: 1.7, w: 0.04, h: 1.52, fill: { color: V }, line: { type: "none" } });
  s.addText("BOTTOM-UP STARTING POINT", { x: PL + 0.3, y: 1.82, w: 5, h: 0.25, fontSize: 7.5, color: M, fontFace: "Arial", bold: true, charSpacing: 2 });
  s.addText("2M+ indie authors", { x: PL + 0.3, y: 2.1, w: 5, h: 0.65, fontSize: 30, color: W, fontFace: "Arial", bold: true });
  s.addText("actively publishing on Amazon KDP today", { x: PL + 0.3, y: 2.8, w: 5, h: 0.3, fontSize: 12, color: VL, fontFace: "Arial", bold: true });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (s as any).addShape("rect", { x: PL + 6.2, y: 1.88, w: 0.01, h: 1.18, fill: { color: "2A2320" }, line: { type: "none" } });
  s.addText("AI writing tool spend growing 40% YoY — $500M+ category in 2026", { x: PL + 6.6, y: 1.85, w: 5.6, h: 0.38, fontSize: 10.5, color: M, fontFace: "Arial", wrap: true });
  s.addText("Grammarly: 30M paid users proves writers pay for productivity tools", { x: PL + 6.6, y: 2.42, w: 5.6, h: 0.38, fontSize: 10.5, color: M, fontFace: "Arial", wrap: true });
  const markets = [
    { tier: "TAM", val: "$4.2B", sub: "8M novelists + 2M scriptwriters × $35/mo", items: ["Scrivener 1M+ paid", "NaNoWriMo 500K/yr", "WGA 11.5K active pros"], color: V },
    { tier: "SAM", val: "$1.05B", sub: "2.5M English-speaking digital-first writers", items: ["3M+ KDP active authors", "AI tool adoption accelerating", "Desktop price tolerance high"], color: VL },
    { tier: "SOM Year 3", val: "$12M ARR", sub: "25K users × $40 blended ARPU = $1M MRR", items: ["0.5% of SAM — very conservative", "Ulysses ~$5M ARR at year 5 (comparable)"], color: GR },
  ];
  const cw = 3.84;
  markets.forEach((m, i) => {
    const x = PL + i * (cw + 0.19);
    box(s, x, 3.4, cw, 3.65);
    topStripe(s, x, 3.4, cw, m.color);
    s.addText(m.tier, { x: x + 0.2, y: 3.55, w: cw - 0.3, h: 0.25, fontSize: 8, color: m.color, fontFace: "Arial", bold: true, charSpacing: 2 });
    s.addText(m.val, { x: x + 0.2, y: 3.85, w: cw - 0.3, h: 0.65, fontSize: 26, color: W, fontFace: "Arial", bold: true });
    s.addText(m.sub, { x: x + 0.2, y: 4.58, w: cw - 0.3, h: 0.55, fontSize: 10, color: M, fontFace: "Arial", wrap: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (s as any).addShape("rect", { x: x + 0.2, y: 5.22, w: cw - 0.42, h: 0.01, fill: { color: "2A2320" }, line: { type: "none" } });
    bullets(s, m.items, x + 0.2, 5.35, cw - 0.35, m.color, 10);
  });
}

/* ────────────────────────────────────────
   SLIDE 12 — REVENUE PATH
──────────────────────────────────────── */
function s12Revenue(pptx: Pptx) {
  const s = pptx.addSlide();
  base(s, 12);
  secLabel(s, "REVENUE PATH", PL, 0.48);
  h1(s, "Path to $1M MRR in 30 months.", PL, 0.82, 12, 30);
  const phases = [
    { phase: "Phase 1", time: "0–12 months", target: "$190K MRR", metrics: "5,000 paid users · SaaS only", lines: ["Pro ($20): 2,500 users", "Pro+ ($60): 1,500 users", "Ultra ($200): 1,000 users"], color: VL },
    { phase: "Phase 2", time: "12–24 months", target: "$695K MRR", metrics: "15,000 users + Marketplace live", lines: ["SaaS base: ~$570K MRR", "Marketplace GMV $500K × 25% = $125K", "CAC drops via writer word-of-mouth"], color: V },
    { phase: "Phase 3", time: "24–30 months", target: "$1M+ MRR", metrics: "22,000 users + Marketplace + Enterprise", lines: ["SaaS base: ~$836K MRR", "Marketplace: $150K MRR", "3 enterprise × $10K/mo = $30K"], color: GR },
  ];
  const cw = 3.84;
  phases.forEach((p, i) => {
    const x = PL + i * (cw + 0.19);
    box(s, x, 2.05, cw, 4.88);
    topStripe(s, x, 2.05, cw, p.color);
    s.addText(p.phase, { x: x + 0.2, y: 2.22, w: 2, h: 0.25, fontSize: 8, color: p.color, fontFace: "Arial", bold: true, charSpacing: 2 });
    s.addText(p.time, { x: x + 0.2, y: 2.52, w: cw - 0.3, h: 0.25, fontSize: 10, color: M, fontFace: "Arial" });
    s.addText(p.target, { x: x + 1.5, y: 2.18, w: cw - 1.72, h: 0.55, fontSize: 22, color: W, fontFace: "Arial", bold: true, align: "right" });
    box(s, x + 0.2, 2.9, cw - 0.4, 0.38, DV);
    s.addText(p.metrics, { x: x + 0.35, y: 2.93, w: cw - 0.65, h: 0.3, fontSize: 9.5, color: VL, fontFace: "Arial", valign: "middle" });
    p.lines.forEach((l, li) => {
      dot(s, x + 0.2, 3.48 + li * 0.36 + 0.07, p.color);
      s.addText(l, { x: x + 0.38, y: 3.48 + li * 0.36, w: cw - 0.55, h: 0.3, fontSize: 10.5, color: M, fontFace: "Arial" });
    });
  });
  box(s, PL, 7.1, SW - PL - 0.5, 0.28);
  s.addText("Assumptions: CAC ~$15  ·  Churn ~4%/mo  ·  Blended ARPU $38  ·  No paid ads Phase 1", { x: PL + 0.2, y: 7.12, w: SW - PL - 0.7, h: 0.25, fontSize: 8.5, color: M, fontFace: "Arial" });
}

/* ────────────────────────────────────────
   SLIDE 13 — BUSINESS MODEL
──────────────────────────────────────── */
function s13BizModel(pptx: Pptx) {
  const s = pptx.addSlide();
  base(s, 13);
  secLabel(s, "BUSINESS MODEL", PL, 0.48);
  h1(s, "Three revenue streams. One flywheel.", PL, 0.82, 12, 30);
  const streams = [
    { name: "SaaS Subscriptions", tiers: [["Free", "$0", "300 trial credits"], ["Pro", "$20/mo", "500 credits/mo"], ["Pro+", "$60/mo", "2,000 credits · most popular"], ["Ultra", "$200/mo", "10,000 credits"]], note: "Recurring, predictable, low churn once writers are in their workflow.", color: V },
    { name: "World Marketplace", tiers: [["Pack sales", "$2–$10", "per world pack"], ["XVault cut", "25%", "of every transaction"], ["Network effect", "∞", "more packs = more value"]], note: "GMV-based. Self-reinforcing. Competitors can't replicate the pack library.", color: VL },
    { name: "Enterprise (B2B)", tiers: [["Publishers", "$5–50K/yr", "series consistency checker"], ["Game studios", "$10–100K/yr", "narrative tools + lore"], ["IP holders", "Custom", "franchise planning"]], note: "ARPU 250× higher than consumer. Unlocked after marketplace traction.", color: GR },
  ];
  const cw = 3.84;
  streams.forEach((str, i) => {
    const x = PL + i * (cw + 0.19);
    box(s, x, 1.95, cw, 5.15);
    topStripe(s, x, 1.95, cw, str.color);
    s.addText(str.name, { x: x + 0.2, y: 2.1, w: cw - 0.3, h: 0.32, fontSize: 11, color: str.color, fontFace: "Arial", bold: true, charSpacing: 0.8 });
    str.tiers.forEach((t, ti) => {
      const ty = 2.58 + ti * 0.78;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (s as any).addShape("rect", { x: x + 0.2, y: ty + 0.33, w: cw - 0.4, h: 0.01, fill: { color: "2A2320" }, line: { type: "none" } });
      s.addText(`${t[0]} · ${t[2]}`, { x: x + 0.2, y: ty, w: cw - 1.32, h: 0.3, fontSize: 10, color: M, fontFace: "Arial" });
      s.addText(t[1], { x: x + cw - 1.12, y: ty, w: 0.92, h: 0.3, fontSize: 12, color: W, fontFace: "Arial", bold: true, align: "right" });
    });
    const noteY = 2.58 + str.tiers.length * 0.78 + 0.22;
    s.addText(str.note, { x: x + 0.2, y: noteY, w: cw - 0.3, h: 1.1, fontSize: 10, color: M, fontFace: "Arial", wrap: true, lineSpacingMultiple: 1.4 });
  });
}

/* ────────────────────────────────────────
   SLIDE 14 — VISION
──────────────────────────────────────── */
function s14Vision(pptx: Pptx) {
  const s = pptx.addSlide();
  base(s, 14);
  secLabel(s, "THE VISION", PL, 0.48);
  s.addText("We're not a writing app.", { x: PL, y: 0.82, w: 12, h: 0.95, fontSize: 44, color: W, fontFace: "Arial", bold: true, charSpacing: -0.5 });
  s.addText("We're the creative infrastructure layer\nfor the next generation of storytelling.", { x: PL, y: 1.82, w: 12, h: 1.18, fontSize: 32, color: VL, fontFace: "Arial", bold: true, wrap: true, charSpacing: -0.3, lineSpacingMultiple: 1.1 });
  const steps = [
    { label: "NOW", title: "Writer Tool", sub: "Desktop IDE + AI", color: V },
    { label: "NEXT", title: "Reader Platform", sub: "Public stories + AI companion", color: VL },
    { label: "THEN", title: "Creator Economy", sub: "World Marketplace, 25% take rate", color: V },
    { label: "FUTURE", title: "Enterprise Layer", sub: "Publishers, studios, IP holders", color: VL },
    { label: "2028+", title: "Webtoon Studio", sub: "Native drawing + AI panel generation", color: AM },
  ];
  const sw = (SW - PL - 0.5) / steps.length - 0.1;
  steps.forEach((st, i) => {
    const x = PL + i * (sw + 0.12);
    box(s, x, 3.25, sw, 3.88, i % 2 === 0 ? C1 : "121010");
    s.addText(st.label, { x: x + 0.2, y: 3.45, w: sw - 0.28, h: 0.25, fontSize: 8, color: st.color, fontFace: "Arial", bold: true, charSpacing: 2 });
    s.addText(st.title, { x: x + 0.2, y: 3.8, w: sw - 0.28, h: 0.55, fontSize: 17, color: W, fontFace: "Arial", bold: true, wrap: true });
    s.addText(st.sub, { x: x + 0.2, y: 4.45, w: sw - 0.28, h: 0.88, fontSize: 11, color: M, fontFace: "Arial", wrap: true, lineSpacingMultiple: 1.35 });
  });
}

/* ────────────────────────────────────────
   SLIDE 15 — COMPETITION (CLEAN 2×2)
──────────────────────────────────────── */
function s15Competition(pptx: Pptx) {
  const s = pptx.addSlide();
  base(s, 15);
  secLabel(s, "COMPETITIVE LANDSCAPE", PL, 0.48);
  h1(s, "Every competitor solves one piece.\nWe're the only complete system — and the only desktop-native one.", PL, 0.82, 12, 26);
  const qw = (SW - PL - 0.5) / 2 - 0.12;
  const qs = [
    { title: "Scrivener / Word", sub: "Organization tools", desc: "Great for manuscript structure. Zero AI, zero world understanding, zero continuity checking. Built for the pre-AI era.", tags: [["✓", GR, "Organizes chapters"], ["✗", "4A3530", "No AI"], ["✗", "4A3530", "No world graph"], ["✗", "4A3530", "No dead branches"]], hl: false },
    { title: "ChatGPT / Claude / Gemini", sub: "General AI assistants", desc: "Brilliant at generating text. Completely amnesiac — no memory of your characters, your plot, your world. Every session starts from scratch.", tags: [["✓", GR, "Generates text"], ["✗", "4A3530", "No story memory"], ["✗", "4A3530", "Forgets everything"], ["✗", "4A3530", "Not a writing tool"]], hl: false },
    { title: "Sudowrite / NovelCrafter", sub: "AI writing assistants — closest competitors", desc: "Help with prose, offer basic story bibles. But web-based — no live world graph, no real-time dead branch detection, no adaptation engine.", tags: [["✓", GR, "AI writing help"], ["~", AM, "Basic story bibles only"], ["✗", "4A3530", "No live world graph"], ["✗", "4A3530", "No dead branch detection"]], hl: false },
    { title: "XVault Studio", sub: "AI Story OS — the gap we fill", desc: "The only tool that automatically builds a living knowledge graph as you write, catches dead branches in real time, and runs locally on your desktop.", tags: [["✓", GR, "Live world graph"], ["✓", GR, "Dead branch detection"], ["✓", GR, "Local + offline"], ["✓", GR, "Adaptation engine"]], hl: true },
  ] as const;
  qs.forEach((q, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = PL + col * (qw + 0.24);
    const y = 2.18 + row * 2.48;
    box(s, x, y, qw, 2.25, q.hl ? DV : C1, q.hl ? V : undefined);
    s.addText(q.title, { x: x + 0.2, y: y + 0.14, w: qw - 0.28, h: 0.38, fontSize: 14, color: W, fontFace: "Arial", bold: true });
    s.addText(q.sub, { x: x + 0.2, y: y + 0.55, w: qw - 0.28, h: 0.28, fontSize: 9.5, color: q.hl ? VL : AM, fontFace: "Arial", bold: true });
    s.addText(q.desc, { x: x + 0.2, y: y + 0.88, w: qw * 0.6, h: 1.2, fontSize: 10, color: M, fontFace: "Arial", wrap: true, lineSpacingMultiple: 1.35 });
    q.tags.forEach((t, ti) => {
      const tx = x + qw * 0.63;
      const ty = y + 0.72 + ti * 0.38;
      const tf = t[0] === "✓" ? "0F2A0F" : t[0] === "~" ? "2A1500" : "1A0A0A";
      box(s, tx, ty, qw * 0.36 - 0.1, 0.3, tf);
      s.addText(`${t[0]} ${t[2]}`, { x: tx + 0.06, y: ty, w: qw * 0.36 - 0.16, h: 0.3, fontSize: 8.5, color: t[1], fontFace: "Arial", valign: "middle", wrap: true });
    });
  });
}

/* ────────────────────────────────────────
   SLIDE 16 — WHAT WE'VE BUILT
──────────────────────────────────────── */
function s16Built(pptx: Pptx) {
  const s = pptx.addSlide();
  base(s, 16);
  secLabel(s, "TRACTION", PL, 0.48);
  h1(s, "The foundation is laid. Ready to acquire.", PL, 0.82, 12, 30);
  s.addText("Pre-revenue, pre-users. Full-stack product built, tested, working end-to-end. Raising to go from \"built\" to \"acquired 10,000 users.\"", { x: PL, y: 1.85, w: 11.5, h: 0.55, fontSize: 13, color: M, fontFace: "Arial", wrap: true });
  const cols = [
    { title: "Desktop App", tech: "Tauri v2 + Rust + ChromaDB", items: ["Zen editor (Lexical)", "Live world graph", "Co-Author AI + Ghost Write", "Dead Branch Detection", "Global replace, Sprint mode", "Ambience player, CorkBoard"], color: V },
    { title: "Web Platform", tech: "Next.js + Supabase + Dodo Payments", items: ["Landing page + marketing site", "Email OTP auth → deep link to app", "Dashboard, pricing, account pages", "Dodo Payments webhook", "Plan tiers: Free → Ultra"], color: VL },
    { title: "AI Infrastructure", tech: "Cloudflare Workers + Gemini 1.5 Pro", items: ["Model routing by plan tier", "Credit metering + monthly resets", "Brainstorm, Ghost Write, Continuity", "Context injection from world graph", "Zero latency via edge deployment"], color: GR },
  ];
  const cw = 3.84;
  cols.forEach((col, i) => {
    const x = PL + i * (cw + 0.19);
    box(s, x, 2.6, cw, 4.7);
    s.addText(col.tech, { x: x + 0.2, y: 2.75, w: cw - 0.3, h: 0.35, fontSize: 8, color: col.color, fontFace: "Arial", bold: true, charSpacing: 0.8, wrap: true });
    s.addText(col.title, { x: x + 0.2, y: 3.2, w: cw - 0.3, h: 0.42, fontSize: 15, color: W, fontFace: "Arial", bold: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (s as any).addShape("rect", { x: x + 0.2, y: 3.68, w: cw - 0.42, h: 0.01, fill: { color: "2A2320" }, line: { type: "none" } });
    checks(s, col.items, x + 0.2, 3.78, cw - 0.3, col.color, 10.5);
  });
}

/* ────────────────────────────────────────
   SLIDE 17 — TEAM
──────────────────────────────────────── */
function s17Team(pptx: Pptx) {
  const s = pptx.addSlide();
  base(s, 17);
  secLabel(s, "THE TEAM", PL, 0.48);
  h1(s, "Built by a writer\nwho ships.", PL, 0.82, 5.5, 34);
  para(s, "Solo founder. Novelist turned engineer. The 3,000+ rejections and dead plot branches I've personally written are the product spec for XVault. I built the tool I always needed.", PL, 2.62, 5.5, 13);
  box(s, PL, 3.72, 5.5, 1.5);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (s as any).addShape("rect", { x: PL, y: 3.72, w: 0.04, h: 1.5, fill: { color: V }, line: { type: "none" } });
  s.addText('"Full-stack desktop app, web platform, AI infrastructure, and payment system — all shipped solo in under 6 months. The pace doesn\'t slow down after funding, it accelerates."', {
    x: PL + 0.28, y: 3.86, w: 5.02, h: 1.22, fontSize: 11.5, color: VL, fontFace: "Arial", italic: true, wrap: true, lineSpacingMultiple: 1.4,
  });
  const pillars = [
    { area: "PRODUCT", items: ["Fiction writer — the primary user is me", "Understand pain points from lived experience", "Full MVP shipped solo in under 6 months"], color: V },
    { area: "ENGINEERING", items: ["Rust (Tauri), React, Next.js, TypeScript", "Cloudflare Workers, Supabase, ChromaDB", "AI integration: routing, credit metering, RAG pipeline"], color: VL },
    { area: "DISTRIBUTION", items: ["Embedded in NaNoWriMo, Royal Road, KDP communities", "Content-led growth from day 1 — organic only", "Knows how writers discover and share tools"], color: GR },
  ];
  pillars.forEach((p, i) => {
    const y = 0.48 + i * 2.28;
    box(s, 6.8, y, 6.05, 2.05);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (s as any).addShape("rect", { x: 6.8, y, w: 0.03, h: 2.05, fill: { color: p.color }, line: { type: "none" } });
    s.addText(p.area, { x: 7.05, y: y + 0.14, w: 5.5, h: 0.25, fontSize: 8, color: p.color, fontFace: "Arial", bold: true, charSpacing: 2 });
    p.items.forEach((item, ii) => {
      s.addText(`· ${item}`, { x: 7.05, y: y + 0.55 + ii * 0.38, w: 5.5, h: 0.35, fontSize: 11, color: M, fontFace: "Arial", wrap: true });
    });
  });
}

/* ────────────────────────────────────────
   SLIDE 18 — THE ASK
──────────────────────────────────────── */
function s18Ask(pptx: Pptx) {
  const s = pptx.addSlide();
  base(s, 18);
  secLabel(s, "THE ASK", PL, 0.48);
  s.addText("Joining", { x: PL, y: 0.82, w: 5.5, h: 0.88, fontSize: 46, color: W, fontFace: "Arial", bold: true, charSpacing: -0.5 });
  s.addText("Speedrun.", { x: PL, y: 1.7, w: 5.5, h: 0.88, fontSize: 46, color: V, fontFace: "Arial", bold: true, charSpacing: -0.5 });
  para(s, "MVP is live. Product is working. Goal for Speedrun: ship Marketplace v1, acquire the first 500 paying users, and hit $20K MRR in 12 weeks.", PL, 2.78, 5.5, 13);
  const goals: [string, string][] = [
    ["Week 1–3", "Launch to writing communities, first 50 paying users"],
    ["Week 4–8", "Ship One-Click Adaptation, reach 200 users"],
    ["Week 9–12", "Marketplace v1 live, 500 users, $20K MRR"],
  ];
  goals.forEach(([label, val], i) => {
    box(s, PL, 3.95 + i * 0.72, 1.1, 0.36, DV);
    s.addText(label, { x: PL + 0.1, y: 3.98 + i * 0.72, w: 0.95, h: 0.3, fontSize: 9, color: VL, fontFace: "Arial", bold: true, valign: "middle" });
    s.addText(val, { x: PL + 1.28, y: 3.98 + i * 0.72, w: 4.3, h: 0.3, fontSize: 11, color: M, fontFace: "Arial", valign: "middle" });
  });
  const funds: [string, string, string][] = [
    ["40%", "User Acquisition", "Writing communities, content marketing, influencer seeding"],
    ["30%", "Engineering", "One-Click Adaptation + Marketplace v1"],
    ["20%", "Operations", "Infrastructure, legal, design"],
    ["10%", "Reserve", "Runway buffer"],
  ];
  funds.forEach((u, i) => {
    const y = 0.48 + i * 1.5;
    box(s, 6.8, y, 6.05, 1.35);
    s.addText(u[0], { x: 6.95, y: y + 0.22, w: 1.12, h: 0.75, fontSize: 28, color: V, fontFace: "Arial", bold: true });
    s.addText(u[1], { x: 8.22, y: y + 0.14, w: 4.4, h: 0.38, fontSize: 14, color: W, fontFace: "Arial", bold: true });
    s.addText(u[2], { x: 8.22, y: y + 0.58, w: 4.4, h: 0.55, fontSize: 11, color: M, fontFace: "Arial", wrap: true });
  });
  box(s, 6.8, 6.55, 6.05, 0.62, DV);
  s.addText("Contact", { x: 7.05, y: 6.65, w: 1.5, h: 0.3, fontSize: 11, color: VL, fontFace: "Arial", bold: true });
  s.addText("xvault.dev  ·  founders@xvault.dev", { x: 9.1, y: 6.65, w: 3.55, h: 0.3, fontSize: 12, color: W, fontFace: "Arial", bold: true, align: "right" });
}

/* ────────────────────────────────────────
   ROUTE HANDLER
──────────────────────────────────────── */
export async function GET() {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.title = "XVault Studio — Pitch Deck 2026";
  pptx.author = "XVault Studio";
  pptx.subject = "Pre-Seed Pitch Deck — Confidential";

  s01(pptx); s02(pptx); s03(pptx); s04Shipped(pptx); s05Demo(pptx);
  s06WorldBuilder(pptx); s07CoAuthor(pptx); s08Adapt(pptx); s09DeadBranch(pptx); s10Marketplace(pptx);
  s11Market(pptx); s12Revenue(pptx); s13BizModel(pptx); s14Vision(pptx); s15Competition(pptx);
  s16Built(pptx); s17Team(pptx); s18Ask(pptx);

  const buffer = await pptx.write({ outputType: "nodebuffer" }) as Buffer;

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": 'attachment; filename="xvault-pitch-deck-2026.pptx"',
      "Cache-Control": "no-store",
    },
  });
}
