'use client';

import { memo } from 'react';
import { PARENTS } from '@/data/wedding';
import { useReveal } from '@/hooks/useReveal';
import { ArchFrame, Kalash } from './Decorations';
import { SectionTitle } from './SectionTitle';
import { Rise, RiseText } from './RiseText';

/** The invitation letter inside an unveiling jharokha arch, signed by the parents */
export const InvitationSection = memo(function InvitationSection() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="invitation" className="section safe-x">
      <div ref={ref} className={`relative max-w-md mx-auto text-center ${visible ? 'is-visible' : ''}`}>
        <ArchFrame className="absolute inset-0 w-full h-full" />
        <span
          className={`absolute left-1/2 -top-2 -ml-2 w-4 h-4 rotate-45 border border-gold bg-sand transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
          style={{ transitionDelay: '1250ms' }}
          aria-hidden="true"
        />

        <div className="relative px-[clamp(18px,7vw,40px)] pt-16 pb-10">
          <Rise className="mb-2">
            <Kalash size={56} className="mx-auto" />
          </Rise>
          <SectionTitle title="સાદર નિમંત્રણ" subtitle="With joy, we invite you" />

          <RiseText
            text="પરમ કૃપાળુ પરમાત્માની અસીમ કૃપાથી તથા વડીલોના શુભ આશીર્વાદથી,"
            className="font-gu font-semibold text-bronze text-gu body-text"
          />
          <RiseText
            text="અમારા સુપુત્ર *ચિ.* *આયુષ* ના શુભ લગ્ન *ચિ.* *સૌ.* *કાં.* *પ્રિયા* સાથે નિર્ધાર્યા છે."
            className="mt-4 font-gu text-cocoa/90 text-gu body-text"
            step={45}
          />
          <RiseText
            text="આ મંગલ પ્રસંગે આપ સહપરિવાર પધારી નવદંપતીને આશીર્વાદ આપશો, એવી અમારી હાર્દિક વિનંતી છે."
            className="mt-4 font-gu text-cocoa/90 text-gu body-text"
            step={45}
          />

          <Rise className="mt-10">
            <p className="font-gu text-cocoa/70 text-base">નિમંત્રક</p>
            <p className="mt-2 font-gu font-bold text-cocoa leading-snug" style={{ fontSize: 'clamp(1.2rem, 5.2vw, 1.4rem)' }}>
              {PARENTS.fatherGu}
            </p>
            <p className="font-serif italic text-bronze/80 text-base">{PARENTS.fatherEn}</p>
            <p className="font-script text-blush-600 text-3xl leading-none my-2">&amp;</p>
            <p className="font-gu font-bold text-cocoa leading-snug" style={{ fontSize: 'clamp(1.2rem, 5.2vw, 1.4rem)' }}>
              {PARENTS.motherGu}
            </p>
            <p className="font-serif italic text-bronze/80 text-base">{PARENTS.motherEn}</p>
            <p className="gold-text font-gu font-bold text-3xl mt-6">{PARENTS.familyGu}</p>
          </Rise>
        </div>
      </div>
    </section>
  );
});
