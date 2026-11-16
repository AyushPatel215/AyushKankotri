'use client';

import { memo, useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { BRIDE, GROOM, LETTER } from '@/data/wedding';
import { WaxSeal } from './WaxSeal';

/**
 * idle      → letter waiting to be touched
 * pressing  → wax seal pressed in (tactile feedback)
 * opening   → the two gatefold panels swing open in 3D, the seal splits along the seam,
 *             and Radha Krishna appear inside; the card holds there for a moment
 * revealing → the opened card drifts toward the guest and dissolves into warm light
 * opened    → plain soft-ivory screen; onOpened() has fired, the next stage takes over
 */
export type LetterState = 'idle' | 'pressing' | 'opening' | 'revealing' | 'opened';

const TIMING = {
  normal: { press: 280, open: 1750, hold: 2800, reveal: 1150 },
  reduced: { press: 0, open: 0, hold: 1800, reveal: 600 },
};

const d = (ms: number) => ({ ['--d' as string]: `${ms}ms` }) as CSSProperties;

/** Front of the folded card — rendered once per gatefold panel and clipped to its half */
function CardFace() {
  return (
    <div className="lt-face-content" style={{ backgroundImage: `url("${LETTER.background}")` }}>
      <div className="lt-fold" />

      <div className="lt-greeting">
        <p className="lt-in lt-greet-eyebrow font-gu" style={d(1100)}>
          {LETTER.welcomeEyebrow}
        </p>
        <p className="lt-in lt-greet-title font-script" style={d(1300)}>
          {LETTER.welcomeTitle}
        </p>
        <p className="lt-in lt-greet-text font-serif" style={d(1500)}>
          {LETTER.welcomeText}
        </p>
      </div>

      <p className="lt-in lt-title font-gu font-bold gold-text" style={d(1750)}>
        {LETTER.titleGu}
      </p>
      <div className="lt-in lt-divider" style={d(1900)}>
        <span />
        <i />
        <span />
      </div>
      <p className="lt-in lt-couple font-serif" style={d(2050)}>
        {GROOM.en} <span className="lt-couple-amp">&amp;</span> {BRIDE.en}
      </p>
      <p className="lt-in lt-copy font-serif" style={d(2250)}>
        {LETTER.blessing}
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
  fading = false,
}: {
  onOpenStart?: () => void;
  /** fade the ivory end-screen away to reveal what comes next */
  fading?: boolean;
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
    at(t.press + t.open + t.hold, () => setState('revealing'));
    at(t.press + t.open + t.hold + t.reveal, () => {
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

  const names = `${GROOM.en} & ${BRIDE.en}`;

  return (
    <div
      className={`lt-screen is-${state} ${fading ? 'is-fading' : ''}`}
      style={{ ['--lt-card-photo' as string]: `url("${LETTER.background}")` }}
      role="dialog"
      aria-label={`${LETTER.titleGu} — ${names}`}
    >
      <div className="lt-bg" aria-hidden="true">
        <div className="lt-bg-blur" style={{ backgroundImage: `url("${LETTER.background}")` }} />
      </div>

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
              <div className="lt-inside-photo" style={{ backgroundImage: `url("${LETTER.insideImage}")` }} />
              <div className="lt-inside-glow" />
            </div>
            <div className="lt-panels" aria-hidden="true">
              <Panel side="l" />
              <Panel side="r" />
            </div>
            <span className="sr-only">
              {LETTER.titleGu}. {names}. {LETTER.blessing}
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
