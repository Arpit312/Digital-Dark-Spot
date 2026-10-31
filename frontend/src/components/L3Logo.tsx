import React from 'react';

interface L3LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const L3Logo: React.FC<L3LogoProps> = ({
  className = "",
  size = 28,
  showText = true
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* L3 Missing Line Geometric Mark */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white flex-shrink-0"
      >
        {/* Top Solid Line */}
        <rect x="4" y="6" width="20" height="3" rx="1.5" fill="currentColor" />

        {/* Middle Line with the distinct MISSING GAP (The Dark Spot) */}
        <rect x="4" y="12.5" width="7" height="3" rx="1.5" fill="currentColor" />
        <rect x="17" y="12.5" width="7" height="3" rx="1.5" fill="currentColor" />

        {/* Bottom Solid Line */}
        <rect x="4" y="19" width="20" height="3" rx="1.5" fill="currentColor" />
      </svg>

      {showText && (
        <span className="font-semibold text-base tracking-tight text-[#F4F4F5] font-sans flex items-center gap-1.5">
          <span>DarkSpot</span>
          <span className="text-[#9A9AA2] font-normal">Atlas</span>
        </span>
      )}
    </div>
  );
};
