'use client';

import { memo, useEffect, useId, useState } from 'react';
import { cuspedArch, leaf, rosette } from '../temple/geometry';

const GOLD_DEEP = '#9c7b45';
const SAGE = '#8fa58b';
const BLUSH = '#e2b3ae';
const ROSE = '#c98b8a';

const WINDOW = cuspedArch(34, 186, 112, 36, 268, 5);

/** Bride's page extras: blush blossoms with sage leaves on the arch shoulders and base */
function Blossoms() {
  const cluster = (x: number, y: number, s: number) => (
    <g key={`${x}-${y}`}>
      <path d={leaf(x - 4, y + 2, 12 * s, -70, 0.38)} fill={SAGE} />
      <path d={leaf(x + 4, y + 2, 12 * s, 70, 0.38)} fill={SAGE} />
      <path d={leaf(x, y + 3, 10 * s, 180, 0.38)} fill={SAGE} opacity="0.8" />
      <path d={rosette(x, y, 7 * s, 5)} fill={BLUSH} />
      <path d={rosette(x, y, 4 * s, 5)} fill={ROSE} opacity="0.6" />
      <circle cx={x} cy={y} r={1.8 * s} fill={GOLD_DEEP} />
    </g>
  );
  return (
    <g>
      {cluster(40, 96, 1)}
      {cluster(180, 96, 1)}
      {cluster(22, 262, 1.15)}
      {cluster(198, 262, 1.15)}
      {cluster(36, 276, 0.8)}
      {cluster(184, 276, 0.8)}
    </g>
  );
}

/**
 * Cusped-arch gold frame. The photograph is only cropped to fit the window
 * (no filters or retouching); `align` picks which part stays visible.
 */
export const PhotoFrame = memo(function PhotoFrame({
  src,
  alt,
  initial,
  align = 'xMidYMin',
  variant,
  className = '',
}: {
  src: string;
  alt: string;
  initial: string;
  align?: string;
  variant: 'groom' | 'bride';
  className?: string;
}) {
  const id = `pf${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const gold = `url(#${id}g)`;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(false);
    img.src = src;
  }, [src]);

  return (
    <svg viewBox="0 0 220 300" className={className} role="img" aria-label={alt}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3dc9e" />
          <stop offset="0.35" stopColor="#c5a46d" />
          <stop offset="0.6" stopColor="#e6cd92" />
          <stop offset="1" stopColor="#9c7b45" />
        </linearGradient>
        <linearGradient id={`${id}p`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4ead6" />
          <stop offset="1" stopColor="#e6d3ae" />
        </linearGradient>
        <pattern id={`${id}d`} width="5" height="5" patternUnits="userSpaceOnUse">
          <circle cx="2.5" cy="2.5" r="0.9" fill="#c5a46d" />
        </pattern>
        <clipPath id={`${id}w`}>
          <path d={WINDOW.shape} />
        </clipPath>
        <clipPath id={`${id}o`}>
          <path d={`M0 0 H220 V300 H0Z ${WINDOW.shape}`} clipRule="evenodd" />
        </clipPath>
      </defs>

      {/* the photograph, or a quiet placeholder until it is added */}
      <g clipPath={`url(#${id}w)`}>
        <rect x="0" y="0" width="220" height="300" fill={`url(#${id}p)`} />
        {loaded ? (
          <image href={src} x="34" y="36" width="152" height="232" preserveAspectRatio={`${align} slice`} />
        ) : (
          <g>
            <g fill="none" stroke="#c5a46d" strokeWidth="0.7" opacity="0.6">
              <circle cx="110" cy="160" r="52" />
              <path d={rosette(110, 160, 46, 12)} />
              <circle cx="110" cy="160" r="30" strokeDasharray="1.5 3" />
            </g>
            <text x="110" y="173" textAnchor="middle" fontSize="38" fontWeight="700" fill="#9c7b45" style={{ fontFamily: 'var(--font-rasa), serif' }}>
              {initial}
            </text>
            <text x="110" y="238" textAnchor="middle" fontSize="9" fontStyle="italic" fill="#9c7b45" style={{ fontFamily: 'var(--font-cormorant), serif', letterSpacing: '0.08em' }}>
              Photograph coming soon
            </text>
          </g>
        )}
      </g>

      {/* layered gold mouldings outside the window */}
      <g clipPath={`url(#${id}o)`} fill="none" strokeLinejoin="round">
        <path d={WINDOW.shape} stroke={gold} strokeWidth="40" />
        <path d={WINDOW.shape} stroke="#fbf6ea" strokeWidth="33" />
        <path d={WINDOW.shape} stroke={`url(#${id}d)`} strokeWidth="29" />
        <path d={WINDOW.shape} stroke={gold} strokeWidth="19" />
        <path d={WINDOW.shape} stroke="#f1e2c2" strokeWidth="13" />
        <path d={WINDOW.shape} stroke={gold} strokeWidth="7" />
      </g>
      <path d={WINDOW.shape} fill="none" stroke="#6e5230" strokeOpacity="0.55" strokeWidth="1.4" />

      {/* crowning lotus */}
      <g transform="translate(110 12)">
        <path d="M0 -10 C-5 -4 -5 4 0 9 C5 4 5 -4 0 -10 Z" fill={gold} stroke={GOLD_DEEP} strokeWidth="0.5" />
        <path d="M0 9 C-10 4 -15 -2 -15 -5 C-9 -4 -4 0 0 9 Z M0 9 C10 4 15 -2 15 -5 C9 -4 4 0 0 9 Z" fill={gold} stroke={GOLD_DEEP} strokeWidth="0.5" />
        <circle cx="0" cy="12" r="2" fill={GOLD_DEEP} />
      </g>

      {/* base with rosettes */}
      <rect x="14" y="282" width="192" height="8" rx="2" fill={gold} />
      <path d="M20 292 H200" stroke={GOLD_DEEP} strokeWidth="0.8" />
      {[14, 206].map((x) => (
        <g key={x}>
          <path d={rosette(x, 286, 8, 8)} fill={gold} stroke={GOLD_DEEP} strokeWidth="0.4" />
          <circle cx={x} cy="286" r="2.4" fill={variant === 'bride' ? ROSE : SAGE} />
        </g>
      ))}

      {variant === 'bride' && <Blossoms />}
    </svg>
  );
});
