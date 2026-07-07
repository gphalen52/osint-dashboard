import DossierCard from "./DossierCard.jsx";
import SignalBars from "./SignalBars.jsx";

export default function ShodanPanel({ result }) {
  const { status, error, data } = result;

  if (status === "ok" && data?.message) {
    return (
      <DossierCard source="shodan" status={status}>
        <p className="text-muted text-sm font-mono">{data.message}</p>
      </DossierCard>
    );
  }

  const vulnCount = data?.vulns?.length || 0;
  const level = vulnCount > 3 ? 4 : vulnCount > 0 ? 3 : data?.ports?.length ? 1 : 0;

  return (
    <DossierCard source="shodan" status={status} error={error}>
      {data && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-lg text-ink">{data.ip}</p>
              <p className="text-sm text-muted">
                {data.org} — {data.city ? `${data.city}, ` : ""}
                {data.country}
              </p>
            </div>
            <SignalBars
              level={level}
              label={vulnCount > 0 ? `${vulnCount} vulns` : "clean"}
            />
          </div>

          {data.ports?.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted mb-1.5">
                Open ports
              </p>
              <div className="flex flex-wrap gap-1.5">
                {data.ports.map((port) => (
                  <span
                    key={port}
                    className="px-2 py-0.5 rounded bg-graphite border border-hairline font-mono text-xs text-info"
                  >
                    {port}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.vulns?.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted mb-1.5">
                Known CVEs
              </p>
              <div className="flex flex-wrap gap-1.5">
                {data.vulns.map((cve) => (
                  <span
                    key={cve}
                    className="px-2 py-0.5 rounded bg-alert/10 border border-alert/40 font-mono text-xs text-alert"
                  >
                    {cve}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.services?.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wide text-muted mb-1.5">
                Service banners
              </p>
              <div className="space-y-1.5">
                {data.services.map((svc, i) => (
                  <div
                    key={i}
                    className="bg-graphite border border-hairline rounded p-2 font-mono text-xs text-muted"
                  >
                    <span className="text-info">:{svc.port}</span>{" "}
                    {svc.product && (
                      <span className="text-ink">{svc.product}</span>
                    )}
                    <div className="truncate">{svc.banner}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </DossierCard>
  );
}
