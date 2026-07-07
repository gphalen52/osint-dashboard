/**
 * The dashboard's signature element: a signal-strength indicator
 * (like a radar/signal bar readout) used in place of a generic
 * severity badge. `level` is 0-4.
 */
export default function SignalBars({ level, label }) {
  const colors = {
    0: "bg-muted/30",
    1: "bg-info",
    2: "bg-info",
    3: "bg-signal",
    4: "bg-alert",
  };

  return (
    <div className="flex items-center gap-2" title={label}>
      <div className="flex items-end gap-[3px] h-4">
        {[0, 1, 2, 3].map((bar) => (
          <div
            key={bar}
            className={`w-1 rounded-sm transition-colors ${
              bar < level ? colors[level] : "bg-hairline"
            }`}
            style={{ height: `${(bar + 1) * 25}%` }}
          />
        ))}
      </div>
      {label && (
        <span className="text-xs font-mono text-muted uppercase tracking-wide">
          {label}
        </span>
      )}
    </div>
  );
}
