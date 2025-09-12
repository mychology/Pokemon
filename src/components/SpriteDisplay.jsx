import React from "react";

export default function SpriteDisplay({ mainSrc, spriteSrc, size = 480 }) {
  const cx = size * 0.5;
  const cy = size * 0.5;
  const r = size * 0.43;
  const smallR = size * 0.12;

  return (
    <div className="relative w-[480px] h-[480px]">
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full">
        <g>
          <circle cx={cx} cy={cy} r={r} fill="#e6e6e6" stroke="var(--accent)" strokeWidth="10" vectorEffect="non-scaling-stroke" />
          <circle cx={cx} cy={cy} r={r * 0.68} fill="none" stroke="#cfcfcf" strokeWidth="6" vectorEffect="non-scaling-stroke" />
          <circle cx={cx} cy={cy} r={r * 0.34} fill="none" stroke="#cfcfcf" strokeWidth="6" vectorEffect="non-scaling-stroke" />
        </g>

        <defs>
          <clipPath id="mainClip">
            <circle cx={cx} cy={cy} r={r * 0.9} />
          </clipPath>
        </defs>

        {mainSrc ? (
          <image
            href={mainSrc}
            x={cx - r * 0.9}
            y={cy - r * 0.9}
            width={r * 1.8}
            height={r * 1.8}
            clipPath="url(#mainClip)"
            preserveAspectRatio="xMidYMid slice"
          />
        ) : (
          <text x={cx} y={cy} fontSize="18" textAnchor="middle" alignmentBaseline="central" fill="#999">
            No artwork
          </text>
        )}
      </svg>

      {/* small overlapping sprite circle */}
      <div
        className="absolute left-6 bottom-6 rounded-full flex items-center justify-center panel-outline"
        style={{
          width: smallR * 2,
          height: smallR * 2,
          boxSizing: "border-box",
        }}
      >
        {spriteSrc ? (
          <img src={spriteSrc} alt="sprite" className="w-[78%] h-[78%] object-contain" />
        ) : (
          <div className="w-[78%] h-[78%] bg-white rounded-full" />
        )}
      </div>
    </div>
  );
}
