import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Handles the Supabase auth callback (magic link / PKCE code exchange).
 * After exchanging the code for a session, redirects to the xvault:// deep link
 * so the Tauri desktop app can pick up the session.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const errorParam = url.searchParams.get("error");

  if (errorParam) {
    return NextResponse.redirect(
      new URL(`/auth?error=${encodeURIComponent(errorParam)}`, request.url)
    );
  }

  if (!code) {
    return NextResponse.redirect(new URL("/auth?error=no_code", request.url));
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { session },
    error,
  } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !session) {
    return NextResponse.redirect(
      new URL("/auth?error=session_exchange_failed", request.url)
    );
  }

  const { access_token, refresh_token } = session;
  const deepLink = `xvault://auth?access_token=${encodeURIComponent(access_token)}&refresh_token=${encodeURIComponent(refresh_token)}`;

  // Serve an HTML page that tries the deep link and shows a fallback for browser users
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://xvault.dev";
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Opening XVault Studio…</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #06070a;
      color: #f5f7fb;
      font-family: ui-sans-serif, system-ui, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      text-align: center;
      padding: 2rem;
    }
    .card {
      max-width: 420px;
      width: 100%;
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 1.5rem;
      padding: 2.5rem 2rem;
      background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02));
    }
    .icon {
      width: 56px; height: 56px;
      border-radius: 50%;
      border: 1px solid rgba(159,245,214,0.2);
      background: rgba(159,245,214,0.08);
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 1.25rem;
      font-size: 1.5rem;
    }
    h1 { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.03em; margin-bottom: 0.75rem; }
    p { color: rgba(245,247,251,0.55); font-size: 0.9rem; line-height: 1.6; }
    .fallback { display: none; margin-top: 1.5rem; }
    a { color: #9ff5d6; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .btn {
      display: inline-block;
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.05);
      color: rgba(245,247,251,0.8);
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
    }
    .btn:hover { background: rgba(255,255,255,0.09); text-decoration: none; }
    .spinner {
      width: 20px; height: 20px;
      border: 2px solid rgba(159,245,214,0.3);
      border-top-color: #9ff5d6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
  <script>
    window.addEventListener('DOMContentLoaded', function() {
      var deepLink = ${JSON.stringify(deepLink)};
      window.location.href = deepLink;
      setTimeout(function() {
        document.getElementById('fallback').style.display = 'block';
        document.getElementById('spinner').style.display = 'none';
      }, 2500);
    });
  </script>
</head>
<body>
  <div class="card">
    <div class="icon">✦</div>
    <div id="spinner" class="spinner"></div>
    <h1>Opening XVault Studio…</h1>
    <p>Handing your session to the desktop app.</p>
    <div id="fallback" class="fallback">
      <p>The app didn't open automatically.</p>
      <p style="margin-top:0.5rem">Make sure XVault Studio is installed, then try the link below.</p>
      <a href="${deepLink.replace(/&/g, "&amp;")}" class="btn">Open XVault Studio</a>
      <br />
      <a href="${siteUrl}/dashboard" style="display:block;margin-top:1rem;font-size:0.8rem;color:rgba(245,247,251,0.4)">
        Continue in browser →
      </a>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
