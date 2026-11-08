'use client';

import { memo, useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { BRIDE, GROOM, LETTER } from '@/data/wedding';
import { Mandala } from './Decorations';
import { Peacock } from './Peacock';
import { WaxSeal } from './WaxSeal';

/**
 * idle      → letter waiting to be touched
 * pressing  → wax seal pressed in (tactile feedback)
 * opening   → the two gatefold panels swing open in 3D, the seal splits along the seam
 * revealing → the opened card drifts toward the guest and dissolves into ivory light
 * opened    → plain soft-ivory screen; onOpened() has fired, the next stage takes over
 */
export type LetterState = 'idle' | 'pressing' | 'opening' | 'revealing' | 'opened';

const TIMING = {
  normal: { press: 280, open: 1750, reveal: 1150 },
  reduced: { press: 0, open: 0, reveal: 600 },
};

const d = (ms: number) => ({ ['--d' as string]: `${ms}ms` }) as CSSProperties;

/** Small filigree for the four inside corners of the card */
function CardCorner({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`lt-card-corner ${className}`} aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round">
        <path d="M2 24 V7 Q2 2 7 2 H24" />
        <path d="M7 18 C7 11 11 7 18 7" />
        <path d="M11 12 c2 -3 5 -3 6 -1 c1 2 -2 3 -3.5 2" />
      </g>
      <circle cx="26.5" cy="2" r="1" fill="currentColor" />
      <circle cx="2" cy="26.5" r="1" fill="currentColor" />
    </svg>
  );
}

/** Traditional vine-and-paisley ornament for the screen corners */
function ScreenCorner({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 160 160" className={`lt-corner ${className}`} aria-hidden="true">
      <g fill="none" stroke="#b08d4e" strokeWidth="0.8" strokeLinecap="round">
        <path d="M2 150 C 22 96, 96 22, 150 2" />
        <path d="M2 112 C 18 70, 70 18, 112 2" opacity="0.6" />
        {/* paisley */}
        <path d="M44 64 C 30 60, 28 40, 42 34 C 56 28, 70 42, 64 58 C 60 70, 46 78, 34 76 C 44 72, 50 66, 44 64Z" />
        <path d="M45 58 C 38 56, 38 46, 45 43 C 52 40, 58 48, 54 55" opacity="0.7" />
        {/* leaves along the vine */}
        <path d="M24 108 q -12 -4 -14 -16 q 12 2 14 16Z M108 24 q -4 -12 -16 -14 q 2 12 16 14Z" />
        <path d="M80 50 q 2 -12 14 -16 q -2 12 -14 16Z M50 80 q -12 2 -16 14 q 12 -2 16 -14Z" />
      </g>
      <g fill="#b08d4e">
        <circle cx="42" cy="49" r="1.6" />
        <circle cx="16" cy="128" r="1.4" />
        <circle cx="128" cy="16" r="1.4" />
        <circle cx="70" cy="70" r="1.2" />
      </g>
    </svg>
  );
}

/** Front of the folded card — rendered once per gatefold panel and clipped to its half */
function CardFace() {
  return (
    <div className="lt-face-content">
      <div className="lt-fold" />
      <div className="lt-rule" />
      <CardCorner className="tl" />
      <CardCorner className="tr" />
      <CardCorner className="bl" />
      <CardCorner className="br" />

      <div className="lt-peacock">
        {LETTER.peacockImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={LETTER.peacockImage} alt="" className="w-full h-auto" />
        ) : (
          <Peacock className="w-full h-auto" />
        )}
      </div>

      <p className="lt-in lt-title font-gu font-bold gold-text" style={d(1350)}>
        {LETTER.titleGu}
      </p>
      <div className="lt-in lt-divider" style={d(1500)}>
        <span />
        <i />
        <span />
      </div>

      <p className="lt-in lt-name font-serif" style={d(1700)}>
        {BRIDE.en}
      </p>
      <p className="lt-in lt-amp font-serif" style={d(1850)}>
        &amp;
      </p>
      <p className="lt-in lt-name font-serif" style={d(2000)}>
        {GROOM.en}
      </p>

      <p className="lt-in lt-copy font-serif" style={d(2250)}>
        {LETTER.blessing}
      </p>
      <p className="lt-in lt-copy font-serif" style={d(2400)}>
        {LETTER.invite}
      </p>

      <div className="lt-seal-slot">
        <div className="lt-seal">
          {LETTER.sealImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={LETTER.sealImage} alt="" className="w-full h-auto" />
          ) : (
            <WaxSeal className="w-full h-auto" />
          )}
        </div>
      </div>
    </div>
  );
}

function Panel({ side }: { side: 'l' | 'r' }) {
  return (
    <div className={`lt-flap lt-flap-${side}`}>
      <div className="lt-face lt-front">
        <CardFace />
        <div className="lt-shade" />
      </div>
      <div className="lt-face lt-back">
        <div className="lt-back-rule" />
      </div>
    </div>
  );
}

/**
 * Phase 1 opening: a sealed gatefold invitation on handmade ivory paper.
 * `onOpenStart` runs inside the guest's tap (safe place to start audio);
 * `onOpened` runs once the screen has settled to plain ivory.
 */
export const InvitationLetter = memo(function InvitationLetter({
  onOpenStart,
  onOpened,
}: {
  onOpenStart?: () => void;
  onOpened?: () => void;
}) {
  const [state, setState] = useState<LetterState>('idle');
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach(clearTimeout);
  }, []);

  const open = useCallback(() => {
    if (state !== 'idle') return;
    onOpenStart?.();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const t = reduced ? TIMING.reduced : TIMING.normal;
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms));

    setState('pressing');
    at(t.press, () => setState('opening'));
    at(t.press + t.open, () => setState('revealing'));
    at(t.press + t.open + t.reveal, () => {
      setState('opened');
      onOpened?.();
    });
  }, [state, onOpenStart, onOpened]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    }
  };

  const names = `${BRIDE.en} & ${GROOM.en}`;

  return (
    <div className={`lt-screen is-${state}`} role="dialog" aria-label={`${LETTER.titleGu} — ${names}`}>
      <div className="lt-bg" aria-hidden="true" />
      <ScreenCorner className="c-tl" />
      <ScreenCorner className="c-tr" />
      <ScreenCorner className="c-bl" />
      <ScreenCorner className="c-br" />

      <div className="lt-stage">
        <div className="lt-enter">
          <div
            className="lt-card"
            role="button"
            tabIndex={state === 'idle' ? 0 : -1}
            aria-label={`${LETTER.hint}: ${names}`}
            aria-disabled={state !== 'idle'}
            onClick={open}
            onKeyDown={onKey}
          >
            <div className="lt-inside" aria-hidden="true">
              <Mandala size={260} opacity={0.16} className="lt-inside-mandala" />
            </div>
            <div className="lt-panels" aria-hidden="true">
              <Panel side="l" />
              <Panel side="r" />
            </div>
            <span className="sr-only">
              {LETTER.titleGu}. {names}. {LETTER.blessing} {LETTER.invite}
            </span>
          </div>
        </div>

        <div className="lt-hint-wrap" aria-hidden="true">
          <p className="lt-in lt-hint font-serif" style={d(3300)}>
            <span className="lt-breathe">{LETTER.hint}</span>
          </p>
        </div>
      </div>

      <div className="lt-bloom" aria-hidden="true" />
    </div>
  );
});
