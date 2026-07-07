import fetch from "node-fetch";

/**
 * Queries Shodan's Host Lookup API for a given IP address.
 * Requires SHODAN_API_KEY in .env (free tier works).
 */
export async function lookupShodan(ip) {
  const apiKey = process.env.SHODAN_API_KEY;

  if (!apiKey || apiKey === "your_shodan_key_here") {
    return {
      source: "shodan",
      status: "error",
      error: "SHODAN_API_KEY is not configured on the server.",
    };
  }

  const url = `https://api.shodan.io/shodan/host/${encodeURIComponent(
    ip
  )}?key=${apiKey}`;

  const response = await fetch(url);

  if (response.status === 404) {
    return {
      source: "shodan",
      status: "ok",
      data: { ip, message: "No information available for this host." },
    };
  }

  if (!response.ok) {
    throw new Error(`Shodan responded with status ${response.status}`);
  }

  const raw = await response.json();

  return {
    source: "shodan",
    status: "ok",
    data: {
      ip: raw.ip_str,
      org: raw.org || "Unknown",
      country: raw.country_name || "Unknown",
      city: raw.city || null,
      operatingSystem: raw.os || null,
      ports: raw.ports || [],
      hostnames: raw.hostnames || [],
      // Trim each banner to keep payload size reasonable in the UI
      services: (raw.data || []).map((svc) => ({
        port: svc.port,
        transport: svc.transport,
        product: svc.product || null,
        banner: (svc.data || "").slice(0, 300),
      })),
      vulns: raw.vulns ? Object.keys(raw.vulns) : [],
    },
  };
}
