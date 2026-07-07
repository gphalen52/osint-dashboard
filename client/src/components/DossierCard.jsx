export default function DossierCard({ source, status, error, children }) {
  return (
    <div className="bg-panel border border-hairline rounded overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-hairline bg-graphite/40">
        <span className="font-display text-xs font-semibold tracking-[0.15em] text-muted uppercase">
          Source: {source}
        </span>
        <span
          className={`text-xs font-mono uppercase tracking-wide ${
            status === "ok" ? "text-info" : "text-alert"
          }`}
        >
          {status === "ok" ? "● resolved" : "● failed"}
        </span>
      </div>
      <div className="p-4">
        {status === "error" ? (
          <p className="text-alert text-sm font-mono">{error}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
