import { memo } from 'react';
import { DOOR, DOORWAY, cuspedArch, f, rosette } from './geometry';

const NICHES = [cuspedArch(180, 360, 470, 380, 760, 5), cuspedArch(1240, 1420, 470, 380, 760, 5)];

const RAYS = Array.from({ length: 18 }, (_, i) => {
  const a0 = (i / 18) * Math.PI * 2;
  const a1 = a0 + 0.09;
  const R = 700;
  return `M800 600 L${f(800 + R * Math.cos(a0))} ${f(600 + R * Math.sin(a0))} L${f(800 + R * Math.cos(a1))} ${f(600 + R * Math.sin(a1))}Z`;
}).join(' ');

/** Wall, side niches, marble floor and the divine light waiting behind the doors */
export const TempleBack = memo(function TempleBack() {
  return (
    <svg viewBox="0 0 1600 1000" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="tb-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#efe2c8" />
          <stop offset="1" stopColor="#e2cda6" />
        </linearGradient>
        <radialGradient id="tb-warm" cx="0.5" cy="0.42" r="0.6">
          <stop offset="0" stopColor="#fff4d6" stopOpacity="0.75" />
          <stop offset="1" stopColor="#fff4d6" stopOpacity="0" />
        </radialGradient>
        <pattern id="tb-damask" width="90" height="90" patternUnits="userSpaceOnUse">
          <path d={rosette(45, 45, 12, 8)} fill="none" stroke="#c9ad7f" strokeWidth="0.8" />
          <circle cx="45" cy="45" r="3" fill="none" stroke="#c9ad7f" strokeWidth="0.8" />
          <path d="M0 0 l8 8 M90 0 l-8 8 M0 90 l8 -8 M90 90 l-8 -8" stroke="#c9ad7f" strokeWidth="0.8" />
        </pattern>
        <linearGradient id="tb-niche" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c7a878" />
          <stop offset="1" stopColor="#dcc39a" />
        </linearGradient>
        <linearGradient id="tb-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dcc8a2" />
          <stop offset="1" stopColor="#efe3cb" />
        </linearGradient>
        <radialGradient id="tb-light" gradientUnits="userSpaceOnUse" cx="800" cy="600" r="380">
          <stop offset="0" stopColor="#fffef6" />
          <stop offset="0.3" stopColor="#fff1c4" />
          <stop offset="0.7" stopColor="#f6cd77" />
          <stop offset="1" stopColor="#d79a45" />
        </radialGradient>
        <clipPath id="tb-door">
          <path d={DOORWAY.shape} />
        </clipPath>
      </defs>

      <rect width="1600" height="1000" fill="url(#tb-wall)" />
      <rect width="1600" height="905" fill="url(#tb-damask)" opacity="0.35" />
      <rect width="1600" height="1000" fill="url(#tb-warm)" />

      {/* blind niches with a lamp — seen on wider screens */}
      {NICHES.map((n, i) => (
        <g key={i}>
          <path d={n.outline} fill="none" stroke="#f6ecd9" strokeWidth="26" />
          <path d={n.outline} fill="none" stroke="#cdb389" strokeWidth="2" transform="translate(0 0)" />
          <path d={n.shape} fill="url(#tb-niche)" />
          <path d={n.shape} fill="none" stroke="#a88a5c" strokeOpacity="0.5" strokeWidth="1.5" />
          <circle cx={i ? 1330 : 270} cy="690" r="70" fill="#ffd27a" opacity="0.25" />
          {/* brass diya on a stand */}
          <path
            d={`M${i ? 1300 : 240} 760 h60 l-8 -10 h-14 v-36 h8 l-14 -8 l-14 8 h8 v36 h-14z`}
            fill="#b88a3e"
          />
          <path d={`M${i ? 1314 : 254} 706 q16 12 32 0 q-4 8 -16 8 q-12 0 -16 -8z`} fill="#c99a48" />
          <path d={`M${i ? 1330 : 270} 702 q-5 -8 0 -18 q5 10 0 18z`} fill="#ffb53b" />
        </g>
      ))}

      {/* marble floor */}
      <rect y={DOOR.floor} width="1600" height={1000 - DOOR.floor} fill="url(#tb-floor)" />
      <g stroke="#c9b28a" strokeWidth="1" opacity="0.6">
        {Array.from({ length: 15 }, (_, i) => {
          const x = 800 + (i - 7) * 110;
          return <path key={i} d={`M${800 + (i - 7) * 46} ${DOOR.floor} L${x} 1000`} />;
        })}
        <path d="M0 940 H1600 M0 975 H1600" />
      </g>
      <rect y={DOOR.floor} width="1600" height="8" fill="#cbb084" />

      {/* light behind the doors */}
      <g clipPath="url(#tb-door)">
        <rect x={DOOR.x0} y={DOOR.peak} width={DOOR.x1 - DOOR.x0} height={DOOR.floor - DOOR.peak} fill="url(#tb-light)" />
        <path className="td-rays" d={RAYS} fill="#fffaf0" opacity="0.35" />
      </g>
    </svg>
  );
});
