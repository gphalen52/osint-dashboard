import { useState } from "react";
import SearchBar from "./components/SearchBar.jsx";
import ShodanPanel from "./components/ShodanPanel.jsx";
import CrtShPanel from "./components/CrtShPanel.jsx";

export default function App() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [history, setHistory] = useState([]);

  async function handleSearch(domain) {
    setIsLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch(`/api/investigate/${encodeURIComponent(domain)}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setResult(data);
      setHistory((prev) => [domain, ...prev.filter((d) => d !== domain)].slice(0, 8));
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  const crtshResult = result?.sources.find((s) => s.source === "crt.sh");
  const shodanResult = result?.sources.find((s) => s.source === "shodan");

  return (
    <div className="min-h-screen bg-graphite">
      <header className="border-b border-hairline">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <p className="font-display text-xs tracking-[0.2em] text-muted uppercase mb-1">
            Passive Recon
          </p>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Recon Dashboard
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />

        {history.length > 0 && !result && !isLoading && (
          <div className="flex flex-wrap gap-2">
            {history.map((d) => (
              <button
                key={d}
                onClick={() => handleSearch(d)}
                className="text-xs font-mono px-2.5 py-1 rounded border border-hairline text-muted hover:text-ink hover:border-signal/50 transition-colors"
              >
                {d}
              </button>
            ))}
          </div>
        )}

        {errorMsg && (
          <div className="border border-alert/40 bg-alert/10 rounded px-4 py-3 text-alert text-sm font-mono">
            {errorMsg}
          </div>
        )}

        {isLoading && (
          <div className="text-center py-16 text-muted font-mono text-sm">
            Querying sources…
          </div>
        )}

        {result && !isLoading && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-muted font-mono">
              <span className="text-ink">{result.domain}</span>
              {result.resolvedIp && (
                <>
                  <span>→</span>
                  <span className="text-info">{result.resolvedIp}</span>
                </>
              )}
            </div>

            {crtshResult && <CrtShPanel result={crtshResult} />}
            {shodanResult && <ShodanPanel result={shodanResult} />}
          </div>
        )}

        {!result && !isLoading && !errorMsg && (
          <div className="text-center py-16 text-muted text-sm">
            Enter a domain above to start a passive recon sweep.
          </div>
        )}
      </main>
    </div>
  );
}
