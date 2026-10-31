export default function Marquee({ items }: { items: string[] }) {
  // Triple the items inside each strip so there is continuous text even on ultra-wide screens
  const displayItems = [...items, ...items, ...items];

  return (
    <div className="group relative flex overflow-hidden select-none py-1.5 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      {/* Primary Strip */}
      <div className="flex shrink-0 animate-marquee items-center gap-3.5 pr-3.5 group-hover:[animation-play-state:paused]">
        {displayItems.map((t, i) => (
          <span
            key={`a-${i}`}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/[0.03] px-4 py-1.5 text-[13px] font-medium tracking-wide text-zinc-200 shadow-sm transition-colors hover:border-white/40 hover:bg-white/[0.08] hover:text-white"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
            {t}
          </span>
        ))}
      </div>

      {/* Identical Secondary Strip for seamless infinite continuity */}
      <div
        aria-hidden="true"
        className="flex shrink-0 animate-marquee items-center gap-3.5 pr-3.5 group-hover:[animation-play-state:paused]"
      >
        {displayItems.map((t, i) => (
          <span
            key={`b-${i}`}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/[0.03] px-4 py-1.5 text-[13px] font-medium tracking-wide text-zinc-200 shadow-sm transition-colors hover:border-white/40 hover:bg-white/[0.08] hover:text-white"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
