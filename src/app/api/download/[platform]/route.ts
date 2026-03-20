import { randomUUID } from "crypto";

import { NextRequest, NextResponse } from "next/server";

import { trackDownloadEvent } from "@/lib/analytics";
import {
  downloadConfig,
  getAssetApiUrl,
  isDownloadPlatform,
} from "@/lib/downloads";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ platform: string }> }
) {
  const { platform } = await context.params;

  if (!isDownloadPlatform(platform)) {
    return NextResponse.json({ error: "Unknown platform" }, { status: 404 });
  }

  const config = downloadConfig[platform];

  if (!config.assetId) {
    return NextResponse.json(
      {
        error: `Missing asset ID for ${config.label}`,
        env: `DOWNLOAD_ASSET_ID_${platform.toUpperCase()}`,
      },
      { status: 503 }
    );
  }

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    return NextResponse.json(
      { error: "Server misconfigured: missing GITHUB_TOKEN" },
      { status: 503 }
    );
  }

  const requestId = request.cookies.get("xvault_did")?.value ?? randomUUID();

  try {
    await trackDownloadEvent({
      platform,
      destination: getAssetApiUrl(config.assetId),
      requestId,
    });
  } catch (error) {
    console.error("Failed to track download event", error);
  }

  // Step 1: call the GitHub API — it responds with a 302 to a signed S3 URL
  const apiRes = await fetch(getAssetApiUrl(config.assetId), {
    redirect: "manual",
    headers: {
      Authorization: `Bearer ${githubToken}`,
      Accept: "application/octet-stream",
    },
  });

  // GitHub returns 302; grab the signed S3 location
  const signedUrl = apiRes.headers.get("location");
  if (!signedUrl) {
    return NextResponse.json(
      { error: "Asset unavailable", status: apiRes.status },
      { status: 502 }
    );
  }

  // Step 2: fetch the signed URL without auth (S3 rejects extra auth headers)
  const upstream = await fetch(signedUrl);

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
