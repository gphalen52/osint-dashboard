# Recon Dashboard

A passive OSINT recon tool that aggregates subdomain enumeration (crt.sh) and
host intelligence (Shodan) into a single search. Enter a domain and the
backend chains: subdomain lookup → DNS resolution → Shodan lookup on the
resolved IP, so one search does the work of several manual lookups.

## Stack

- **Backend:** Node + Express, rate-limited API proxy (keys never touch the client)
- **Frontend:** React + Vite + Tailwind

## Setup

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
# Edit .env and add your Shodan API key (free tier at https://account.shodan.io)
npm run dev
```

Server runs on `http://localhost:4000`. The `/api/crtsh` route works with no
key at all — good for testing immediately

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

Opens on `http://localhost:5173`, proxying `/api/*` to the backend.

## Endpoints

| Route | Description |
|---|---|
| `GET /api/crtsh/:domain` | Subdomain enumeration via certificate transparency logs |
| `GET /api/shodan/:ip` | Host lookup for a specific IP |
| `GET /api/investigate/:domain` | Correlated lookup: subdomains + DNS resolve + Shodan on resolved IP |

## Roadmap (not yet built)

- GreyNoise + VirusTotal integrations, added the same way as `shodan.js`
- SQLite-backed search history (currently in-memory/localStorage only)
- Attack-path graph view for AD-style relationship data (React Flow)
- PDF/JSON export of a full investigation

## Legal note

This tool is intended for authorized reconnaissance only — scoped pentest
engagements, bug bounty programs within their published scope, or your own
infrastructure. Querying third-party assets outside an authorized scope may
violate terms of service or law depending on jurisdiction.
