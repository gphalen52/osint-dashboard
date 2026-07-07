import fetch from "node-fetch";

/**
 * Queries crt.sh (Certificate Transparency log search) for subdomains
 * associated with a given domain. No API key required.
 */
export async function lookupCrtSh(domain) {
  const url = `https://crt.sh/?q=${encodeURIComponent(domain)}&output=json`;

  const response = await fetch(url, {
    headers: { "User-Agent": "osint-dashboard/1.0" },
  });

  if (!response.ok) {
    throw new Error(`crt.sh responded with status ${response.status}`);
  }

  const raw = await response.json();

  // crt.sh returns duplicate entries per cert + newline-separated SANs.
  // Flatten and de-duplicate into a clean subdomain list.
  const subdomains = new Set();
  for (const entry of raw) {
    const names = entry.name_value.split("\n");
    for (const name of names) {
      subdomains.add(name.trim().toLowerCase());
    }
  }

  return {
    source: "crt.sh",
    status: "ok",
    data: {
      domain,
      subdomainCount: subdomains.size,
      subdomains: Array.from(subdomains).sort(),
    },
  };
}
