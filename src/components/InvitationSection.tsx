'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { PARENTS } from '@/data/wedding';
import { Kalash } from './Decorations';
import { SectionTitle } from './SectionTitle';
import { Rise, RiseText } from './RiseText';
import { WaxSeal } from './WaxSeal';

/** Gold scroll rod with jewelled finials; the top one carries kumkum-red tassels */
function Rod({ tassels = false }: { tassels?: boolean }) {
  return (
    <svg viewBox="0 0 420 44" className="iv-rod" aria-hidden="true">
      <defs>
        <linearGradient id={tassels ? 'iv-rod-t' : 'iv-rod-b'} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f6dfa0" />
          <stop offset="0.35" stopColor="#d7ad5c" />
          <stop offset="0.7" stopColor="#a87a32" />
          <stop offset="1" stopColor="#7c5520" />
        </linearGradient>
      </defs>
      {tassels && (
        <g stroke="#9e2b2b" strokeWidth="1.4" strokeLinecap="round">
          <path d="M44 22 V36 M376 22 V36" />
          <path d="M40 36 l4 6 4 -6 Z M372 36 l4 6 4 -6 Z" fill="#9e2b2b" />
        </g>
      )}
      <rect x="34" y="12" width="352" height="20" rx="10" fill={`url(#${tassels ? 'iv-rod-t' : 'iv-rod-b'})`} />
      <path d="M40 16 H380" stroke="#fff4cf" strokeOpacity="0.7" strokeWidth="1.5" strokeLinecap="round" />
      {[24, 396].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="22" r="12" fill={`url(#${tassels ? 'iv-rod-t' : 'iv-rod-b'})`} />
          <circle cx={cx} cy="22" r="5" fill="#9e2b2b" />
          <circle cx={cx - 1.5} cy="20.5" r="1.6" fill="#ffd9d0" opacity="0.8" />
          <path d={`M${cx < 200 ? cx - 12 : cx + 12} 22 l${cx < 200 ? -10 : 10} -5 v10 Z`} fill="#b8873e" />
        </g>
      ))}
    </svg>
  );
}

// While unrolling, the page glides along so the lower roller stays at this point of the screen
const ROLLER_AT = 0.86;
const UNROLL_MS = 3000;

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * The invitation letter as a royal patra, rolled and sealed in wax. Tapping the seal
 * breaks it and the scroll unrolls top to bottom, like a king's farman; it stays open.
 */
export const InvitationSection = memo(function InvitationSection() {
  const scroll = useRef<HTMLDivElement>(null);
  const clip = useRef<HTMLDivElement>(null);
  const paper = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);

  const unroll = useCallback(() => {
    const box = scroll.current;
    const win = clip.current;
    const sheet = paper.current;
    const roller = bottom.current;
    if (opened || !box || !win || !sheet || !roller) return;
    setOpened(true);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const full = sheet.offsetHeight;
    const start = performance.now() + 450; // let the seal lift away first

    const step = (now: number) => {
      const t = reduced ? 1 : Math.min(1, Math.max(0, (now - start) / UNROLL_MS));
      const e = ease(t);
      win.style.height = `${full * e}px`;
      box.style.setProperty('--iv-p', e.toFixed(3));
      // glide the page so the guest watches the roller travel down
      const over = roller.getBoundingClientRect().bottom - window.innerHeight * ROLLER_AT;
      // 'instant' — the site's smooth scrolling would otherwise lag a step behind every frame
      if (!reduced && over > 0) window.scrollBy({ top: over, behavior: 'instant' });
      if (t < 1) requestAnimationFrame(step);
      else win.style.height = 'auto'; // fully open: follow the letter's natural height from now on
    };
    requestAnimationFrame(step);
  }, [opened]);

  // printing or saving as PDF shows the letter open
  useEffect(() => {
    const toPrint = () => {
      if (clip.current) clip.current.style.height = 'auto';
      scroll.current?.style.setProperty('--iv-p', '1');
    };
    window.addEventListener('beforeprint', toPrint);
    return () => window.removeEventListener('beforeprint', toPrint);
  }, []);

  return (
    <section id="invitation" className="iv-section section safe-x">
      <div ref={scroll} className={`iv-scroll ${opened ? 'is-open' : ''}`}>
        <Rod tassels />
        <div ref={clip} className="iv-clip">
          <div ref={paper} className="iv-paper">
            <Rise className="mb-2">
              <Kalash size={56} className="mx-auto" />
            </Rise>
            <SectionTitle title="સાદર નિમંત્રણ" />

            <RiseText
              text="પરમ કૃપાળુ પરમાત્માની અસીમ કૃપાથી તથા વડીલોના શુભ આશીર્વાદથી,"
              className="font-gu font-semibold text-bronze text-gu body-text"
            />
            <RiseText
              text="અમારા સુપુત્ર *ચિ.* *આયુષ* ના શુભ લગ્ન *ચિ.* *પ્રિયા* સાથે નિર્ધાર્યા છે."
              className="mt-2 font-gu text-cocoa/90 text-gu body-text"
              step={45}
            />
            <RiseText
              text="આ મંગલ પ્રસંગે આપ સહપરિવાર પધારી નવદંપતીને આશીર્વાદ આપશો, એવી અમારી હાર્દિક વિનંતી છે."
              className="mt-2 font-gu text-cocoa/90 text-gu body-text"
              step={45}
            />

            <Rise className="mt-6">
              <p className="font-gu text-cocoa/70 text-base">નિમંત્રક</p>
              <p className="mt-2 font-gu font-bold text-cocoa leading-snug" style={{ fontSize: 'clamp(1.2rem, 5.2vw, 1.4rem)' }}>
                {PARENTS.fatherGu}
              </p>
              <p className="font-gu text-bronze text-lg leading-none my-1.5">અને</p>
              <p className="font-gu font-bold text-cocoa leading-snug" style={{ fontSize: 'clamp(1.2rem, 5.2vw, 1.4rem)' }}>
                {PARENTS.motherGu}
              </p>
              <p className="gold-text font-gu font-bold text-3xl mt-4">{PARENTS.familyGu}</p>
            </Rise>
          </div>
        </div>
        <div ref={bottom} className="iv-bottom">
          <Rod />
          {/* parchment still wound on the lower rod; it thins as the scroll unrolls */}
          <span className="iv-roll" aria-hidden="true" />
          <button
            type="button"
            className="iv-seal"
            onClick={unroll}
            disabled={opened}
            aria-label="નિમંત્રણ ખોલવા મહોર પર સ્પર્શ કરો"
          >
            <span className="iv-ribbon l" />
            <span className="iv-ribbon r" />
            <WaxSeal className="relative w-full h-auto" />
          </button>
        </div>
        <p className="iv-hint" aria-hidden="true">
          <span className="font-gu">મહોર પર સ્પર્શ કરો</span>
        </p>
      </div>
    </section>
  );
});
