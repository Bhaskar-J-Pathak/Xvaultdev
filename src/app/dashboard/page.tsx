import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser, getProfile } from "@/lib/auth";
import { PLAN_LIMITS, PLAN_LABELS, TRIAL_CREDITS, isInTrial } from "@/lib/supabase";
import type { Profile } from "@/lib/supabase";
import DashboardClient from "./DashboardClient";

function daysUntil(dateStr: string): number {
  return Math.max(
    0,
    Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000)
  );
}

function daysUntilReset(resetAt: string): number {
  const reset = new Date(resetAt);
  const next = new Date(reset);
  next.setMonth(next.getMonth() + 1);
  return daysUntil(next.toISOString());
}

function planBadgeColor(plan: Profile["plan"]) {
  switch (plan) {
    case "ultra":
      return "border-purple-500/30 bg-purple-500/10 text-purple-300";
    case "pro_plus":
      return "border-[#9ff5d6]/30 bg-[#9ff5d6]/8 text-[#9ff5d6]";
    case "pro":
      return "border-blue-500/30 bg-blue-500/10 text-blue-300";
    default:
      return "border-white/12 bg-white/6 text-white/60";
  }
}

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/auth");

  const profile = await getProfile(user.id);

  // If profile doesn't exist yet (new user), show skeleton-safe defaults
  const safeProfile: Profile = profile ?? {
    id: user.id,
    email: user.email ?? "",
    plan: "free",
    ai_requests_this_month: 0,
    ai_requests_total: 0,
    requests_reset_at: new Date().toISOString(),
    trial_ends_at: null,
  };

  const inTrial = isInTrial(safeProfile);
  const limit = inTrial ? TRIAL_CREDITS : PLAN_LIMITS[safeProfile.plan];
  const used = inTrial
    ? safeProfile.ai_requests_total
    : safeProfile.ai_requests_this_month;
  const progressPct = Math.min(100, Math.round((used / limit) * 100));

  const trialDaysLeft = safeProfile.trial_ends_at
    ? daysUntil(safeProfile.trial_ends_at)
    : 0;

  const resetDaysLeft = daysUntilReset(safeProfile.requests_reset_at);

  const planLabel = inTrial
    ? "Free Trial"
    : PLAN_LABELS[safeProfile.plan];

  return (
    <DashboardClient
      email={safeProfile.email || user.email || ""}
      plan={safeProfile.plan}
      planLabel={planLabel}
      inTrial={inTrial}
      used={used}
      limit={limit}
      progressPct={progressPct}
      trialDaysLeft={trialDaysLeft}
      resetDaysLeft={resetDaysLeft}
      planBadgeColor={planBadgeColor(safeProfile.plan)}
    />
  );
}
