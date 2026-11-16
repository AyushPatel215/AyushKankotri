'use client';

import { memo } from 'react';
import { CalendarHeart } from 'lucide-react';
import { BRIDE, GROOM, SCHEDULE } from '@/data/wedding';
import { Heart, Mandala, Ornament } from './Decorations';
import { SectionTitle } from './SectionTitle';
import { VenueButton } from './TimelineSection';
import { Rise, RiseText } from './RiseText';

export const FinalSection = memo(function FinalSection() {
  return (
    <>
      <section id="final" className="section safe-x overflow-hidden">
        <div className="relative max-w-md mx-auto text-center">
          <SectionTitle title="આપ જરૂર પધારજો" />

          <RiseText text="આપના આગમનની રાહ જોઈશું." className="font-gu text-cocoa/90 text-gu body-text" />
          <RiseText
            text="આપના આશીર્વાદ એ જ અમારી ભેટ."
            className="font-gu text-cocoa/90 text-gu body-text"
            delay={250}
          />

          <Rise className="mt-10 fn-dates">
            <CalendarHeart className="mx-auto w-7 h-7 text-bronze" strokeWidth={1.5} aria-hidden="true" />
            {SCHEDULE.map((day, i) => (
              <div key={day.date}>
                {i > 0 && <Ornament className="mx-auto my-5" />}
                <p className={`${i === 0 ? 'mt-3' : ''} font-gu text-cocoa/75 text-base`}>
                  {day.events.length > 1
                    ? `${day.events[0].name} થી ${day.events[day.events.length - 1].name}`
                    : day.events[0].name}
                </p>
                <p className="gold-text font-gu font-bold leading-tight mt-1" style={{ fontSize: 'clamp(1.4rem, 6.4vw, 1.7rem)' }}>
                  {day.weekdayGu}, {day.dateGu}
                </p>
                <p className="font-serif italic text-bronze text-base">
                  {day.weekday}, {day.date}
                </p>
                {day.venueMap && (
                  <div className="mt-4 flex justify-center">
                    <VenueButton href={day.venueMap} />
                  </div>
                )}
              </div>
            ))}
          </Rise>

          <Rise className="mt-12">
            <p className="font-script text-blush-600 leading-none" style={{ fontSize: 'clamp(2.2rem, 10vw, 2.8rem)' }}>
              With love
            </p>
            <p
              className="mt-3 font-script text-cocoa leading-tight flex flex-wrap items-center justify-center gap-x-2"
              style={{ fontSize: 'clamp(2rem, 9vw, 2.6rem)' }}
            >
              {GROOM.en} <Heart size={18} /> {BRIDE.en}
            </p>
          </Rise>
        </div>
        <Mandala
          size={420}
          className="spin-slow absolute left-1/2 -bottom-[210px] -ml-[210px] pointer-events-none"
          opacity={0.12}
        />
      </section>

      <footer className="safe-x pt-2 text-center" style={{ paddingBottom: 'calc(var(--safe-bottom) + 96px)' }}>
        <p className="font-gu font-semibold text-bronze text-lg">॥ જય શ્રી રામ ॥</p>
      </footer>
    </>
  );
});
