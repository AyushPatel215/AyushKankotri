'use client';

import { memo, useEffect, useState } from 'react';
import { toGu } from '@/lib/gujarati';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  done: boolean;
}

function calc(target: number): TimeLeft {
  const diff = Math.max(0, target - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    done: diff === 0,
  };
}

/** Countdown to the wedding — 2×2 on phones, 4×1 when there is room. Digits slide up as they change. */
export const Countdown = memo(function Countdown({ target }: { target: string }) {
  const targetMs = new Date(target).getTime();
  // null on the server so the static HTML never disagrees with the browser clock
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const update = () => setTime(calc(targetMs));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  if (time?.done) {
    return <p className="gold-text font-gu font-bold text-3xl">આજે શુભ દિવસ છે</p>;
  }

  const units = [
    { label: 'દિવસ', value: time?.days },
    { label: 'કલાક', value: time?.hours },
    { label: 'મિનિટ', value: time?.minutes },
    { label: 'સેકન્ડ', value: time?.seconds },
  ];

  return (
    <div
      className="grid grid-cols-2 min-[480px]:grid-cols-4 gap-3 w-full max-w-[320px] min-[480px]:max-w-lg mx-auto"
      role="timer"
    >
      {units.map((u) => (
        <div key={u.label} className="glass relative flex flex-col items-center justify-center rounded-2xl py-4 overflow-hidden">
          <span className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-gold-200/70 to-transparent" />
          <span
            className="font-gu font-bold leading-none h-[1.1em] overflow-hidden"
            style={{ fontSize: 'clamp(2.2rem, 10vw, 2.7rem)' }}
          >
            <span key={u.value} className="tick gold-text">
              {u.value === undefined ? '--' : toGu(u.value, 2)}
            </span>
          </span>
          <span className="mt-2 font-gu text-cocoa/90 text-base leading-none">{u.label}</span>
        </div>
      ))}
    </div>
  );
});
