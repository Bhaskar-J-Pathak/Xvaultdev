import { randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { trackDownloadEvent } from "@/lib/analytics";
import { downloadConfig, isDownloadPlatform } from "@/lib/downloads";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ platform: string }> }
) {
  const { platform } = await context.params;

  if (!isDownloadPlatform(platform)) {
    return NextResponse.json({ error: "Unknown platform" }, { status: 404 });
  }

  const config = downloadConfig[platform];

  if (!config.href) {
    return NextResponse.json(
      {
        error: `Missing download URL for ${config.label}`,
        env: `DOWNLOAD_URL_${platform.toUpperCase()}`,
      },
      { status: 503 }
    );
  }

  const requestId = request.cookies.get("xvault_did")?.value ?? randomUUID();

  try {
    await trackDownloadEvent({
      platform,
      destination: config.href,
      requestId,
    });
  } catch (error) {
    console.error("Failed to track download event", error);
  }

  const response = NextResponse.redirect(config.href, { status: 307 });
  response.cookies.set("xvault_did", requestId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  return response;
}
