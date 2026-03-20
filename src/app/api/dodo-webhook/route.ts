import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "standardwebhooks";
import { createServiceClient } from "@/lib/auth";

type DodoPlan = "free" | "pro" | "pro_plus" | "ultra";

function productIdToPlan(productId: string): DodoPlan | null {
  if (productId === process.env.DODO_PRODUCT_PRO) return "pro";
  if (productId === process.env.DODO_PRODUCT_PRO_PLUS) return "pro_plus";
  if (productId === process.env.DODO_PRODUCT_ULTRA) return "ultra";
  return null;
}

export async function POST(request: NextRequest) {
  const secret = process.env.DODO_WEBHOOK_SECRET;
  if (!secret) {
    console.error("DODO_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const rawBody = await request.text();

  // Verify Standard Webhooks signature
  try {
    const wh = new Webhook(secret);
    wh.verify(rawBody, {
      "webhook-id": request.headers.get("webhook-id") ?? "",
      "webhook-timestamp": request.headers.get("webhook-timestamp") ?? "",
      "webhook-signature": request.headers.get("webhook-signature") ?? "",
    });
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: {
    type: string;
    data: {
      product_id?: string;
      metadata?: Record<string, string>;
      [key: string]: unknown;
    };
  };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { type, data } = event;
  const userId = data?.metadata?.userId ?? data?.metadata?.metadata_userId;

  if (!userId) {
    console.warn("Dodo webhook missing userId in metadata, event:", type);
    return NextResponse.json({ received: true });
  }

  const supabase = createServiceClient();

  if (type === "subscription.active") {
    const plan = productIdToPlan(data?.product_id ?? "");
    if (!plan) {
      console.warn("Unknown product_id:", data?.product_id);
      return NextResponse.json({ received: true });
    }
    const { error } = await supabase
      .from("profiles")
      .update({ plan })
      .eq("id", userId);

    if (error) {
      console.error("Failed to update plan:", error);
      return NextResponse.json({ error: "DB update failed" }, { status: 500 });
    }
    console.log(`User ${userId} upgraded to ${plan}`);
  } else if (type === "subscription.cancelled" || type === "subscription.expired") {
    const { error } = await supabase
      .from("profiles")
      .update({ plan: "free" })
      .eq("id", userId);

    if (error) {
      console.error("Failed to downgrade plan:", error);
      return NextResponse.json({ error: "DB update failed" }, { status: 500 });
    }
    console.log(`User ${userId} downgraded to free (${type})`);
  }

  return NextResponse.json({ received: true });
}
