import { createBrowserClient } from "@supabase/ssr";

export interface Profile {
  id: string;
  email: string;
  plan: "free" | "pro" | "pro_plus" | "ultra";
  ai_requests_this_month: number;
  ai_requests_total: number;
  requests_reset_at: string;
  trial_ends_at: string | null;
}

export const PLAN_LIMITS: Record<Profile["plan"], number> = {
  free: 50,
  pro: 500,
  pro_plus: 2000,
  ultra: 10000,
};

export const PLAN_LABELS: Record<Profile["plan"], string> = {
  free: "Free",
  pro: "Pro",
  pro_plus: "Pro+",
  ultra: "Ultra",
};

export const TRIAL_CREDITS = 300;

export function isInTrial(profile: Profile): boolean {
  if (!profile.trial_ends_at) return false;
  return (
    new Date(profile.trial_ends_at) > new Date() &&
    profile.ai_requests_total < TRIAL_CREDITS
  );
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
