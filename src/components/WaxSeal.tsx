import { memo, useId, type ReactNode } from 'react';

const C = 60;

// Irregular poured-wax outline — deterministic so server and client markup match
const EDGE = (() => {
  const pts: [number, number][] = [];
  const n = 72;
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const r = 53 + 1.9 * Math.sin(5 * t + 0.4) + 1.3 * Math.sin(11 * t + 1.1) + 0.7 * Math.sin(23 * t + 2.3);
    pts.push([C + r * Math.cos(t), C + r * Math.sin(t)]);
  }
  const mid = (a: [number, number], b: [number, number]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const f = (v: number) => v.toFixed(2);
  const start = mid(pts[n - 1], pts[0]);
  let d = `M${f(start[0])} ${f(start[1])}`;
  for (let i = 0; i < n; i++) {
    const m = mid(pts[i], pts[(i + 1) % n]);
    d += ` Q${f(pts[i][0])} ${f(pts[i][1])} ${f(m[0])} ${f(m[1])}`;
  }
  return `${d}Z`;
})();

const PETAL = 'M0 0 C -5.2 -6, -5.4 -14, 0 -19.5 C 5.4 -14, 5.2 -6, 0 0Z';
const SMALL_PETAL = 'M0 0 C -2.6 -3.2, -2.6 -7, 0 -9.5 C 2.6 -7, 2.6 -3.2, 0 0Z';
const BEADS = Array.from({ length: 24 }, (_, i) => (i / 24) * Math.PI * 2);
const FLECKS: [number, number, number][] = [
  [24, 30, 0.9],
  [92, 24, 0.7],
  [101, 70, 1],
  [30, 96, 0.8],
  [78, 104, 0.6],
  [14, 62, 0.6],
];

/** Lotus-in-a-ring stamp motif */
function Motif() {
  return (
    <>
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={PETAL} transform={`translate(${C} ${C}) rotate(${i * 45})`} />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <path key={`s${i}`} d={SMALL_PETAL} transform={`translate(${C} ${C}) rotate(${i * 45 + 22.5}) translate(0 -13)`} />
      ))}
      <circle cx={C} cy={C} r="4.6" />
      {BEADS.map((t) => (
        <circle key={t} cx={C + 30 * Math.cos(t)} cy={C + 30 * Math.sin(t)} r="1.15" />
      ))}
    </>
  );
}

function Embossed({ children }: { children: ReactNode }) {
  return (
    <>
      <g transform="translate(0.8 0.95)" fill="#3a0b12" opacity="0.55">
        {children}
      </g>
      <g transform="translate(-0.55 -0.6)" fill="#c56d74" opacity="0.55">
        {children}
      </g>
      <g fill="#7a2531">{children}</g>
    </>
  );
}

/** Royal burgundy wax seal with an embossed lotus, champagne-gold flecks and a slow shine */
export const WaxSeal = memo(function WaxSeal({ className = '' }: { className?: string }) {
  const id = `ws${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={`${id}w`} cx="0.36" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#a8414c" />
          <stop offset="0.45" stopColor="#82283a" />
          <stop offset="1" stopColor="#4f121c" />
        </radialGradient>
        <linearGradient id={`${id}r`} x1="0.15" y1="0.1" x2="0.85" y2="0.9">
          <stop offset="0" stopColor="#5a1622" />
          <stop offset="1" stopColor="#8d3240" />
        </linearGradient>
        <radialGradient id={`${id}g`} cx="0.32" cy="0.26" r="0.38">
          <stop offset="0" stopColor="#fff" stopOpacity="0.38" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#f6dfa8" stopOpacity="0" />
          <stop offset="0.5" stopColor="#f6dfa8" stopOpacity="0.42" />
          <stop offset="1" stopColor="#f6dfa8" stopOpacity="0" />
        </linearGradient>
        <clipPath id={`${id}c`}>
          <path d={EDGE} />
        </clipPath>
      </defs>

      {/* poured wax body */}
      <path d={EDGE} fill={`url(#${id}w)`} />
      <path d={EDGE} fill="none" stroke="#c0606a" strokeOpacity="0.35" strokeWidth="0.8" transform="translate(-0.4 -0.5)" />

      {/* stamped recess */}
      <circle cx={C} cy={C} r="40" fill={`url(#${id}r)`} />
      <circle cx={C + 0.8} cy={C + 0.9} r="40" fill="none" stroke="#c56d74" strokeOpacity="0.55" strokeWidth="0.9" />
      <circle cx={C - 0.6} cy={C - 0.7} r="40" fill="none" stroke="#33090f" strokeOpacity="0.6" strokeWidth="0.9" />
      <circle cx={C} cy={C} r="36" fill="none" stroke="#3a0b12" strokeOpacity="0.4" strokeWidth="0.5" />

      <Embossed>
        <Motif />
      </Embossed>

      {/* champagne-gold flecks */}
      {FLECKS.map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#e8c983" opacity="0.6" />
      ))}

      {/* gloss + travelling shine */}
      <g clipPath={`url(#${id}c)`}>
        <rect width="120" height="120" fill={`url(#${id}g)`} />
        <g transform="skewX(-18)">
          <rect className="seal-shine" x="-50" y="-10" width="34" height="140" fill={`url(#${id}s)`} />
        </g>
      </g>
    </svg>
  );
});
