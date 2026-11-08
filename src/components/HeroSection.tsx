'use client';

import { memo } from 'react';
import { ChevronDown } from 'lucide-react';
import { BRIDE, GROOM } from '@/data/wedding';
import { Countdown } from './Countdown';
import { Ganesh, Heart, Mandala, Ornament, Toran } from './Decorations';
import { Rise, RiseText } from './RiseText';

/** First view after the scratch card — words rise in one after another */
export const HeroSection = memo(function HeroSection({ target, started }: { target: string; started: boolean }) {
  return (
    <section
      id="hero"
      className="relative flex flex-col items-center text-center safe-x pb-16 overflow-hidden"
      style={{ minHeight: '100svh', paddingTop: 'calc(var(--safe-top) + 80px)' }}
    >
      <div className="absolute inset-x-0 top-0 z-10" style={{ paddingTop: 'var(--safe-top)' }}>
        <Toran />
      </div>

      <Mandala
        size={560}
        className="spin-slow absolute left-1/2 top-[30%] -ml-[280px] -mt-[280px] pointer-events-none"
        opacity={0.14}
      />

      <div className="relative w-full max-w-md flex flex-col items-center">
        <Rise when={started} delay={150}>
          <Ganesh size={88} />
        </Rise>

        <RiseText
          when={started}
          delay={400}
          text="શ્રી ગણેશાય નમઃ"
          className="mt-4 font-gu font-bold text-bronze leading-tight"
          style={{ fontSize: 'clamp(1.8rem, 8.5vw, 2.6rem)' }}
        />

        <Rise when={started} delay={650} className="mt-2">
          <p className="font-gu text-cocoa/80 text-gu" style={{ fontSize: 'clamp(0.98rem, 4vw, 1.1rem)' }}>
            વક્રતુંડ મહાકાય સૂર્યકોટિ સમપ્રભ ।
            <br />
            નિર્વિઘ્નં કુરુ મે દેવ સર્વકાર્યેષુ સર્વદા ॥
          </p>
        </Rise>

        <RiseText
          as="h1"
          when={started}
          delay={900}
          step={240}
          text="શુભ વિવાહ"
          className="mt-3 font-gu font-bold leading-tight"
          wordClassName="gold-text shimmer"
          style={{ fontSize: 'clamp(3rem, 15vw, 4.8rem)' }}
        />

        <Rise when={started} delay={1300}>
          <Ornament />
        </Rise>

        <Rise
          when={started}
          delay={1500}
          className="mt-5 flex items-center gap-3 font-script text-cocoa leading-none py-1"
        >
          <span style={{ fontSize: 'clamp(2.6rem, 13vw, 3.6rem)' }}>{GROOM.en}</span>
          <Heart size={22} />
          <span style={{ fontSize: 'clamp(2.6rem, 13vw, 3.6rem)' }}>{BRIDE.en}</span>
        </Rise>

        <Rise when={started} delay={1700} className="mt-3 flex flex-col items-center leading-snug">
          <span className="font-gu font-bold text-bronze text-xl">શનિવાર - રવિવાર</span>
          <span className="font-gu font-bold text-bronze text-xl">૨૦ - ૨૧ ફેબ્રુઆરી ૨૦૨૭</span>
          <span className="font-serif italic text-cocoa/80 text-base">20 - 21 February 2027</span>
        </Rise>

        <Rise when={started} delay={2100} className="mt-9 w-full">
          <p className="font-gu text-cocoa/85 text-base mb-4">લગ્નોત્સવની શરૂઆતને બાકી</p>
          <Countdown target={target} />
        </Rise>

        <Rise when={started} delay={2400} className="mt-10">
          <a
            href="#couple"
            aria-label="નીચે જુઓ"
            className="bob inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-bronze"
          >
            <ChevronDown className="w-5 h-5" />
          </a>
        </Rise>
      </div>
    </section>
  );
});
