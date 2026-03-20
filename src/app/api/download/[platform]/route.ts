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

  const githubToken = process.env.GITHUB_TOKEN;
  const upstream = await fetch(config.href, {
    redirect: "follow",
    headers: githubToken ? { Authorization: `Bearer ${githubToken}` } : {},
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "Asset unavailable", status: upstream.status },
      { status: 502 }
    );
  }

  const headers = new Headers({
    "Content-Type": "application/octet-stream",
    "Content-Disposition": `attachment; filename="${config.fileName}"`,
    "Cache-Control": "no-store",
  });

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);

  headers.set(
    "Set-Cookie",
    `xvault_did=${requestId}; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}; Path=/${process.env.NODE_ENV === "production" ? "; Secure" : ""}`
  );

  return new Response(upstream.body, { headers });
}
