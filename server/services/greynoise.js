import fetch from "node-fetch";

/**
 * Queries GreyNoise's Community API for a given IP address.
 * Tells you whether an IP is known internet "noise" (mass scanners,
 * research crawlers, botnets) versus something more targeted.
 * Requires GREYNOISE_API_KEY in .env (free Community tier).
 */
export async function lookupGreyNoise(ip) {
  const apiKey = process.env.GREYNOISE_API_KEY;

  if (!apiKey || apiKey === "your_greynoise_key_here") {
    return {
      source: "greynoise",
      status: "error",
      error: "GREYNOISE_API_KEY is not configured on the server.",
    };
  }

  const url = `https://api.greynoise.io/v3/community/${encodeURIComponent(ip)}`;

  const response = await fetch(url, {
    headers: { key: apiKey },
  });

  // GreyNoise returns 404 for IPs it has no record of at all — that's a
  // valid, meaningful result (not an error), so handle it explicitly.
  if (response.status === 404) {
    return {
      source: "greynoise",
      status: "ok",
      data: {
        ip,
        noise: false,
        riot: false,
        classification: "unknown",
        message: "No GreyNoise record for this IP.",
      },
    };
  }

  if (response.status === 401) {
    return {
      source: "greynoise",
      status: "error",
      error: "GreyNoise API key was rejected (check it's valid and active).",
    };
  }

  if (!response.ok) {
    throw new Error(`GreyNoise responded with status ${response.status}`);
  }

  const raw = await response.json();

  return {
    source: "greynoise",
    status: "ok",
    data: {
      ip: raw.ip,
      // true = seen scanning/crawling the internet at large
      noise: raw.noise || false,
      // true = known benign business service (Google, Slack, etc.)
      riot: raw.riot || false,
      // "malicious" | "benign" | "unknown"
      classification: raw.classification || "unknown",
      name: raw.name || null,
      lastSeen: raw.last_seen || null,
      link: raw.link || null,
      message: raw.message || null,
    },
  };
}