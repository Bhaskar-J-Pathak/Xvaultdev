import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "XVault Studio — Pitch Deck",
  robots: { index: false, follow: false },
};

export default function PitchDeckLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
