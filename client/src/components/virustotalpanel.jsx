import DossierCard from "./DossierCard.jsx";
import SignalBars from "./SignalBars.jsx";

export default function VirusTotalPanel({ result }) {
  const { status, error, data } = result;

  if (data?.message) {
    return (
      <DossierCard source="virustotal" status={status}>
        <p className="text-muted text-sm font-mono">{data.message}</p>
      </DossierCard>
    );
  }

  if (!data) {
    return <DossierCard source="virustotal" status={status} error={error} />;
  }

  const { stats, reputation, categories } = data;
  const totalEngines =
    stats.malicious + stats.suspicious + stats.harmless + stats.undetected;

  const level =
    stats.malicious > 3
      ? 4
      : stats.malicious > 0
      ? 3
      : stats.suspicious > 0
      ? 2
      : 0;

  return (
    <DossierCard source="virustotal" status={status} error={error}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-lg text-ink">
            {stats.malicious + stats.suspicious} / {totalEngines}
            <span className="text-muted text-sm font-body"> engines flagged</span>
          </p>
          {categories.length > 0 && (
            <p className="text-sm text-muted mt-0.5">
              {categories.slice(0, 3).join(" · ")}
            </p>
          )}
          <p className="text-xs text-muted mt-1">
            Reputation score: {reputation}
          </p>
        </div>
        <SignalBars
          level={level}
          label={stats.malicious > 0 ? "flagged" : "clean"}
        />
      </div>
    </DossierCard>
  );
}