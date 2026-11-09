'use client';

import { memo } from 'react';
import { BRIDE, GROOM, weddingDetails } from '@/data/wedding';
import { FloralCorner, Separator } from './invitation/Ornaments';
import { PhotoFrame } from './invitation/PhotoFrame';
import { Rise } from './RiseText';

const PERSON = {
  groom: {
    ...weddingDetails.groom,
    eyebrow: 'વરરાજા',
    heading: 'Introducing the Groom',
    relation: 'Son of',
    initial: GROOM.gu.charAt(0),
  },
  bride: {
    ...weddingDetails.bride,
    eyebrow: 'કન્યા',
    heading: 'Introducing the Bride',
    relation: 'Daughter of',
    initial: BRIDE.gu.charAt(0),
  },
};

/** Shown when a detail has not been provided yet — never invented */
function Detail({ value, placeholder }: { value: string; placeholder: string }) {
  return value ? <>{value}</> : <span className="ps-placeholder">{placeholder}</span>;
}

/** Groom / bride introduction — a matching pair; the bride's adds blush florals */
export const PersonSection = memo(function PersonSection({ who }: { who: 'groom' | 'bride' }) {
  const p = PERSON[who];
  const bride = who === 'bride';
  return (
    <section id={who} className="section safe-x relative overflow-hidden">
      {bride && (
        <div aria-hidden="true">
          <FloralCorner bloom className="ps-corner tl" />
          <FloralCorner bloom className="ps-corner tr" />
        </div>
      )}
      <div className="relative max-w-md mx-auto flex flex-col items-center text-center">
        <Rise>
          <p className="font-gu font-semibold text-bronze tracking-wide text-lg">{p.eyebrow}</p>
          <h2 className="ps-heading">{p.heading}</h2>
        </Rise>

        <Rise delay={150} className="ps-photo">
          <div className="ps-photo-glow" aria-hidden="true" />
          <PhotoFrame
            src={p.photo}
            alt={p.name}
            initial={p.initial}
            align={p.photoAlign}
            variant={who}
            className="relative w-full h-full"
          />
        </Rise>

        <Rise delay={250} className="mt-7">
          <p className="ps-name">{p.name}</p>
          <p className="mt-1 font-gu font-semibold text-cocoa/80 text-lg">{p.nameGu}</p>
        </Rise>

        <Rise delay={350}>
          <Separator className="w-40 h-auto my-4" />
        </Rise>

        <Rise delay={450}>
          <p className="font-serif italic text-cocoa/75 text-lg">{p.relation}</p>
          <p className="ps-parent">
            <Detail value={p.fatherName} placeholder="Father's full name" />
          </p>
          <p className="font-serif italic text-gold text-lg leading-tight">&amp;</p>
          <p className="ps-parent">
            <Detail value={p.motherName} placeholder="Mother's full name" />
          </p>
        </Rise>
      </div>
    </section>
  );
});
