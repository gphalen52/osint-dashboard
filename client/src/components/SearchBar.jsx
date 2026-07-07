import { useState } from "react";

export default function SearchBar({ onSearch, isLoading }) {
  const [value, setValue] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) onSearch(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-stretch gap-3">
      <div className="flex-1 flex items-center gap-3 bg-panel border border-hairline rounded px-4 focus-within:border-signal transition-colors">
        <span className="text-muted font-mono text-sm select-none">
          target://
        </span>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="example.com"
          spellCheck={false}
          autoComplete="off"
          className="flex-1 bg-transparent py-3 font-mono text-sm text-ink placeholder:text-muted/60 outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="px-6 rounded bg-signal text-graphite font-display font-semibold text-sm tracking-wide hover:bg-signal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Scanning…" : "Investigate"}
      </button>
    </form>
  );
}
