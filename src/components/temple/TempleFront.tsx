import { memo } from 'react';
import { Ganesh } from '../Decorations';
import { DOOR, DOORWAY, f, leaf, rng, rosette } from './geometry';

const OUTER_ARCH = 'M598 470 C598 330 730 290 800 196 C870 290 1002 330 1002 470';

/** Marigold toran: swags between hooks, strings and mango leaves */
const TORAN = (() => {
  const hooks = [618, 709, 800, 891, 982];
  const y = 186;
  const beads: { x: number; y: number; c: number }[] = [];
  const leaves: string[] = [];
  for (let i = 0; i < hooks.length - 1; i++) {
    const a = hooks[i];
    const b = hooks[i + 1];
    const n = 11;
    for (let k = 0; k <= n; k++) {
      const t = k / n;
      const x = a + (b - a) * t;
      const yy = y + 4 * 32 * t * (1 - t);
      beads.push({ x, y: yy, c: k % 2 });
    }
    for (const t of [0.25, 0.5, 0.75]) {
      const x = a + (b - a) * t;
      leaves.push(leaf(x, y + 4 * 32 * t * (1 - t) + 4, t === 0.5 ? 26 : 20, 180 + (t - 0.5) * 30, 0.3));
    }
  }
  hooks.forEach((x, i) => {
    const len = i === 2 ? 5 : 3;
    for (let k = 1; k <= len; k++) beads.push({ x, y: y + k * 9.5, c: (k + 1) % 2 });
    leaves.push(leaf(x, y + len * 9.5 + 4, 18, 180, 0.3));
  });
  return { beads, leaves };
})();

/** Bougainvillea spilling over the top corner (left side; mirrored for the right) */
const BOUGAIN = (() => {
  const r = rng(11);
  const shades = ['#b8336a', '#cf4b80', '#a62a5c', '#e06a96', '#c23f74'];
  const flowers: { x: number; y: number; s: number; c: string; rot: number }[] = [];
  const greens: string[] = [];
  const spray = (x0: number, y0: number, x1: number, y1: number, n: number, jx: number, jy: number) => {
    for (let i = 0; i < n; i++) {
      const t = r();
      const x = x0 + (x1 - x0) * t + (r() - 0.5) * jx * (1 - t * 0.5);
      const y = y0 + (y1 - y0) * t + (r() - 0.5) * jy * (1 - t * 0.5);
      greens.push(leaf(x, y, 12 + r() * 8, r() * 360, 0.42));
      flowers.push({ x, y, s: 4 + r() * 3.2, c: shades[Math.floor(r() * shades.length)], rot: r() * 120 });
    }
  };
  spray(500, 10, 720, 30, 46, 60, 80);
  spray(560, 30, 584, 330, 26, 46, 30);
  return { flowers, greens };
})();

/** Urn bouquet: hydrangea, roses, trailing greenery (left urn; mirrored for the right) */
const BOUQUET = (() => {
  const r = rng(29);
  const hyd: { x: number; y: number; rr: number }[] = [];
  for (const [cx, cy] of [
    [560, 742],
    [612, 730],
    [586, 700],
  ]) {
    for (let i = 0; i < 22; i++) {
      const a = r() * Math.PI * 2;
      const d = Math.sqrt(r()) * 26;
      hyd.push({ x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, rr: 5 + r() * 2.5 });
    }
  }
  const greens: string[] = [];
  for (let i = 0; i < 26; i++) {
    const a = Math.PI + r() * Math.PI;
    greens.push(leaf(586 + Math.cos(a) * 44, 742 + Math.sin(a) * 40, 16 + r() * 10, (a * 180) / Math.PI + 90, 0.38));
  }
  for (let i = 0; i < 10; i++) greens.push(leaf(548 + r() * 80, 770 + r() * 50, 14 + r() * 8, 140 + r() * 80, 0.38));
  const petals: { x: number; y: number; rot: number; c: string }[] = [];
  const pc = ['#b8324f', '#d4566d', '#e8899a', '#c94057'];
  for (let i = 0; i < 46; i++) {
    petals.push({ x: 560 + r() * 480, y: 916 + r() * 80, rot: r() * 180, c: pc[Math.floor(r() * pc.length)] });
  }
  return { hyd, greens, petals };
})();

function Swastik({ x, y }: { x: number; y: number }) {
  const a = 9;
  return (
    <g stroke="#b3261e" strokeWidth="2.6" strokeLinecap="round" fill="none">
      <path
        d={`M${x} ${y - a} V${y + a} M${x - a} ${y} H${x + a} M${x} ${y - a} H${x + a} M${x + a} ${y} V${y + a} M${x} ${y + a} H${x - a} M${x - a} ${y} V${y - a}`}
      />
      <g fill="#b3261e" stroke="none">
        <circle cx={x - 4.5} cy={y - 4.5} r="1.7" />
        <circle cx={x + 4.5} cy={y - 4.5} r="1.7" />
        <circle cx={x - 4.5} cy={y + 4.5} r="1.7" />
        <circle cx={x + 4.5} cy={y + 4.5} r="1.7" />
      </g>
    </g>
  );
}

function Pillar({ x }: { x: number }) {
  // x = left edge of the shaft (55 wide)
  return (
    <g>
      <rect x={x + 8} y="105" width="39" height="340" fill="url(#tf-pilaster)" />
      <rect x={x + 14} y="125" width="27" height="300" fill="none" stroke="#cdb389" strokeWidth="1.2" />
      <rect x={x} y="470" width="55" height="400" fill="url(#tf-shaft)" />
      <g stroke="#cbb184" strokeWidth="0.9" opacity="0.75">
        {[10, 19, 28, 37, 46].map((d) => (
          <path key={d} d={`M${x + d} 482 V858`} />
        ))}
      </g>
      {/* capital */}
      <rect x={x - 9} y="440" width="73" height="14" rx="3" fill="url(#tf-shaft)" />
      <rect x={x - 4} y="454" width="63" height="16" fill="url(#tf-shaft)" />
      <path d={`M${x - 4} 462 h63`} stroke="#c3a676" strokeWidth="1" />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={leaf(x + 5 + i * 9, 470, 12, 0, 0.4)} fill="#e9dbbf" stroke="#c3a676" strokeWidth="0.6" />
      ))}
      {/* base */}
      <rect x={x - 4} y="870" width="63" height="14" fill="url(#tf-shaft)" />
      <rect x={x - 9} y="884" width="73" height="21" rx="2" fill="url(#tf-shaft)" />
      <path d={`M${x - 9} 890 h73`} stroke="#c3a676" strokeWidth="1" />
    </g>
  );
}

function Urn() {
  return (
    <g>
      <path d="M586 790 C530 790 532 830 556 852 C566 862 576 866 578 878 L568 896 H604 L594 878 C596 866 606 862 616 852 C640 830 642 790 586 790Z" fill="url(#tf-brass)" />
      <ellipse cx="586" cy="790" rx="58" ry="8" fill="#d9ab55" />
      <ellipse cx="586" cy="790" rx="50" ry="5" fill="#7c5520" />
      <rect x="562" y="896" width="48" height="9" rx="2" fill="#a9792f" />
      <path d="M548 822 Q586 836 624 822" stroke="#f3d48c" strokeWidth="1.2" fill="none" opacity="0.8" />
      <path d={rosette(586, 838, 7, 8)} fill="#f0cf86" opacity="0.8" />
      <g fill="#6f8b4f">
        {BOUQUET.greens.map((d, i) => (
          <path key={i} d={d} opacity={0.85} />
        ))}
      </g>
      {BOUQUET.hyd.map((h, i) => (
        <g key={i}>
          <circle cx={h.x + 0.8} cy={h.y + 1} r={h.rr} fill="#d8c9ad" />
          <circle cx={h.x} cy={h.y} r={h.rr} fill="#fbf6ec" />
          <circle cx={h.x} cy={h.y} r={h.rr * 0.25} fill="#e9dcc2" />
        </g>
      ))}
      {[
        [548, 712, 13],
        [620, 760, 12],
        [600, 694, 11],
        [540, 760, 11],
      ].map(([x, y, rr], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={rr} fill="#e8a2ab" />
          <path
            d={`M${x - rr * 0.5} ${y} a${rr * 0.5} ${rr * 0.5} 0 1 1 ${rr * 0.5} ${rr * 0.5} M${x - rr * 0.8} ${y + 2} a${rr * 0.8} ${rr * 0.8} 0 0 1 ${rr * 0.4} ${-rr * 0.9}`}
            stroke="#c46b78"
            strokeWidth="1.2"
            fill="none"
          />
        </g>
      ))}
    </g>
  );
}

function Diya({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 14} ${y} q14 13 28 0 q-4 4 -14 4 q-10 0 -14 -4z`} fill="#8e4a1e" />
      <path d={`M${x - 14} ${y} q14 13 28 0 l-3 -1 q-11 7 -22 0z`} fill="#b5652b" />
      <ellipse cx={x} cy={y} rx="14" ry="2.6" fill="#d9883f" />
      <path d={`M${x} ${y - 1} q-6 -9 0 -20 q6 11 0 20z`} fill="#ffb53b" />
      <path d={`M${x} ${y - 2} q-3 -5 0 -11 q3 6 0 11z`} fill="#fff3c4" />
    </g>
  );
}

/** Stone portal in front of the doors: frame, arches, toran, pillars, flowers, rangoli */
export const TempleFront = memo(function TempleFront() {
  return (
    <svg viewBox="0 0 1600 1000" className="absolute inset-0 w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="tf-stone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6ecd9" />
          <stop offset="1" stopColor="#e9d8b6" />
        </linearGradient>
        <linearGradient id="tf-shaft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#dcc59c" />
          <stop offset="0.45" stopColor="#fbf5ea" />
          <stop offset="1" stopColor="#d6bd92" />
        </linearGradient>
        <linearGradient id="tf-pilaster" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#e4d0ac" />
          <stop offset="0.5" stopColor="#f6eddd" />
          <stop offset="1" stopColor="#e0caa3" />
        </linearGradient>
        <linearGradient id="tf-brass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7c5520" />
          <stop offset="0.35" stopColor="#e9c46f" />
          <stop offset="0.6" stopColor="#b8873a" />
          <stop offset="1" stopColor="#6e4a1a" />
        </linearGradient>
        <clipPath id="tf-outside">
          <path d={`M0 0 H1600 V1000 H0Z ${DOORWAY.shape}`} clipRule="evenodd" />
        </clipPath>
      </defs>

      {/* cornice the portal hangs from — the bougainvillea drapes over it */}
      <rect x="470" y="0" width="660" height="98" fill="url(#tf-stone)" />
      <g fill="none" stroke="#c9ad7f" strokeWidth="1">
        {Array.from({ length: 16 }, (_, i) => (
          <path key={i} d={rosette(491 + i * 41.2, 46, 13, 8)} />
        ))}
      </g>
      <path d="M470 22 H1130 M470 72 H1130" stroke="#d2b98e" strokeWidth="1.2" />
      <rect x="456" y="96" width="688" height="12" rx="2" fill="#efe1c4" />
      <path d="M456 108 H1144" stroke="#bfa274" strokeWidth="1.6" />
      <path d="M456 97 H1144" stroke="#fffaf0" strokeWidth="1" />

      {/* stone frame with the doorway cut out */}
      <path d={`M590 105 H1010 V905 H590Z ${DOORWAY.shape}`} fill="url(#tf-stone)" fillRule="evenodd" />
      <path d="M590 105 H1010 V905 M590 905 V105" fill="none" stroke="#c7ab7d" strokeWidth="2" />
      <path d="M602 117 H998 M602 180 H998" stroke="#cdb389" strokeWidth="1.4" />
      <path d="M602 119 H998 M602 182 H998" stroke="#fffaf0" strokeWidth="1" />

      {/* frieze: scrolling vine + Ganesh medallion */}
      <g fill="none" stroke="#c4a677" strokeWidth="1.3">
        {Array.from({ length: 8 }, (_, i) => {
          const x = 612 + i * 44;
          if (x > 752 && x < 830) return null;
          const up = i % 2 === 0;
          return (
            <g key={i}>
              <path d={`M${x} 149 q11 ${up ? -22 : 22} 22 0 q11 ${up ? 22 : -22} 22 0`} />
              <path d={rosette(x + 11, up ? 142 : 156, 4, 5)} />
            </g>
          );
        })}
      </g>
      <circle cx="800" cy="149" r="33" fill="#f8f1e3" stroke="#c7ab7d" strokeWidth="1.6" />
      <circle cx="800" cy="149" r="28" fill="none" stroke="#d9c39b" strokeWidth="0.8" strokeDasharray="2 3" />
      <g transform="translate(775 122)">
        <Ganesh size={50} />
      </g>

      {/* spandrels with carved rosettes */}
      {[660, 940].map((x) => (
        <g key={x} fill="none">
          <circle cx={x} cy="236" r="30" stroke="#c7ab7d" strokeWidth="1.4" />
          <path d={rosette(x, 236, 24, 12)} stroke="#c4a677" strokeWidth="1" transform="translate(0.8 1)" />
          <path d={rosette(x, 236, 24, 12)} stroke="#fffaf0" strokeWidth="1" />
          <circle cx={x} cy="236" r="6" fill="#ead9b8" stroke="#c4a677" strokeWidth="1" />
        </g>
      ))}

      {/* outer pointed arch */}
      <path d={OUTER_ARCH} fill="none" stroke="#c7ab7d" strokeWidth="2.2" />
      <path d={OUTER_ARCH} fill="none" stroke="#fffaf0" strokeWidth="1.2" transform="translate(0 2.5)" />

      {/* cusped arch mouldings (only outside the opening) */}
      <g clipPath="url(#tf-outside)" fill="none">
        <path d={DOORWAY.outline} stroke="#cfb386" strokeWidth="72" />
        <path d={DOORWAY.outline} stroke="#f7eedc" strokeWidth="68" />
        <path d={DOORWAY.outline} stroke="#d8bf93" strokeWidth="48" />
        <path d={DOORWAY.outline} stroke="#f3e6cd" strokeWidth="44" />
        <path d={DOORWAY.outline} stroke="#fffaf0" strokeWidth="40" />
        <path d={DOORWAY.outline} stroke="#f1e3c8" strokeWidth="36" />
        <path d={DOORWAY.outline} stroke="#cdb184" strokeWidth="20" />
        <path d={DOORWAY.outline} stroke="#faf2e2" strokeWidth="16" />
        <path d={DOORWAY.outline} stroke="#b4955f" strokeWidth="6" />
      </g>
      <path d={DOORWAY.outline} fill="none" stroke="#2a170a" strokeOpacity="0.5" strokeWidth="5" />

      {/* kumkum swastik with શુભ – લાભ on the jambs */}
      <Swastik x={622.5} y={560} />
      <Swastik x={977.5} y={560} />
      <g fill="#b3261e" fontSize="15" fontWeight="700" textAnchor="middle" style={{ fontFamily: 'var(--font-rasa), serif' }}>
        <text x="622.5" y="596">શુભ</text>
        <text x="977.5" y="596">લાભ</text>
      </g>

      <Pillar x={548} />
      <Pillar x={997} />

      {/* toran */}
      <g fill="#5f7f3a">
        {TORAN.leaves.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g stroke="#7c4a12" strokeOpacity="0.25" strokeWidth="0.8">
        {TORAN.beads.map((b, i) => (
          <circle key={i} cx={f(b.x)} cy={f(b.y)} r="5.6" fill={b.c ? '#f5b72d' : '#ea7a1c'} />
        ))}
      </g>

      {/* threshold: rangoli + diyas + petals */}
      <g transform="translate(800 958) scale(1 0.3)">
        <circle r="84" fill="#fdf8ee" opacity="0.9" />
        <circle r="72" fill="#f2c14e" />
        <path d={rosette(0, 0, 68, 16)} fill="#cf3f2a" />
        <circle r="46" fill="#4f8a5b" />
        <path d={rosette(0, 0, 42, 8)} fill="#fbf6ea" />
        <circle r="22" fill="#e39a2c" />
        <path d={rosette(0, 0, 18, 6)} fill="#b3261e" />
        <circle r="6" fill="#fff8e6" />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return <circle key={i} cx={f(78 * Math.cos(a))} cy={f(78 * Math.sin(a))} r="2.6" fill="#fff" />;
        })}
      </g>
      {BOUQUET.petals.map((p, i) => (
        <ellipse key={i} cx={f(p.x)} cy={f(p.y)} rx="4" ry="2" fill={p.c} opacity="0.85" transform={`rotate(${f(p.rot)} ${f(p.x)} ${f(p.y)})`} />
      ))}
      <Diya x={700} y={946} />
      <Diya x={900} y={946} />
      <Diya x={742} y={984} />
      <Diya x={858} y={984} />

      {/* urns with flowers + bougainvillea, mirrored for the right side */}
      {[undefined, 'translate(1600 0) scale(-1 1)'].map((t, i) => (
        <g key={i} transform={t}>
          <Urn />
          <g fill="#56713a">
            {BOUGAIN.greens.map((d, k) => (
              <path key={k} d={d} />
            ))}
          </g>
          {BOUGAIN.flowers.map((fl, k) => (
            <g key={k} transform={`rotate(${f(fl.rot)} ${f(fl.x)} ${f(fl.y)})`}>
              <circle cx={f(fl.x - fl.s * 0.6)} cy={f(fl.y)} r={f(fl.s)} fill={fl.c} />
              <circle cx={f(fl.x + fl.s * 0.6)} cy={f(fl.y)} r={f(fl.s)} fill={fl.c} />
              <circle cx={f(fl.x)} cy={f(fl.y - fl.s * 0.7)} r={f(fl.s)} fill={fl.c} opacity="0.92" />
              <circle cx={f(fl.x)} cy={f(fl.y - fl.s * 0.15)} r={f(fl.s * 0.28)} fill="#fbeedc" />
            </g>
          ))}
        </g>
      ))}

      <path d={`M0 ${DOOR.floor} H1600`} stroke="#b89a68" strokeWidth="1" opacity="0.5" />
    </svg>
  );
});
