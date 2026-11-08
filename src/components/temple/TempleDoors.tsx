'use client';

import { memo, useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { DoorLeaf } from './DoorLeaf';
import { STAGE } from './geometry';
import { TempleBack } from './TempleBack';
import { TempleFront } from './TempleFront';

/**
 * idle     → doorway waiting, lanterns glowing, "Tap to Enter"
 * opening  → light leaks through the seam, knockers swing, doors swing inward
 * entering → camera moves through the doorway into the light
 * leaving  → scene dissolves; the next stage is already showing underneath
 */
type DoorState = 'idle' | 'opening' | 'entering' | 'leaving';

const TIMING = {
  normal: { enter: 2300, opened: 3700, done: 4700 },
  reduced: { enter: 200, opened: 800, done: 1500 },
};

/** Position a box given in scene units as percentages of the stage */
const at = (x: number, y: number, w: number, h: number): CSSProperties => ({
  left: `${(x / STAGE.w) * 100}%`,
  top: `${(y / STAGE.h) * 100}%`,
  width: `${(w / STAGE.w) * 100}%`,
  height: `${(h / STAGE.h) * 100}%`,
});

const LANTERNS = [
  { x: 605, scale: 1, delay: 0 },
  { x: 995, scale: 1, delay: -2.6 },
  { x: 430, scale: 0.78, delay: -1.2 },
  { x: 1170, scale: 0.78, delay: -3.8 },
];
const DIYAS = [
  [700, 934],
  [900, 934],
  [742, 972],
  [858, 972],
  [270, 694],
  [1330, 694],
];
const ORBS = [
  [14, 22, 26, 9, 0],
  [82, 18, 18, 11, -3],
  [30, 48, 14, 8, -5],
  [70, 40, 30, 12, -1],
  [52, 14, 12, 10, -7],
  [88, 62, 20, 9, -4],
  [10, 70, 16, 13, -6],
  [62, 72, 12, 8, -2],
  [40, 30, 22, 14, -9],
];
const PETALS = [
  [8, 12, 0, '#c2324f'],
  [22, 15, -4, '#e88a96'],
  [38, 11, -9, '#d4566d'],
  [55, 14, -2, '#c2324f'],
  [68, 13, -6, '#f2b5bd'],
  [80, 16, -11, '#d4566d'],
  [92, 12, -3, '#e88a96'],
  [46, 17, -13, '#c94057'],
] as const;

function Lantern() {
  return (
    <svg viewBox="0 0 80 360" className="w-full h-full overflow-visible" aria-hidden="true">
      <defs>
        <radialGradient id="ln-glass" cx="0.5" cy="0.55" r="0.6">
          <stop offset="0" stopColor="#fffbea" />
          <stop offset="0.45" stopColor="#ffdf8f" />
          <stop offset="1" stopColor="#e39a3c" />
        </radialGradient>
        <linearGradient id="ln-brass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6e4a1a" />
          <stop offset="0.4" stopColor="#e2b862" />
          <stop offset="1" stopColor="#7c5520" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="#8a6326" strokeWidth="1.6">
        {Array.from({ length: 20 }, (_, i) => (
          <ellipse key={i} cx="40" cy={5 + i * 10} rx={i % 2 ? 1.6 : 3} ry="5.5" />
        ))}
      </g>
      <circle cx="40" cy="210" r="4" fill="url(#ln-brass)" />
      <path d="M20 242 Q20 224 40 214 Q60 224 60 242Z" fill="url(#ln-brass)" />
      <rect x="16" y="240" width="48" height="7" rx="2" fill="url(#ln-brass)" />
      <path d="M20 247 H60 L65 262 V296 L60 312 H20 L15 296 V262Z" fill="url(#ln-glass)" />
      <g stroke="#7a5420" fill="none">
        <path d="M30 247 V312 M50 247 V312 M15 262 H65 M15 296 H65" strokeWidth="1.6" />
        <path d="M20 262 q5 -9 10 0 M30 262 q5 -9 10 0 M40 262 q5 -9 10 0 M50 262 q5 -9 10 0" strokeWidth="0.9" />
        <path d="M20 296 q5 9 10 0 M30 296 q5 9 10 0 M40 296 q5 9 10 0 M50 296 q5 9 10 0" strokeWidth="0.9" />
        <path d="M20 247 H60 L65 262 V296 L60 312 H20 L15 296 V262Z" strokeWidth="2" />
      </g>
      <rect x="17" y="311" width="46" height="7" rx="2" fill="url(#ln-brass)" />
      <path d="M21 318 H59 L47 334 H33Z" fill="url(#ln-brass)" />
      <circle cx="40" cy="340" r="5" fill="url(#ln-brass)" />
      <path d="M40 345 L37 352 L40 358 L43 352Z" fill="#a87a30" />
    </svg>
  );
}

/**
 * Temple doorway with carved gold doors. `onEnter` runs inside the guest's tap,
 * `onOpened` once the light has filled the screen, `onDone` after it dissolves.
 */
export const TempleDoors = memo(function TempleDoors({
  onEnter,
  onOpened,
  onDone,
}: {
  onEnter?: () => void;
  onOpened?: () => void;
  onDone?: () => void;
}) {
  const [state, setState] = useState<DoorState>('idle');
  const timers = useRef<number[]>([]);
  const started = useRef(false); // the button and the scene both listen for the tap

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  const open = useCallback(() => {
    if (started.current) return;
    started.current = true;
    onEnter?.();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = reduced ? TIMING.reduced : TIMING.normal;
    const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));
    setState('opening');
    later(t.enter, () => setState('entering'));
    later(t.opened, () => {
      setState('leaving');
      onOpened?.();
    });
    later(t.done, () => onDone?.());
  }, [onEnter, onOpened, onDone]);

  return (
    <div className={`td-screen is-${state}`} onClick={open} role="dialog" aria-label="શુભ વિવાહ — Tap to Enter">
      <div className="td-stage">
        <div className="td-cam">
          <TempleBack />

          <div className="td-doorway" style={at(640, 250, 320, 655)}>
            <div className="td-leaf td-leaf-l">
              <DoorLeaf side="l" />
            </div>
            <div className="td-leaf td-leaf-r">
              <DoorLeaf side="r" />
            </div>
            <div className="td-seam" />
          </div>

          <TempleFront />

          {DIYAS.map(([x, y]) => (
            <div key={`${x}-${y}`} className="td-glow" style={at(x - 45, y - 45, 90, 90)} />
          ))}
          {LANTERNS.map((l) => (
            <div
              key={l.x}
              className="td-lantern"
              style={{ ...at(l.x - 40 * l.scale, 0, 80 * l.scale, 360 * l.scale), animationDelay: `${l.delay}s` }}
            >
              <div className="td-lantern-halo" />
              <Lantern />
            </div>
          ))}
        </div>
      </div>

      <div className="td-air" aria-hidden="true">
        {ORBS.map(([x, y, s, dur, delay], i) => (
          <span
            key={i}
            className="td-orb"
            style={{ left: `${x}%`, top: `${y}%`, width: s, height: s, animationDuration: `${dur}s`, animationDelay: `${delay}s` }}
          />
        ))}
        {PETALS.map(([x, dur, delay, c], i) => (
          <span
            key={i}
            className="td-petal"
            style={{ left: `${x}%`, background: c, animationDuration: `${dur}s`, animationDelay: `${delay}s` }}
          />
        ))}
      </div>

      <div className="td-vignette" aria-hidden="true" />
      <div className="td-flash" aria-hidden="true" />
      <div className="td-veil" aria-hidden="true" />

      <div className="td-cta">
        <button type="button" className="td-btn" onClick={open} tabIndex={state === 'idle' ? 0 : -1}>
          Tap to Enter
        </button>
      </div>
    </div>
  );
});
