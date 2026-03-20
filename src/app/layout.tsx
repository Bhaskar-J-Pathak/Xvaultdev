import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { EB_Garamond } from "next/font/google";
import "./globals.css";

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "XVault Studio | The AI Story OS for Novelists",
  description:
    "XVault Studio is a desktop writing workspace for novelists — with real-time worldbuilding, dead-branch detection, global edits, and AI ghostwriting in your voice.",
  keywords: [
    "AI writing app",
    "novel writing software",
    "author productivity app",
    "worldbuilding software",
    "xvault studio",
    "AI story OS",
  ],
  authors: [{ name: "XVault Studio" }],
  creator: "XVault Studio",
  metadataBase: new URL("https://xvault.dev"),
  alternates: { canonical: "https://xvault.dev" },
  openGraph: {
    title: "XVault Studio | The AI Story OS for Novelists",
    description:
      "Real-time worldbuilding, dead-branch detection, and AI ghostwriting in your voice.",
    url: "https://xvault.dev",
    siteName: "XVault Studio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "XVault Studio | The AI Story OS for Novelists",
    description:
      "Real-time worldbuilding, dead-branch detection, and AI ghostwriting in your voice.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "XVault Studio",
              applicationCategory: "WritingApplication",
              operatingSystem: "Windows, macOS, Linux",
              description: "The AI Story OS for Novelists.",
              url: "https://xvault.dev",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description: "Free to start — 300 AI credits included",
              },
              publisher: {
                "@type": "Organization",
                name: "XVault Studio",
                url: "https://xvault.dev",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${garamond.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
