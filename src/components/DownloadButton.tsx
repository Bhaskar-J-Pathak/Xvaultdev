"use client";

import { ArrowUpRight } from "lucide-react";

type DownloadButtonProps = {
  label: string;
  meta: string;
  platform: "windows" | "mac" | "linux";
  featured?: boolean;
};

function PlatformIcon({ platform }: { platform: "windows" | "mac" | "linux" }) {
  if (platform === "windows") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 5.548l7.066-.966v6.823H3V5.548zm0 12.904l7.066.966v-6.823H3v5.857zm7.873 1.075L21 21V12.605h-10.127v6.922zM10.873 4.473L21 3v8.395h-10.127V4.473z" />
      </svg>
    );
  }
  if (platform === "mac") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.504 0c-.155 0-.311.003-.467.008a12.025 12.025 0 0 0-.893.042c-.533.037-1.14.14-1.433.39-.297.252-.382.609-.382 1.006v.12c-.03.324.164.734.525 1.043.18.154.435.28.763.28h.007c.156 0 .311-.003.467-.008a12.025 12.025 0 0 0 .893-.042c.533-.037 1.14-.14 1.433-.39.297-.252.382-.609.382-1.006V1.323c.03-.324-.164-.734-.525-1.043A1.374 1.374 0 0 0 12.504 0zM12 5.5a6.5 6.5 0 0 0-6.464 5.773C5.2 11.115 5 11.043 5 11a7 7 0 0 1 14 0c0 .043-.2.115-.536.273A6.5 6.5 0 0 0 12 5.5zm0 1a5.5 5.5 0 0 1 5.5 5.5c0 4.142-2.462 7.5-5.5 7.5s-5.5-3.358-5.5-7.5A5.5 5.5 0 0 1 12 6.5zm0 2a1 1 0 0 0-1 1v1.5h-1.5a1 1 0 1 0 0 2H11V14.5a1 1 0 1 0 2 0V13h1.5a1 1 0 1 0 0-2H13V9.5a1 1 0 0 0-1-1z" />
    </svg>
  );
}

export default function DownloadButton({
  label,
  meta,
  platform,
  featured = false,
}: DownloadButtonProps) {
  return (
    <a
      href={`/api/download/${platform}`}
      className={`group inline-flex min-w-[220px] items-center justify-between rounded-full border px-5 py-4 text-left transition-all duration-300 ${
        featured
          ? "btn-shimmer pulse-glow border-white/20 bg-white text-black shadow-[0_20px_60px_rgba(255,255,255,0.12)] hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(255,255,255,0.18)]"
          : "border-white/12 bg-white/6 text-white hover:-translate-y-1 hover:border-white/24 hover:bg-white/10"
      }`}
    >
      <span className="flex items-center gap-3">
        <span className={`transition-transform duration-300 group-hover:scale-110 ${featured ? "text-black/50" : "text-white/40"}`}>
          <PlatformIcon platform={platform} />
        </span>
        <span>
          <span className="block text-[0.7rem] uppercase tracking-[0.24em] text-current/55">
            Download for
          </span>
          <span className="mt-1 block text-lg font-semibold tracking-tight">
            {label}
          </span>
        </span>
      </span>
      <span className="flex items-center gap-3">
        <span className="text-xs text-current/60">{meta}</span>
        <ArrowUpRight
          className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          aria-hidden="true"
        />
      </span>
    </a>
  );
}
