import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import dns from "node:dns/promises";

import crtshRouter from "./routes/crtsh.js";
import shodanRouter from "./routes/shodan.js";
import greynoiseRouter from "./routes/greynoise.js";
import virustotalRouter from "./routes/virustotal.js";
import { lookupCrtSh } from "./services/crtsh.js";
import { lookupShodan } from "./services/shodan.js";
import { lookupGreyNoise } from "./services/greynoise.js";
import { lookupVirusTotal } from "./services/virustotal.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Protects your API keys' rate limits from being burned by repeated
// front-end requests during dev, and guards against abuse in prod.
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    error: "Too many requests. Please wait a moment before searching again.",
  },
});
app.use("/api", limiter);

app.use("/api/crtsh", crtshRouter);
app.use("/api/shodan", shodanRouter);
app.use("/api/greynoise", greynoiseRouter);
app.use("/api/virustotal", virustotalRouter);

/**
 * Correlation endpoint: the "one search triggers a chain of lookups" feature.
 * Given a domain, this:
 *   1. Looks up subdomains via crt.sh
 *   2. Resolves the domain to an IP
 *   3. Runs a Shodan lookup on that resolved IP
 * Results are returned together so the frontend can render one unified view.
 */
app.get("/api/investigate/:domain", async (req, res) => {
  const { domain } = req.params;
  const results = { domain, sources: [] };

  // Subdomain enumeration and VirusTotal both key off the domain directly,
  // so neither depends on DNS resolution succeeding.
  try {
    const crtshResult = await lookupCrtSh(domain);
    results.sources.push(crtshResult);
  } catch (err) {
    results.sources.push({
      source: "crt.sh",
      status: "error",
      error: err.message,
    });
  }

  try {
    const virustotalResult = await lookupVirusTotal(domain);
    results.sources.push(virustotalResult);
  } catch (err) {
    results.sources.push({
      source: "virustotal",
      status: "error",
      error: err.message,
    });
  }

  // Resolve domain -> IP, then chain into Shodan + GreyNoise
  try {
    const addresses = await dns.resolve4(domain);
    const resolvedIp = addresses[0];
    results.resolvedIp = resolvedIp;

    const shodanResult = await lookupShodan(resolvedIp);
    results.sources.push(shodanResult);

    const greynoiseResult = await lookupGreyNoise(resolvedIp);
    results.sources.push(greynoiseResult);
  } catch (err) {
    results.sources.push({
      source: "shodan",
      status: "error",
      error: `Could not resolve or query host: ${err.message}`,
    });
  }

  res.json(results);
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`OSINT dashboard API running on http://localhost:${PORT}`);
});