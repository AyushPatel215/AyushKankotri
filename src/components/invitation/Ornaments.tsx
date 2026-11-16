import { memo } from 'react';


const GOLD = '#c5a46d';

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
