import { memo } from 'react';
import { leaf, rosette } from '../temple/geometry';

const GOLD = '#c5a46d';
const GOLD_DEEP = '#9c7b45';
const SAGE = '#8fa58b';
const BLUSH = '#e2b3ae';

/** Corner spray of gold vine, lotus buds and sage leaves (drawn for the top-left corner) */
export const FloralCorner = memo(function FloralCorner({ className = '', bloom = false }: { className?: string; bloom?: boolean }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true">
      <g fill="none" stroke={GOLD} strokeWidth="1" strokeLinecap="round">
        <path d="M6 112 C10 60 40 22 112 6" />
        <path d="M22 70 c-8 -6 -10 -16 -4 -22 M56 30 c-6 -8 -16 -10 -22 -4 M38 46 c10 -2 16 4 16 12" />
      </g>
      <g fill={SAGE} opacity="0.8">
        <path d={leaf(16, 84, 16, -20, 0.36)} />
        <path d={leaf(28, 54, 14, 40, 0.36)} />
        <path d={leaf(50, 34, 14, 10, 0.36)} />
        <path d={leaf(82, 14, 15, 70, 0.36)} />
      </g>
      <path d={rosette(30, 40, 9, 8)} fill={GOLD} opacity="0.95" />
      <circle cx="30" cy="40" r="2.6" fill="#fffaf0" />
      <path d={rosette(64, 18, 5.5, 6)} fill={GOLD} opacity="0.85" />
      <path d={rosette(12, 76, 5, 6)} fill={GOLD} opacity="0.85" />
      {bloom && (
        <g>
          <path d={rosette(46, 58, 7, 5)} fill={BLUSH} />
          <circle cx="46" cy="58" r="2.2" fill={GOLD_DEEP} />
          <path d={rosette(86, 30, 5, 5)} fill={BLUSH} />
          <circle cx="86" cy="30" r="1.6" fill={GOLD_DEEP} />
        </g>
      )}
      <g fill={GOLD_DEEP}>
        <circle cx="100" cy="10" r="1.4" />
        <circle cx="8" cy="100" r="1.4" />
      </g>
    </svg>
  );
});

/** Thin gold rule with a centred lotus */
export const Separator = memo(function Separator({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 16" className={className} aria-hidden="true">
      <path d="M4 8 H62 M98 8 H156" stroke={GOLD} strokeWidth="0.8" />
      <circle cx="58" cy="8" r="1.4" fill={GOLD} />
      <circle cx="102" cy="8" r="1.4" fill={GOLD} />
      <path d="M80 2 C76 6 76 10 80 14 C84 10 84 6 80 2 Z" fill={GOLD} />
      <path d="M80 8 C74 4 69 6 68 8 C69 10 74 12 80 8 Z M80 8 C86 4 91 6 92 8 C91 10 86 12 80 8 Z" fill={GOLD} opacity="0.75" />
    </svg>
  );
});

/** Gold lotus rule between the chapters of the kankotri sheet */
export const SheetDivider = memo(function SheetDivider() {
  return (
    <div className="sheet-divider" aria-hidden="true">
      <Separator className="sheet-divider-art" />
    </div>
  );
});
