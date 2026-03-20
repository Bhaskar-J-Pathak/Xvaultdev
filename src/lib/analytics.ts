type DownloadEventOptions = {
  platform: string;
  destination: string;
  requestId: string;
};

function baseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function trackDownloadEvent({
  platform,
  destination,
  requestId,
}: DownloadEventOptions) {
  const measurementId = process.env.GA_MEASUREMENT_ID;
  const apiSecret = process.env.GA_API_SECRET;

  if (!measurementId || !apiSecret) {
    return;
  }

  const url = new URL("https://www.google-analytics.com/mp/collect");
  url.searchParams.set("measurement_id", measurementId);
  url.searchParams.set("api_secret", apiSecret);

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: requestId,
      events: [
        {
          name: "download_app",
          params: {
            platform,
            destination,
            page_location: `${baseUrl()}/download/${platform}`,
            engagement_time_msec: 1,
          },
        },
      ],
    }),
    cache: "no-store",
  });
}
