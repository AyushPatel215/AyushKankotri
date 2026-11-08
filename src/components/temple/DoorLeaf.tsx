import { memo, useId } from 'react';
import { DOOR, DOORWAY, f, leaf, rosette } from './geometry';

/**
 * One carved door leaf. The art is drawn once for the left leaf (x 640–800 of the
 * scene) and mirrored for the right one, so both halves match like real doors.
 */

type Piece = { d: string; w?: number };

const CX = 720; // centre of the carved panel
const TOP = 352;
const BOT = 748;
const stemX = (y: number) => CX + 2.4 * Math.sin((BOT - y) / 38);

/** Tree-of-life vine relief: stem, curling branches, rosettes, leaves */
const VINE: Piece[] = (() => {
  const out: Piece[] = [];
  let stem = `M${f(stemX(BOT))} ${BOT}`;
  for (let y = BOT - 6; y >= TOP; y -= 6) stem += ` L${f(stemX(y))} ${y}`;
  out.push({ d: stem, w: 3.4 });

  const levels = [712, 652, 592, 532, 472, 412];
  levels.forEach((y, i) => {
    const s1 = 1 - i * 0.05;
    const sx = stemX(y);
    for (const s of [-1, 1]) {
      const ex = sx + s * 40 * s1;
      const ey = y - 40 * s1;
      out.push({ d: `M${f(sx)} ${y} C${f(sx + s * 16 * s1)} ${f(y - 2)} ${f(ex)} ${f(y - 14 * s1)} ${f(ex)} ${f(ey)}`, w: 2.8 });

      // scroll curling back toward the stem
      const r0 = 11 * s1;
      const cx = ex - s * r0;
      let spiral = `M${f(ex)} ${f(ey)}`;
      const N = 26;
      for (let k = 1; k <= N; k++) {
        const a = -(k / N) * Math.PI * 1.75;
        const r = r0 * (1 - 0.7 * (k / N));
        spiral += ` L${f(cx + s * r * Math.cos(a))} ${f(ey + r * Math.sin(a))}`;
      }
      out.push({ d: spiral, w: 2.3 });
      out.push({ d: rosette(cx, ey + 0.5, 5.4 * s1, 6) });
      // leaves riding on top of the branch + a tendril toward the frame
      out.push({ d: leaf(sx + s * 26 * s1, y - 11 * s1, 13 * s1, s * 38, 0.36) });
      out.push({ d: leaf(sx + s * 36 * s1, y - 22 * s1, 10 * s1, s * 72, 0.36) });
      out.push({ d: `M${f(ex)} ${f(y - 24 * s1)} q${s * 8} -2 ${s * 9} -9 q0 -5 ${s * -4} -4`, w: 1.3 });
      out.push({ d: leaf(sx + s * 17 * s1, y - 5 * s1, 15 * s1, s * 118) });
      out.push({ d: leaf(sx + s * 8, y - 2, 10 * s1, s * 160, 0.36) });
      // small edge flower + bud between levels
      if (!(s === 1 && Math.abs(y - 592) < 30)) {
        out.push({ d: rosette(CX + s * 46, y + 8, 3.6, 5) });
      }
      out.push({ d: `M${f(CX + s * 30)} ${y + 14} m-1.8 0 a1.8 1.8 0 1 0 3.6 0 a1.8 1.8 0 1 0 -3.6 0` });
    }
    // flower on the stem between levels
    out.push({ d: rosette(stemX(y - 30), y - 30, 6.8, 8) });
    out.push({ d: leaf(stemX(y - 30) - 5, y - 22, 9, -120, 0.4) });
    out.push({ d: leaf(stemX(y - 30) + 5, y - 22, 9, 120, 0.4) });
  });

  // crown at the top of the panel
  out.push({ d: rosette(CX, 345, 10, 8) });
  for (const s of [-1, 1]) {
    out.push({ d: leaf(CX + s * 4, 362, 18, s * 55, 0.34) });
    out.push({ d: leaf(CX + s * 8, 352, 14, s * 85, 0.34) });
    out.push({ d: `M${CX + s * 12} 342 q${s * 12} -10 ${s * 22} -2 q${s * 5} 6 ${s * -1} 9`, w: 1.6 });
  }
  return out;
})();

/** Lower panels: framed rosettes with leaf scrolls */
const LOWER: Piece[] = (() => {
  const out: Piece[] = [];
  for (const [y0, y1] of [
    [772, 820],
    [828, 872],
  ]) {
    out.push({ d: `M672 ${y0} H768 V${y1} H672Z`, w: 1.8 });
    out.push({ d: `M677 ${y0 + 5} H763 V${y1 - 5} H677Z`, w: 0.7 });
    const cy = (y0 + y1) / 2;
    out.push({ d: rosette(CX, cy, 9, 8) });
    for (const s of [-1, 1]) {
      out.push({ d: leaf(CX + s * 11, cy, 14, s * 90, 0.3) });
      out.push({ d: `M${CX + s * 27} ${cy} q${s * 8} -10 ${s * 16} -2 q${s * 4} 5 ${s * -2} 7`, w: 1.3 });
      out.push({ d: `M${CX + s * 41} ${cy - 1} m-1.6 0 a1.6 1.6 0 1 0 3.2 0 a1.6 1.6 0 1 0 -3.2 0` });
    }
  }
  // rails between the carved panel and the lower panels
  out.push({ d: 'M668 758 H772', w: 2.4 });
  out.push({ d: 'M668 764 H772', w: 1 });
  return out;
})();

const PIECES = [...VINE, ...LOWER];

function Relief({ paint, dx = 0, dy = 0, opacity = 1 }: { paint: string; dx?: number; dy?: number; opacity?: number }) {
  return (
    <g transform={dx || dy ? `translate(${dx} ${dy})` : undefined} opacity={opacity} strokeLinecap="round" strokeLinejoin="round">
      {PIECES.map((p, i) =>
        p.w ? (
          <path key={i} d={p.d} fill="none" stroke={paint} strokeWidth={p.w} />
        ) : (
          <path key={i} d={p.d} fill={paint} />
        ),
      )}
    </g>
  );
}

/** Ring knocker on the meeting stile; the ring swings when the doors open */
function Knocker({ gold }: { gold: string }) {
  return (
    <g>
      <path d={rosette(784, 584, 8, 8)} fill="#1a0d05" opacity="0.6" transform="translate(1 1.3)" />
      <path d={rosette(784, 584, 8, 8)} fill={gold} />
      <circle cx="784" cy="584" r="2.6" fill="#2a1709" />
      <g className="td-ring">
        <circle cx="784" cy="600" r="11.5" fill="none" stroke="#1a0d05" strokeOpacity="0.55" strokeWidth="3.4" transform="translate(1 1.4)" />
        <circle cx="784" cy="600" r="11.5" fill="none" stroke={gold} strokeWidth="3.2" />
        <circle cx="784" cy="600" r="11.5" fill="none" stroke="#fff3c8" strokeOpacity="0.5" strokeWidth="0.8" transform="translate(-0.5 -0.6)" />
        <circle cx="784" cy="589" r="2.2" fill={gold} />
      </g>
    </g>
  );
}

export const DoorLeaf = memo(function DoorLeaf({ side }: { side: 'l' | 'r' }) {
  const id = `dl${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const gold = `url(#${id}g)`;
  const x = side === 'l' ? DOOR.x0 : DOOR.mid;

  return (
    <svg
      viewBox={`${x} ${DOOR.peak} ${DOOR.mid - DOOR.x0} ${DOOR.floor - DOOR.peak}`}
      className="block w-full h-full overflow-visible"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}g`} gradientUnits="userSpaceOnUse" x1="640" y1="250" x2="820" y2="905">
          <stop offset="0" stopColor="#fbe7a6" />
          <stop offset="0.22" stopColor="#dcae56" />
          <stop offset="0.45" stopColor="#a97b2f" />
          <stop offset="0.62" stopColor="#ecc874" />
          <stop offset="0.82" stopColor="#b48638" />
          <stop offset="1" stopColor="#7c5520" />
        </linearGradient>
        <linearGradient id={`${id}b`} gradientUnits="userSpaceOnUse" x1="640" y1="0" x2="800" y2="0">
          <stop offset="0" stopColor="#2a1709" />
          <stop offset="0.45" stopColor="#4a2d16" />
          <stop offset="0.65" stopColor="#55341a" />
          <stop offset="1" stopColor="#36200f" />
        </linearGradient>
        <linearGradient id={`${id}l`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd78a" stopOpacity="0.16" />
          <stop offset="0.5" stopColor="#ffd78a" stopOpacity="0.04" />
          <stop offset="1" stopColor="#000" stopOpacity="0.18" />
        </linearGradient>
        <pattern id={`${id}p`} width="6" height="6" patternUnits="userSpaceOnUse">
          <path d="M0 3 L3 0 L6 3 L3 6Z" fill="none" stroke="#c99a48" strokeWidth="0.55" />
          <circle cx="3" cy="3" r="0.8" fill="#e6c06e" />
        </pattern>
        <clipPath id={`${id}c`}>
          <path d={DOORWAY.leftLeaf} />
        </clipPath>
      </defs>

      <g transform={side === 'r' ? 'translate(1600 0) scale(-1 1)' : undefined}>
        <path d={DOORWAY.leftLeaf} fill={`url(#${id}b)`} />

        {/* concentric gold mouldings following the leaf outline */}
        <g clipPath={`url(#${id}c)`} fill="none" strokeLinejoin="round">
          <path d={DOORWAY.leftLeaf} stroke={gold} strokeWidth="76" />
          <path d={DOORWAY.leftLeaf} stroke={`url(#${id}b)`} strokeWidth="72" />
          <path d={DOORWAY.leftLeaf} stroke={gold} strokeWidth="56" />
          <path d={DOORWAY.leftLeaf} stroke="#2f1c0e" strokeWidth="52" />
          <path d={DOORWAY.leftLeaf} stroke={`url(#${id}p)`} strokeWidth="52" />
          <path d={DOORWAY.leftLeaf} stroke={gold} strokeWidth="24" />
          <path d={DOORWAY.leftLeaf} stroke="#2f1c0e" strokeWidth="18" />
          <path d={DOORWAY.leftLeaf} stroke={gold} strokeWidth="12" />
          <path d={DOORWAY.leftLeaf} stroke="#1e1007" strokeWidth="6" />
        </g>

        {/* raised gold carving: shadow, highlight, metal */}
        <Relief paint="#140904" dx={1.2} dy={1.5} opacity={0.75} />
        <Relief paint="#fff2c4" dx={-0.6} dy={-0.7} opacity={0.5} />
        <Relief paint={gold} />

        <Knocker gold={gold} />

        <path d={DOORWAY.leftLeaf} fill={`url(#${id}l)`} />
        <path d={`M800 ${DOOR.peak} V${DOOR.floor}`} stroke="#120803" strokeWidth="1.6" />
      </g>
    </svg>
  );
});
