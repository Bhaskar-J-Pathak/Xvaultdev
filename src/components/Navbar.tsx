"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LayoutDashboard, LogOut, Menu, Settings, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, PLAN_LABELS } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

const navLinks = [
  { label: "Features",    href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing",     href: "/pricing" },
  { label: "FAQ",         href: "#faq" },
];

const BEZ = [0.16, 1, 0.3, 1] as [number, number, number, number];

// Desktop stagger variants
const desktopContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};
const desktopItem = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: BEZ } },
};

// Mobile overlay link variants
const overlayContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};
const overlayItem = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: BEZ } },
};

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [userOpen, setUserOpen]     = useState(false);
  const [user, setUser]             = useState<User | null>(null);
  const [profile, setProfile]       = useState<Pick<Profile, "plan"> | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      if (data.user) {
        supabase.from("profiles").select("plan").eq("id", data.user.id).single()
          .then(({ data: p }) => setProfile(p));
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) setProfile(null);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setUserOpen(false);
    setMenuOpen(false);
    router.refresh();
  }

  const planLabel = profile ? PLAN_LABELS[profile.plan] : null;

  return (
    <>
      {/* ── Main bar ── */}
      <nav
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled ? "px-3 pt-3" : "px-4 pt-4 lg:px-6 lg:pt-5"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1380px] items-center justify-between rounded-full px-5 py-3 transition-all duration-300 lg:px-7 ${
            scrolled
              ? "border border-black/8 bg-white/88 shadow-[0_4px_24px_rgba(0,0,0,0.07)] backdrop-blur-xl"
              : "border border-black/6 bg-white/52 backdrop-blur-sm"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 text-stone-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-stone-100 text-xs font-semibold tracking-[0.22em] text-stone-500">
              XV
            </span>
            <span className="font-display text-lg tracking-tight">
              XVault<span className="ml-1 text-stone-400">Studio</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <motion.div
            variants={desktopContainer}
            initial="hidden"
            animate="visible"
            className="hidden items-center gap-8 md:flex"
          >
            {navLinks.map((link) => (
              <motion.div key={link.href} variants={desktopItem}>
                <Link
                  href={link.href}
                  className="text-sm text-stone-500 transition-colors hover:text-stone-900"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Desktop right */}
          <motion.div
            variants={desktopContainer}
            initial="hidden"
            animate="visible"
            className="hidden items-center gap-3 md:flex"
          >
            {user ? (
              <motion.div variants={desktopItem} className="relative">
                <button
                  type="button"
                  onClick={() => setUserOpen((v) => !v)}
                  className="flex items-center gap-2.5 rounded-full border border-black/8 bg-stone-100 px-4 py-2 text-sm text-stone-600 transition-colors hover:bg-stone-200"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
                    {(user.email ?? "U").charAt(0).toUpperCase()}
                  </span>
                  {planLabel && <span className="text-xs text-stone-400">{planLabel}</span>}
                  <ChevronDown className={`h-3.5 w-3.5 text-stone-400 transition-transform duration-200 ${userOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border border-black/8 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
                    >
                      <div className="border-b border-black/6 px-4 py-3">
                        <div className="truncate text-xs font-medium text-stone-800">{user.email}</div>
                        {planLabel && <div className="mt-0.5 text-[0.68rem] text-stone-400">{planLabel} plan</div>}
                      </div>
                      <div className="p-1.5">
                        <Link href="/dashboard" onClick={() => setUserOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900">
                          <LayoutDashboard className="h-4 w-4" strokeWidth={1.6} />
                          Dashboard
                        </Link>
                        <Link href="/account" onClick={() => setUserOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-stone-600 transition-colors hover:bg-stone-50 hover:text-stone-900">
                          <Settings className="h-4 w-4" strokeWidth={1.6} />
                          Account settings
                        </Link>
                        <button onClick={handleSignOut}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-stone-400 transition-colors hover:bg-stone-50 hover:text-stone-700">
                          <LogOut className="h-4 w-4" strokeWidth={1.6} />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <>
                <motion.div variants={desktopItem}>
                  <Link href="/auth" className="text-sm text-stone-500 transition-colors hover:text-stone-900">
                    Sign in
                  </Link>
                </motion.div>
                <motion.div variants={desktopItem}>
                  <Link
                    href="/#download"
                    className="btn-shimmer inline-flex items-center rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    Get the app
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-black/8 bg-stone-100 text-stone-600 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* ── Fullscreen staggered mobile overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#FAFAF8]"
          >
            {/* Close button */}
            <div className="flex items-center justify-between px-6 pt-6">
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-stone-900">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-stone-100 text-xs font-semibold tracking-[0.22em] text-stone-500">
                  XV
                </span>
                <span className="font-display text-lg tracking-tight">
                  XVault<span className="ml-1 text-stone-400">Studio</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-stone-100 text-stone-600"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Staggered links */}
            <motion.nav
              variants={overlayContainer}
              initial="hidden"
              animate="visible"
              className="mt-16 flex flex-col gap-2 px-6"
            >
              {navLinks.map((link) => (
                <motion.div key={link.href} variants={overlayItem}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="menu-overlay-link block transition-colors"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div variants={overlayItem} className="mt-6 border-t border-black/8 pt-8">
                {user ? (
                  <div className="flex flex-col gap-4">
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                      className="text-xl font-semibold text-stone-600 transition-colors hover:text-stone-900">
                      Dashboard
                    </Link>
                    <button onClick={handleSignOut}
                      className="text-left text-xl font-semibold text-stone-400 transition-colors hover:text-stone-700">
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-5">
                    <Link href="/auth" onClick={() => setMenuOpen(false)}
                      className="text-xl font-semibold text-stone-600 transition-colors hover:text-stone-900">
                      Sign in
                    </Link>
                    <Link
                      href="/#download"
                      onClick={() => setMenuOpen(false)}
                      className="btn-shimmer inline-flex w-fit items-center rounded-full bg-stone-900 px-6 py-3 text-base font-semibold text-white"
                    >
                      Get the app
                    </Link>
                  </div>
                )}
              </motion.div>
            </motion.nav>

            {/* Bottom tagline */}
            <div className="absolute bottom-8 left-6 text-sm text-stone-400">
              The AI Story OS for Novelists
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
