import { redirect } from "next/navigation";
import { getUser, getProfile } from "@/lib/auth";
import { PLAN_LABELS, isInTrial } from "@/lib/supabase";
import AccountClient from "./AccountClient";
import type { Profile } from "@/lib/supabase";

export default async function AccountPage() {
  const user = await getUser();
  if (!user) redirect("/auth");

  const profile = await getProfile(user.id);

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
  const planLabel = inTrial ? "Free Trial" : PLAN_LABELS[safeProfile.plan];

  // Compute next billing date (first of next month approximation)
  const resetAt = new Date(safeProfile.requests_reset_at);
  const nextBilling = new Date(resetAt);
  nextBilling.setMonth(nextBilling.getMonth() + 1);
  const nextBillingStr = nextBilling.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <AccountClient
      email={safeProfile.email || user.email || ""}
      plan={safeProfile.plan}
      planLabel={planLabel}
      inTrial={inTrial}
      nextBillingDate={nextBillingStr}
    />
  );
}
