// Shared geometry for the temple doorway scene. Everything is drawn in one
// 1600 × 1000 coordinate space so the SVG layers and the 3D door leaves line up.

export const STAGE = { w: 1600, h: 1000 };
export const DOOR = { x0: 640, x1: 960, mid: 800, peak: 250, spring: 400, floor: 905 };

type Pt = [number, number];

export const f = (n: number) => (Math.round(n * 10) / 10).toString();

function cubic(p: Pt[], t: number): Pt {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return [a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0], a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1]];
}

/** Evenly spaced (by arc length) points along a cubic */
function sampleEven(p: Pt[], n: number): Pt[] {
  const fine: Pt[] = [];
  for (let i = 0; i <= 200; i++) fine.push(cubic(p, i / 200));
  const len = [0];
  for (let i = 1; i < fine.length; i++) {
    len.push(len[i - 1] + Math.hypot(fine[i][0] - fine[i - 1][0], fine[i][1] - fine[i - 1][1]));
  }
  const total = len[len.length - 1];
  const out: Pt[] = [];
  let j = 0;
  for (let k = 0; k <= n; k++) {
    const target = (total * k) / n;
    while (j < len.length - 1 && len[j + 1] < target) j++;
    out.push(fine[Math.min(j + 1, fine.length - 1)]);
  }
  out[0] = p[0];
  out[n] = p[3];
  return out;
}

/** Outward-bulging lobes through the points — the cusps of a multifoil arch */
function lobes(pts: Pt[], depth = 0.62) {
  let d = '';
  for (let i = 1; i < pts.length; i++) {
    const r = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]) * depth;
    d += ` A${f(r)} ${f(r)} 0 0 1 ${f(pts[i][0])} ${f(pts[i][1])}`;
  }
  return d;
}

/**
 * A cusped arch between x0 and x1: rises from `spring` to a pointed peak at `peak`.
 * Returns the left-half lobes, right-half lobes and helpful closed/open paths.
 */
export function cuspedArch(x0: number, x1: number, spring: number, peak: number, bottom: number, n = 6) {
  const w = x1 - x0;
  const mid = (x0 + x1) / 2;
  const rise = spring - peak;
  const left = sampleEven(
    [
      [x0, spring],
      [x0, spring - rise * 0.72],
      [x0 + w * 0.34, spring - rise * 0.72],
      [mid, peak],
    ],
    n,
  );
  const right = left.map(([x, y]) => [x0 + x1 - x, y] as Pt).reverse();
  const L = lobes(left);
  const R = lobes(right);
  return {
    left: L,
    right: R,
    /** closed opening */
    shape: `M${x0} ${bottom} L${x0} ${spring}${L}${R} L${x1} ${bottom}Z`,
    /** open outline (no sill line) for moulding strokes */
    outline: `M${x0} ${bottom} L${x0} ${spring}${L}${R} L${x1} ${bottom}`,
    leftLeaf: `M${x0} ${bottom} L${x0} ${spring}${L} L${mid} ${bottom}Z`,
  };
}

export const DOORWAY = cuspedArch(DOOR.x0, DOOR.x1, DOOR.spring, DOOR.peak, DOOR.floor);

/** Deterministic PRNG so server and client markup match */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** n-petal rosette path centred on (cx, cy) */
export function rosette(cx: number, cy: number, r: number, petals = 6) {
  let d = '';
  for (let i = 0; i < petals; i++) {
    const a = (i / petals) * Math.PI * 2;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    // petal pointing along angle a, built in local coords then rotated
    const P = (x: number, y: number) => `${f(cx + x * ca - y * sa)} ${f(cy + x * sa + y * ca)}`;
    d += `M${P(0, 0)} C${P(r * 0.3, -r * 0.42)} ${P(r * 0.82, -r * 0.4)} ${P(r, 0)} C${P(r * 0.82, r * 0.4)} ${P(r * 0.3, r * 0.42)} ${P(0, 0)}Z `;
  }
  return d;
}

/** Almond leaf with its base at (x, y), pointing along `deg` (0 = up, clockwise) */
export function leaf(x: number, y: number, len: number, deg: number, width = 0.32) {
  const a = (deg * Math.PI) / 180;
  const dx = Math.sin(a);
  const dy = -Math.cos(a);
  const nx = -dy;
  const ny = dx;
  const w = len * width;
  const tip: Pt = [x + dx * len, y + dy * len];
  const m1: Pt = [x + dx * len * 0.5 + nx * w, y + dy * len * 0.5 + ny * w];
  const m2: Pt = [x + dx * len * 0.5 - nx * w, y + dy * len * 0.5 - ny * w];
  return `M${f(x)} ${f(y)} Q${f(m1[0])} ${f(m1[1])} ${f(tip[0])} ${f(tip[1])} Q${f(m2[0])} ${f(m2[1])} ${f(x)} ${f(y)}Z`;
}
