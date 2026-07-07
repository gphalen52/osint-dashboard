import { useState } from "react";
import DossierCard from "./DossierCard.jsx";
import SignalBars from "./SignalBars.jsx";

const PREVIEW_COUNT = 12;

export default function CrtShPanel({ result }) {
  const { status, error, data } = result;
  const [expanded, setExpanded] = useState(false);

  const subdomains = data?.subdomains || [];
  const visible = expanded ? subdomains : subdomains.slice(0, PREVIEW_COUNT);
  const level = subdomains.length > 40 ? 3 : subdomains.length > 10 ? 2 : subdomains.length > 0 ? 1 : 0;

  return (
    <DossierCard source="crt.sh" status={status} error={error}>
      {data && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">
              {data.subdomainCount} subdomain
              {data.subdomainCount === 1 ? "" : "s"} found via certificate
              transparency logs
            </p>
            <SignalBars level={level} label="exposure" />
          </div>

          {subdomains.length > 0 && (
            <>
              <ul className="grid sm:grid-cols-2 gap-1">
                {visible.map((sub) => (
                  <li
                    key={sub}
                    className="font-mono text-xs text-ink bg-graphite border border-hairline rounded px-2 py-1 truncate"
                  >
                    {sub}
                  </li>
                ))}
              </ul>
              {subdomains.length > PREVIEW_COUNT && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs font-mono text-signal hover:underline"
                >
                  {expanded
                    ? "Show less"
                    : `Show ${subdomains.length - PREVIEW_COUNT} more`}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </DossierCard>
  );
}
