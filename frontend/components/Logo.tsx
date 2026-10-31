export default function Logo({ className = "", size = 24 }: { className?: string; size?: number }) {
  return (
    <span className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* L3 Missing Line: text rows with one gap */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-fg shrink-0"
        aria-hidden="true"
      >
        {/* Top Solid Line */}
        <rect x="3.5" y="5.5" width="21" height="3.2" rx="1.6" fill="currentColor" />

        {/* Middle Line with the distinct MISSING GAP (The Dark Spot) */}
        <rect x="3.5" y="12.4" width="7.2" height="3.2" rx="1.6" fill="currentColor" />
        <rect x="17.3" y="12.4" width="7.2" height="3.2" rx="1.6" fill="currentColor" />

        {/* Bottom Solid Line */}
        <rect x="3.5" y="19.3" width="21" height="3.2" rx="1.6" fill="currentColor" />
      </svg>
      <span className="text-[15px] font-semibold tracking-tight text-fg">DarkSpot Atlas</span>
    </span>
  );
}
