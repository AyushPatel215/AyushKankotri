'use client';

import { memo, type CSSProperties } from 'react';
import { Crown, Flame, Flower2, Gift, MapPin, Sparkles, Sun, UtensilsCrossed, type LucideIcon } from 'lucide-react';
import { BRIDE, GROOM, SCHEDULE } from '@/data/wedding';
import { splitTime, toGu } from '@/lib/gujarati';
import { useReveal } from '@/hooks/useReveal';
import { SectionTitle } from './SectionTitle';
import { cuspedArch } from './temple/geometry';

const ICONS: [RegExp, LucideIcon][] = [
  [/Ganesh/i, Sparkles],
  [/Grah/i, Flame],
  [/Jamanvar/i, UtensilsCrossed],
  [/Mameru/i, Gift],
  [/Haldi/i, Sun],
  [/Jaan|Baraat/i, Crown],
];
const iconFor = (nameEn: string) => ICONS.find(([re]) => re.test(nameEn))?.[1] ?? Flower2;

// Small temple niche that holds each ceremony's icon (same arch family as the doors)
const NICHE = cuspedArch(4, 56, 30, 4, 70, 3);

type Day = (typeof SCHEDULE)[number];

/** Clay diya on the path; its flame lights when the ceremony scrolls into view */
function Diya() {
  return (
    <svg viewBox="0 0 40 44" className="ds-diya" aria-hidden="true">
      <g className="ds-flame">
        <path d="M20 4 C14 13 15 20 20 24 C25 20 26 13 20 4 Z" fill="#ffb43c" />
        <path d="M20 11 C17 16 17.5 20 20 22 C22.5 20 23 16 20 11 Z" fill="#fff1c2" />
      </g>
      <path d="M4 27 C8 38 32 38 36 27 C30 30 10 30 4 27 Z" fill="#a8562a" />
      <path d="M4 27 C10 30 30 30 36 27 C32 25 8 25 4 27 Z" fill="#d68a46" />
      <path d="M17 35 h6 l2 5 h-10 Z" fill="#8e4a1e" />
    </svg>
  );
}

function EventCard({ event, index }: { event: Day['events'][number]; index: number }) {
  const { ref, visible } = useReveal<HTMLLIElement>();
  const Icon = iconFor(event.nameEn);
  const t = event.time ? splitTime(event.time) : null;
  return (
    <li ref={ref} className={`ds-event ${visible ? 'is-lit' : ''}`} style={{ ['--i' as string]: index } as CSSProperties}>
      <div className="ds-node">
        <span className="ds-glow" />
        <Diya />
      </div>
      <div className="ds-card">
        <div className="ds-niche">
          <svg viewBox="0 0 60 74" className="ds-niche-shape" aria-hidden="true">
            <defs>
              <linearGradient id="ds-niche-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#e8c47e" />
                <stop offset="1" stopColor="#a87a32" />
              </linearGradient>
            </defs>
            <path d={NICHE.shape} fill="url(#ds-niche-g)" />
            <path d={cuspedArch(9, 51, 32, 10, 66, 3).shape} fill="#fdf6e8" />
          </svg>
          <Icon className="ds-icon" strokeWidth={1.6} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="font-gu font-bold text-cocoa text-[1.14rem] leading-snug">{event.name}</p>
        </div>
        {t && (
          <div className="shrink-0 text-right pl-1">
            <p className="font-gu text-bronze/80 text-xs leading-none">{t.periodGu}</p>
            <p className="gold-text font-serif font-bold text-[1.55rem] leading-none mt-1 tabular-nums">{t.clock}</p>
            <p className="font-serif text-cocoa/60 text-xs leading-none mt-0.5">{t.meridiem}</p>
          </div>
        )}
      </div>
    </li>
  );
}

/**
 * Full-page picture for a day, with the couple's names set live in the sky.
 * Coordinates are in the picture's pixels (1045 × 1601); the original lettering
 * is covered by sky colours sampled around it.
 */
const SKY: [number, string, string, string][] = [
  [505, '#f0d9ba', '#f6dfb6', '#fae3ba'],
  [530, '#f2dab7', '#f8e0b5', '#fbe4bb'],
  [555, '#f4dcb8', '#f8e0b5', '#f9e2b9'],
  [580, '#f6dcb9', '#f8deb7', '#f8debd'],
  [605, '#f4dbb3', '#f7ddb4', '#f8debc'],
  [630, '#f5dcb1', '#f8deb2', '#f9dfba'],
  [655, '#f9deb3', '#fbe0b2', '#fae1b8'],
  [680, '#f9deb3', '#fbe0b2', '#fae1b8'],
  [705, '#f7dcb1', '#fadeb1', '#fae1b8'],
  [730, '#f8ddb2', '#fbdfb2', '#fbe1b8'],
  [755, '#f7dfb3', '#fbe0b2', '#fbe1b7'],
  [780, '#fadfb5', '#fce1b3', '#fae3b7'],
  [805, '#fbdfb7', '#fce1b3', '#f9e4b5'],
  [830, '#f8dcb4', '#fbdfb1', '#fae4b5'],
  [855, '#f7dbb3', '#fadeaf', '#f9e3b1'],
  [880, '#f7dbb3', '#fadeaf', '#f9e3b1'],
  [480, '#f0d9ba', '#f6dfb6', '#fae3ba'],
];
/** picture pixel → cqw, for a picture `width` pixels wide */
const at = (y: number, width = 1045) => ({ top: `${(y / width) * 100}cqw` });

function CoupleScene({ src, events }: { src: string; events: Day['events'] }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`ds-scene ${visible ? 'is-visible' : ''}`} style={{ backgroundImage: `url("${src}")` }}>
      <svg viewBox="0 0 1045 1601" className="ds-scene-art" aria-hidden="true">
        <defs>
          {SKY.map(([y, l, c, r]) => (
            <linearGradient key={y} id={`ds-sky-${y}`} gradientUnits="userSpaceOnUse" x1="345" y1="0" x2="765" y2="0">
              <stop offset="0" stopColor={l} />
              <stop offset="0.5" stopColor={c} />
              <stop offset="1" stopColor={r} />
            </linearGradient>
          ))}
          <filter id="ds-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="ds-feather" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
          <mask id="ds-sky-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1045" height="1601">
            <ellipse cx="553" cy="686" rx="262" ry="205" fill="#fff" filter="url(#ds-feather)" />
          </mask>
        </defs>
        <g mask="url(#ds-sky-mask)">
          <g filter="url(#ds-soft)">
            {SKY.map(([y]) => (
              <rect key={y} x="250" y={y - 13} width="610" height="27" fill={`url(#ds-sky-${y})`} />
            ))}
          </g>
        </g>
      </svg>

      <p className="ds-scene-name" style={at(578)}>
        {GROOM.en}
      </p>
      <p className="ds-scene-weds" style={at(676)}>
        Weds
      </p>
      <p className="ds-scene-name" style={at(778)}>
        {BRIDE.en}
      </p>

      {/* the day's ceremonies, written in the sky between the names and the palace */}
      <div className="ds-scene-event" style={at(975)}>
        <span className="ds-scene-rule" aria-hidden="true" />
        {events.map((event) => {
          const t = event.time ? splitTime(event.time) : null;
          return (
            <div key={event.nameEn}>
              <p className="ds-scene-event-gu">{event.name}</p>
              {t && <p className="ds-scene-event-en">{`${t.periodGu} ${toGu(t.clock)} વાગ્યે`}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Opens the day's venue in Google Maps */
function VenueButton({ href }: { href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="ds-venue-btn" aria-label="ગૂગલ મેપ્સ પર સ્થળ જુઓ">
      <MapPin aria-hidden="true" />
      <span className="font-gu">સ્થળ જુઓ</span>
    </a>
  );
}

/** Small lit diya between two gold rules, separating the ceremonies */
function DiyaRule() {
  return (
    <span className="ds-cer-rule" aria-hidden="true">
      <i />
      <svg viewBox="0 0 40 44">
        <g className="ds-cer-flame">
          <path d="M20 4 C14 13 15 20 20 24 C25 20 26 13 20 4 Z" fill="#ffb43c" />
          <path d="M20 11 C17 16 17.5 20 20 22 C22.5 20 23 16 20 11 Z" fill="#fff1c2" />
        </g>
        <path d="M4 27 C8 38 32 38 36 27 C30 30 10 30 4 27 Z" fill="#a8562a" />
        <path d="M4 27 C10 30 30 30 36 27 C32 25 8 25 4 27 Z" fill="#d68a46" />
      </svg>
      <i />
    </span>
  );
}

/**
 * The day's ceremonies set inside the temple-arch painting (1024 × 1536),
 * like a printed programme card; they appear one after another.
 */
function CeremonyScene({ src, events, venueMap }: { src: string; events: Day['events']; venueMap?: string }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`ds-scene ds-scene-arch ${visible ? 'is-visible' : ''}`} style={{ backgroundImage: `url("${src}")` }}>
      <div className="ds-cer" style={at(300, 1024)}>
        <p className="ds-cer-kicker">॥ શુભ આરંભ ॥</p>
        <p className="ds-cer-title">લગ્નોત્સવનો પ્રથમ દિવસ</p>
        <ol className="ds-cer-list">
          {events.map((event, i) => {
            const t = event.time ? splitTime(event.time) : null;
            return (
              <li key={event.nameEn} style={{ ['--i' as string]: i } as CSSProperties}>
                {i > 0 && <DiyaRule />}
                <p className="ds-cer-gu">{event.name}</p>
                {t && <p className="ds-cer-en">{`${t.periodGu} ${toGu(t.clock)} વાગ્યે`}</p>}
              </li>
            );
          })}
        </ol>
      </div>

      {venueMap && (
        <div className="ds-venue" style={at(1450, 1024)}>
          <VenueButton href={venueMap} />
        </div>
      )}
    </div>
  );
}

function DayBlock({ day, index }: { day: Day; index: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [dayNum, month] = day.dateGu.split(' ');

  return (
    <div className="ds-day">
      <div ref={ref} className={`ds-day-head ${visible ? 'is-visible' : ''}`}>
        <div className="ds-medallion">
          <span className="spin-med ds-medallion-ring" />
          <span className="ds-medallion-num gold-text font-gu font-bold">{dayNum}</span>
          <span className="font-gu text-bronze text-sm leading-none">{month}</span>
        </div>
        <p className="mt-3 font-gu text-bronze text-sm tracking-wide">
          દિવસ {toGu(index + 1)} · {day.weekdayGu}
        </p>
        <p className="font-gu font-semibold text-cocoa/80 text-lg leading-tight">{day.dateGu}</p>
      </div>

      {day.scene?.layout === 'couple' ? (
        <CoupleScene src={day.scene.image} events={day.events} />
      ) : day.scene?.layout === 'ceremonies' ? (
        <CeremonyScene src={day.scene.image} events={day.events} venueMap={day.venueMap} />
      ) : (
        <ol className="ds-path">
          {day.events.map((event, i) => (
            <EventCard key={event.nameEn} event={event} index={i} />
          ))}
        </ol>
      )}
    </div>
  );
}

/** Wedding functions as a diya-lit path; a day can open with a full-page scene */
export const TimelineSection = memo(function TimelineSection() {
  return (
    <section id="timeline" className="ds-section section section-glow safe-x">
      <SectionTitle title="શુભ પ્રસંગો" />
      <div className="relative max-w-md mx-auto flex flex-col gap-16">
        {SCHEDULE.map((day, i) => (
          <DayBlock key={day.date} day={day} index={i} />
        ))}
      </div>
    </section>
  );
});
