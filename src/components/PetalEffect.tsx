'use client';

import { memo, useEffect, useState, type CSSProperties } from 'react';

const COLORS = ['#E2A9A3', '#C98B86', '#D4AF6A', '#B88A4A', '#EBC3BD'];

interface Petal {
  id: number;
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  color: string;
}

function makePetals(): Petal[] {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return [];
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowEnd = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 3;
  return Array.from({ length: lowEnd ? 7 : 12 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: 9 + Math.random() * 7,
    duration: 14 + Math.random() * 8,
    delay: -Math.random() * 18,
    drift: (Math.random() - 0.5) * 140,
    color: COLORS[i % COLORS.length],
  }));
}

/**
 * Rose and gold petals drifting behind the content (they sit under <main>,
 * so they never cover text). CSS-only, max 12 elements.
 */
export const PetalEffect = memo(function PetalEffect({ active }: { active: boolean }) {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    if (active) setPetals(makePetals());
  }, [active]);

  if (!active || petals.length === 0) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden print:hidden" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="petal"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 0.7,
              background: p.color,
              opacity: 0.7,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              '--drift': `${p.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
});
