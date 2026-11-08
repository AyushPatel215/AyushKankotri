'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { BRIDE, GROOM } from '@/data/wedding';
import { useReveal } from '@/hooks/useReveal';
import { Heart, Mandala } from './Decorations';
import { SectionTitle } from './SectionTitle';

function Portrait({
  src,
  alt,
  initial,
  delay,
}: {
  src: string;
  alt: string;
  initial: string;
  delay: number;
}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);

  // the image can fail before hydration attaches onError, so check once on mount too
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div className="photo-arch" style={{ transitionDelay: `${delay}ms` }}>
      <div className="photo-arch-inner">
        {failed ? (
          <div className="relative h-full flex items-center justify-center bg-linear-to-b from-sand-100 to-sand-200">
            <Mandala size={220} opacity={0.25} className="absolute w-[130%] h-auto max-w-none" />
            <span className="relative gold-text font-gu font-bold" style={{ fontSize: 'clamp(3rem, 16vw, 4.5rem)' }}>
              {initial}
            </span>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img ref={imgRef} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
        )}
      </div>
    </div>
  );
}

/** Groom and bride in twin gold jharokha arches */
export const CoupleSection = memo(function CoupleSection() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const rise = (ms: number) => ({ transitionDelay: `${ms}ms` });

  return (
    <section id="couple" className="section section-glow safe-x">
      <SectionTitle title="વર-વધૂ" subtitle="The bride & groom" />

      <div ref={ref} className={`relative max-w-[460px] mx-auto ${visible ? 'is-visible' : ''}`}>
        <div className="relative grid grid-cols-2 gap-[clamp(14px,5vw,28px)]">
          <Portrait src={GROOM.photo} alt={GROOM.fullEn} initial={GROOM.gu.charAt(0)} delay={200} />
          <Portrait src={BRIDE.photo} alt={BRIDE.fullEn} initial={BRIDE.gu.charAt(0)} delay={450} />

          {/* heart medallion on the seam between the two arches */}
          <span
            className={`absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full glass
                        transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
            style={rise(900)}
            aria-hidden="true"
          >
            <Heart size={22} />
          </span>
        </div>

        <div className="grid grid-cols-2 gap-[clamp(14px,5vw,28px)] mt-5 text-center">
          <div className={`rise-block ${visible ? 'is-visible' : ''}`} style={rise(700)}>
            <p className="font-gu text-bronze/80 text-sm">વરરાજા</p>
            <p className="gold-text font-gu font-bold leading-tight" style={{ fontSize: 'clamp(1.6rem, 7.5vw, 2.2rem)' }}>
              ચિ. {GROOM.gu}
            </p>
            <p className="font-serif italic text-cocoa/75 text-base">{GROOM.fullEn}</p>
          </div>
          <div className={`rise-block ${visible ? 'is-visible' : ''}`} style={rise(900)}>
            <p className="font-gu text-bronze/80 text-sm">કન્યા</p>
            <p className="gold-text font-gu font-bold leading-tight" style={{ fontSize: 'clamp(1.6rem, 7.5vw, 2.2rem)' }}>
              ચિ. {BRIDE.gu}
            </p>
            <p className="font-serif italic text-cocoa/75 text-base">{BRIDE.fullEn}</p>
          </div>
        </div>

        <p
          className={`rise-block mt-7 text-center font-script text-blush-600 leading-none ${visible ? 'is-visible' : ''}`}
          style={{ ...rise(1200), fontSize: 'clamp(2rem, 9vw, 2.5rem)' }}
        >
          Two souls, one journey
        </p>
      </div>
    </section>
  );
});
