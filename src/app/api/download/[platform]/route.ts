import { randomUUID }      from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { trackDownloadEvent }        from "@/lib/analytics";
import { downloadConfig, GITHUB_REPO, isDownloadPlatform } from "@/lib/downloads";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ platform: string }> }
) {
  const { platform } = await context.params;

  if (!isDownloadPlatform(platform)) {
    return NextResponse.json({ error: "Unknown platform" }, { status: 404 });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    return NextResponse.json(
      { error: "Server misconfigured: missing GITHUB_TOKEN" },
      { status: 503 }
    );
  }

  const config = downloadConfig[platform];

  // Fetch the latest release and find the right asset by suffix.
  // Cache for 5 min so we don't hammer the GitHub API on every click.
  const releaseRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`,
    {
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "xvault.dev",
      },
      next: { revalidate: 300 },
    }
  );

  if (!releaseRes.ok) {
    return NextResponse.json(
      { error: "Could not fetch latest release from GitHub" },
      { status: 502 }
    );
  }

  const release = await releaseRes.json() as { assets: { id: number; name: string }[] };
  const asset   = release.assets.find((a) => a.name.endsWith(config.assetSuffix));

  if (!asset) {
    return NextResponse.json(
      { error: `No ${platform} asset found in latest release` },
      { status: 503 }
    );
  }

  const requestId = request.cookies.get("xvault_did")?.value ?? randomUUID();

  try {
    await trackDownloadEvent({
      platform,
      destination: `https://api.github.com/repos/${GITHUB_REPO}/releases/assets/${asset.id}`,
      requestId,
    });
  } catch (error) {
    console.error("Failed to track download event", error);
  }

  // GitHub responds with a 302 to a signed S3 URL — grab the Location header
  const apiRes = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/releases/assets/${asset.id}`,
    {
      redirect: "manual",
      headers: {
        Authorization: `Bearer ${githubToken}`,
        Accept: "application/octet-stream",
      },
    }
  );

  const signedUrl = apiRes.headers.get("location");
  if (!signedUrl) {
    return NextResponse.json(
      { error: "Asset unavailable", status: apiRes.status },
      { status: 502 }
    );
  }

  // Fetch from the signed S3 URL and stream back to the user
  const upstream = await fetch(signedUrl);
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json(
      { error: "Asset unavailable", status: upstream.status },
      { status: 502 }
    );
  }

  const headers = new Headers({
    "Content-Type":        "application/octet-stream",
    "Content-Disposition": `attachment; filename="${config.fileName}"`,
    "Cache-Control":       "no-store",
  });

  const contentLength = upstream.headers.get("content-length");
  if (contentLength) headers.set("Content-Length", contentLength);

  headers.set(
    "Set-Cookie",
    `xvault_did=${requestId}; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}; Path=/${
      process.env.NODE_ENV === "production" ? "; Secure" : ""
    }`
  );

  return new Response(upstream.body, { headers });
}
