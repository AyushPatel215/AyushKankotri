'use client';

import { memo, type CSSProperties } from 'react';
import { BRIDE, GROOM } from '@/data/wedding';
import { Ganesh, Heart, Mandala, Ornament, Toran } from './Decorations';

const d = (ms: number) => ({ ['--d' as string]: `${ms}ms` }) as CSSProperties;

/** Cover — two carved nude-toned doors under a toran that swing open on tap */
export const OpeningScreen = memo(function OpeningScreen({
  opening,
  onOpen,
}: {
  opening: boolean;
  onOpen: () => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-40 doors overflow-hidden ${opening ? 'is-opening pointer-events-none' : ''}`}
      style={{ height: '100svh' }}
      role="dialog"
      aria-label="શુભ વિવાહ કંકોત્રી"
    >
      {/* Each door carries half of one mandala, so it splits down the seam */}
      <div className="door door-left">
        <div className="door-frame" />
        <Mandala size={520} opacity={0.22} className="absolute top-1/2 -right-[260px] -mt-[260px]" />
      </div>
      <div className="door door-right">
        <div className="door-frame" />
        <Mandala size={520} opacity={0.22} className="absolute top-1/2 -left-[260px] -mt-[260px]" />
      </div>

      <div className="cover-toran absolute inset-x-0 top-0 z-20" style={{ paddingTop: 'var(--safe-top)' }}>
        <Toran />
      </div>

      <div
        className="cover-content absolute inset-0 z-10 flex flex-col items-center justify-center text-center safe-x"
        style={{
          paddingTop: 'calc(var(--safe-top) + 60px)',
          paddingBottom: 'calc(var(--safe-bottom) + 20px)',
          background:
            'radial-gradient(ellipse 70% 55% at 50% 50%, rgba(251,243,234,0.92), rgba(251,243,234,0.4) 70%, transparent)',
        }}
      >
        <div className="cover-in" style={d(150)}>
          <Ganesh size={74} className="mx-auto w-[clamp(54px,10svh,78px)] h-auto" />
        </div>

        <p
          className="cover-in mt-2 font-gu font-bold text-bronze leading-tight"
          style={{ ...d(350), fontSize: 'clamp(1.4rem, min(7vw, 4.2svh), 2.2rem)' }}
        >
          શ્રી ગણેશાય નમઃ
        </p>

        <h1
          className="cover-in gold-text shimmer font-gu font-bold leading-tight mt-1"
          style={{ ...d(550), fontSize: 'clamp(2.5rem, min(13vw, 8svh), 4.2rem)' }}
        >
          શુભ વિવાહ
        </h1>

        <div className="cover-in" style={d(750)}>
          <Ornament />
        </div>

        <p
          className="cover-in mt-[clamp(8px,2svh,18px)] flex items-center gap-3 font-script text-cocoa leading-none py-1"
          style={{ ...d(1000), fontSize: 'clamp(2.3rem, min(11vw, 7svh), 3.2rem)' }}
        >
          {GROOM.en} <Heart size={20} /> {BRIDE.en}
        </p>

        <p className="cover-in mt-2 font-gu font-semibold text-bronze text-[1.05rem]" style={d(1150)}>
          ૨૦ - ૨૧ ફેબ્રુઆરી ૨૦૨૭
        </p>

        <div className="cover-in mt-[clamp(18px,4.5svh,40px)]" style={d(1300)}>
          <button
            type="button"
            onClick={onOpen}
            className="gold-btn glow-btn min-h-[54px] min-w-[220px] px-8 rounded-full font-gu font-bold text-[1.2rem]
                       transition-transform duration-200 active:scale-95 hover:scale-[1.03]"
          >
            કંકોત્રી ખોલો
          </button>
          <p className="mt-3 font-serif italic text-bronze/80 text-base">Tap to open the invitation</p>
        </div>
      </div>
    </div>
  );
});
