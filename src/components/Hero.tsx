"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const Antigravity = dynamic(() => import("@/components/ui/Antigravity"), {
  ssr: false,
  loading: () => null,
});

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Platform = "windows" | "mac" | "linux";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "windows";
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes("mac")) return "mac";
  if (ua.includes("linux")) return "linux";
  return "windows";
}

const platformLabel: Record<Platform, string> = {
  windows: "Download for Windows",
  mac: "Download for macOS",
  linux: "Download for Linux",
};

export default function Hero() {
  const [platform, setPlatform] = useState<Platform>("windows");

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden bg-white">
      {/* Antigravity — full bleed background */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <Antigravity
          count={600}
          magnetRadius={13}
          ringRadius={10}
          waveSpeed={0.7}
          waveAmplitude={2.5}
          particleSize={0.7}
          lerpSpeed={0.08}
          color="#151414"
          autoAnimate
          particleVariance={1.7}
          rotationSpeed={0}
          depthFactor={0.3}
          pulseSpeed={3}
          particleShape="capsule"
          fieldStrength={14}
        />
      </div>

      {/* Left white fade — keeps headline readable */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(105deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.82) 38%, rgba(255,255,255,0.18) 62%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1380px] items-center gap-12 px-6 pb-16 pt-24 lg:grid-cols-2 lg:gap-24 lg:px-10">

        {/* ── Left — headline only ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.75, ease }}
        >
          <h1 className="font-display text-display text-stone-900">
            The AI Story OS
            <br />
            <em className="gradient-text not-italic">for Novelists.</em>
          </h1>
        </motion.div>

        {/* ── Right — single 3D download button ── */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease }}
          className="flex flex-col items-start lg:items-center"
        >
          <a
            href={`/api/download/${platform}`}
            className="btn-3d btn-shimmer rounded-2xl bg-stone-950 px-10 py-5 text-[0.9375rem] font-semibold tracking-wide text-white"
          >
            {platformLabel[platform]}
          </a>
          <p className="mt-4 text-xs text-stone-400">
            Free — 300 AI credits included. No card needed.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
