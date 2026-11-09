'use client';

import { memo, type CSSProperties } from 'react';
import { preload } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { BOOKLET, BRIDE, GROOM } from '@/data/wedding';
import { Countdown } from './Countdown';
import { Separator } from './invitation/Ornaments';
import { Rise } from './RiseText';

/**
 * First page of the website, revealed as the kankotri opens: the golden Ganesha
 * picture with the full welcome text on its plain lower area. Scrolling starts here.
 */
export const WelcomeSection = memo(function WelcomeSection({ target, started }: { target: string; started: boolean }) {
  // fetch the picture while the doors and the kankotri are still playing
  preload(BOOKLET.ganeshaImage, { as: 'image', fetchPriority: 'high' });

  const vars = {
    '--gw-img': `url("${BOOKLET.ganeshaImage}")`,
    '--gw-ratio': BOOKLET.ganeshaImageRatio,
    '--gw-start': BOOKLET.textStart,
    '--gw-color': BOOKLET.pageColor,
  } as CSSProperties;

  return (
    <section id="welcome" className={`gw-section ${started ? 'is-started' : ''}`} style={vars}>
      <div className="gw-backdrop" aria-hidden="true" />

      <div className="gw-column">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BOOKLET.ganeshaImage} alt="Lord Ganesha" className="gw-image" fetchPriority="high" />
        <div className="gw-fade" aria-hidden="true" />

        <div className="gw-content safe-x">
          <Rise when={started} delay={500}>
            <p className="gw-invocation">{BOOKLET.invocation}</p>
          </Rise>

          <Rise when={started} delay={700}>
            <h1 className="font-gu font-bold leading-tight gold-text shimmer" style={{ fontSize: 'clamp(2.8rem, 14vw, 4.2rem)' }}>
              {BOOKLET.titleGu}
            </h1>
            <p className="gw-title-en">{BOOKLET.titleEn}</p>
          </Rise>

          <Rise when={started} delay={900}>
            <Separator className="w-44 h-auto my-4" />
          </Rise>

          <Rise when={started} delay={1050}>
            <p className="gw-couple">
              {BRIDE.en} <span className="gw-amp">&amp;</span> {GROOM.en}
            </p>
          </Rise>

          <Rise when={started} delay={1250} className="mt-5">
            <p className="gw-message">{BOOKLET.message}</p>
            <p className="gw-message gw-presence">{BOOKLET.presence}</p>
          </Rise>

          <Rise when={started} delay={1450} className="mt-7 flex flex-col items-center leading-snug">
            <span className="font-gu font-bold gw-strong text-xl">શનિવાર - રવિવાર</span>
            <span className="font-gu font-bold gw-strong text-xl">૨૦ - ૨૧ ફેબ્રુઆરી ૨૦૨૭</span>
            <span className="font-serif italic gw-soft text-base">20 - 21 February 2027</span>
          </Rise>

          <Rise when={started} delay={1650} className="mt-7">
            <p className="font-gu font-semibold gw-strong tracking-wide text-[0.95rem]">{BOOKLET.hostsLabel}</p>
            {BOOKLET.hosts.map((h) => (
              <p key={h} className="font-gu font-semibold gw-ink leading-relaxed" style={{ fontSize: 'clamp(1.02rem, 4.4vw, 1.15rem)' }}>
                {h}
              </p>
            ))}
            <p className="mt-1 font-gu font-semibold gw-strong text-[1.02rem]">{BOOKLET.family}</p>
          </Rise>

          <Rise when={started} delay={1850} className="mt-10 w-full">
            <p className="font-gu gw-ink text-base mb-4">લગ્નોત્સવની શરૂઆતને બાકી</p>
            <Countdown target={target} />
          </Rise>

          <Rise when={started} delay={2100} className="mt-10">
            <a
              href="#groom"
              aria-label="નીચે જુઓ"
              className="bob inline-flex h-12 w-12 items-center justify-center rounded-full border border-bronze/40 gw-strong"
            >
              <ChevronDown className="w-5 h-5" />
            </a>
          </Rise>
        </div>
      </div>
    </section>
  );
});
