'use client';

import { memo, useEffect, useId, useState } from 'react';
import { weddingDetails } from '@/data/wedding';
import { useReveal } from '@/hooks/useReveal';
import { Rise } from './RiseText';

/**
 * Groom / bride portrait card. The decoration (flowers, elephants, palace, border) is the
 * artwork in public/images/portrait-frame.jpg; the photo, cover and text are live on top.
 * All coordinates are in the artwork's own pixels (1024 × 1536).
 */
const FRAME = '/images/portrait-frame.jpg';

// Inner edge of the arched window, traced from the artwork
const ARCH = 'M126 1005 L126 345 L132 321 L136 313 L138 305 L142 299 L144 294 L148 289 L150 285 L154 281 L156 277 L160 273 L162 270 L166 268 L168 265 L172 263 L174 260 L178 258 L180 257 L184 255 L186 254 L190 252 L192 251 L196 237 L198 225 L202 217 L204 211 L208 206 L210 201 L214 198 L216 194 L220 191 L222 188 L226 185 L228 183 L232 181 L234 179 L238 177 L240 175 L244 174 L246 172 L250 171 L252 170 L256 169 L258 168 L262 168 L264 167 L268 167 L270 166 L274 166 L276 162 L280 153 L282 147 L286 142 L288 138 L292 134 L294 131 L298 128 L300 126 L304 123 L306 121 L310 120 L312 118 L316 116 L318 114 L322 113 L324 112 L328 111 L330 110 L334 109 L336 108 L340 108 L342 108 L346 107 L348 107 L352 106 L354 106 L358 107 L360 107 L364 107 L366 108 L370 107 L372 103 L376 99 L378 95 L382 92 L384 89 L388 87 L390 85 L394 82 L396 81 L400 79 L402 78 L406 76 L408 75 L412 74 L414 73 L418 73 L420 72 L424 71 L426 71 L430 70 L432 70 L436 70 L438 69 L442 69 L444 69 L448 68 L450 68 L454 67 L456 66 L460 66 L462 65 L466 64 L468 63 L472 62 L474 61 L478 60 L480 59 L484 58 L486 57 L490 55 L492 53 L496 52 L498 50 L502 48 L504 45 L508 43 L510 41 L516 43 L520 45 L522 48 L526 50 L528 52 L532 53 L534 55 L538 57 L540 58 L544 59 L546 60 L550 61 L552 62 L556 63 L558 64 L562 65 L564 66 L568 66 L570 67 L574 68 L576 68 L580 69 L582 69 L586 69 L588 70 L592 70 L594 70 L598 71 L600 71 L604 72 L606 73 L610 73 L612 74 L616 75 L618 76 L622 78 L624 79 L628 81 L630 82 L634 85 L636 87 L640 89 L642 92 L646 95 L648 99 L652 103 L654 107 L658 108 L660 107 L664 107 L666 107 L670 106 L672 106 L676 107 L678 107 L682 108 L684 108 L688 108 L690 109 L694 110 L696 111 L700 112 L702 113 L706 114 L708 116 L712 118 L714 120 L718 121 L720 123 L724 126 L726 128 L730 131 L732 134 L736 138 L738 142 L742 147 L744 153 L748 162 L750 166 L754 166 L756 167 L760 167 L762 168 L766 168 L768 169 L772 170 L774 171 L778 172 L780 174 L784 175 L786 177 L790 179 L792 181 L796 183 L798 185 L802 188 L804 191 L808 194 L810 198 L814 201 L816 206 L820 211 L822 217 L826 225 L828 237 L832 251 L834 252 L838 254 L840 255 L844 257 L846 258 L850 260 L852 263 L856 265 L858 268 L862 270 L864 273 L868 277 L870 281 L874 285 L876 289 L880 294 L882 299 L886 305 L888 313 L892 321 L898 345 L898 1005 Z';

// Photo window bounds inside the arch
const PHOTO = { x: 126, y: 41, w: 772, h: 964 };

const PERSON = {
  groom: { ...weddingDetails.groom, label: 'વરરાજા', relation: 'સુપુત્ર' },
  bride: { ...weddingDetails.bride, label: 'કન્યા', relation: 'સુપુત્રી' },
};

/** artwork pixel → cqw (the card is 1024 px wide) */
const at = (y: number) => ({ top: `${(y / 1024) * 100}cqw` });

/** Shown when a detail has not been provided yet — never invented */
function Detail({ value, placeholder }: { value: string; placeholder: string }) {
  return value ? <>{value}</> : <span className="ps-placeholder">{placeholder}</span>;
}

/** Gold rule with a small filigree centre */
function Divider({ x1, x2, y, fleur }: { x1: number; x2: number; y: number; fleur?: boolean }) {
  const c = 512;
  return (
    <g stroke="#b08a52" fill="none" strokeLinecap="round">
      <path d={`M${x1} ${y} H${c - 44} M${c + 44} ${y} H${x2}`} strokeWidth="2" />
      <circle cx={x1} cy={y} r="3" fill="#b08a52" stroke="none" />
      <circle cx={x2} cy={y} r="3" fill="#b08a52" stroke="none" />
      <path d={`M${c - 44} ${y} c8 -11 22 -11 25 -3 c2 6 -5 9 -9 5 M${c + 44} ${y} c-8 -11 -22 -11 -25 -3 c-2 6 5 9 9 5`} strokeWidth="2" />
      <path d={`M${c} ${y - 10} L${c + 9} ${y} L${c} ${y + 10} L${c - 9} ${y} Z`} fill="#b08a52" stroke="none" />
      {fleur && (
        <path
          d={`M${c} ${y - 12} C${c - 6} ${y - 20} ${c - 6} ${y - 28} ${c} ${y - 34} C${c + 6} ${y - 28} ${c + 6} ${y - 20} ${c} ${y - 12} Z M${c} ${y + 12} c-8 6 -16 6 -20 2 M${c} ${y + 12} c8 6 16 6 20 2`}
          fill="#b08a52"
          strokeWidth="2"
        />
      )}
    </g>
  );
}

function CardArt({ src, alt, align }: { src: string; alt: string; align: string }) {
  const id = `pc${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setLoaded(true);
    img.onerror = () => setLoaded(false);
    img.src = src;
  }, [src]);

  return (
    <svg viewBox="0 0 1024 1536" className="pc-art" role="img" aria-label={alt}>
      <defs>
        <clipPath id={`${id}a`}>
          <path d={ARCH} />
        </clipPath>
        {/* the window keeps a soft cream base so nothing of the artwork's own photo shows */}
        <linearGradient id={`${id}u`} gradientUnits="userSpaceOnUse" x1="0" y1="40" x2="0" y2="1005">
          <stop offset="0" stopColor="#efdcbb" />
          <stop offset="1" stopColor="#faead1" />
        </linearGradient>
        <linearGradient id={`${id}uf`} gradientUnits="userSpaceOnUse" x1="0" y1="940" x2="0" y2="1006">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}um`} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536">
          <rect width="1024" height="1536" fill={`url(#${id}uf)`} />
        </mask>
        {/* photo melts into the paper, like the artwork */}
        <linearGradient id={`${id}pf`} gradientUnits="userSpaceOnUse" x1="0" y1="840" x2="0" y2="995">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={`${id}pm`} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536">
          <rect width="1024" height="1536" fill={`url(#${id}pf)`} />
        </mask>
        {/* paper patch over the artwork's original lettering */}
        <radialGradient id={`${id}p`} gradientUnits="userSpaceOnUse" cx="512" cy="1180" r="430">
          <stop offset="0" stopColor="#fdefda" />
          <stop offset="1" stopColor="#fcebd2" />
        </radialGradient>
        <filter id={`${id}b`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <mask id={`${id}cm`} maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1536">
          <g fill="#fff" filter={`url(#${id}b)`}>
            <rect x="150" y="962" width="724" height="282" rx="40" />
            <rect x="236" y="1230" width="552" height="122" rx="30" />
            <rect x="300" y="1340" width="424" height="62" rx="24" />
          </g>
        </mask>
      </defs>

      <rect width="1024" height="1536" fill={`url(#${id}p)`} mask={`url(#${id}cm)`} />

      <path d={ARCH} fill={`url(#${id}u)`} mask={`url(#${id}um)`} />
      <g className="pc-photo" mask={`url(#${id}pm)`}>
        <g clipPath={`url(#${id}a)`}>
          {loaded ? (
            <image href={src} x={PHOTO.x} y={PHOTO.y} width={PHOTO.w} height={PHOTO.h} preserveAspectRatio={`${align} slice`} />
          ) : (
            <text x="512" y="560" textAnchor="middle" fontSize="34" fontStyle="italic" fill="#a8834c" style={{ fontFamily: 'var(--font-cormorant), serif', letterSpacing: '0.08em' }}>
              Photograph coming soon
            </text>
          )}
        </g>
      </g>

      <g className="pc-rules">
        <path d="M165 1017 H352 M672 1017 H859" stroke="#b08a52" strokeWidth="2" strokeLinecap="round" />
        <circle cx="352" cy="1017" r="3" fill="#b08a52" />
        <circle cx="672" cy="1017" r="3" fill="#b08a52" />
        <Divider x1={235} x2={789} y={1168} />
        <Divider x1={360} x2={664} y={1378} fleur />
      </g>
    </svg>
  );
}

/** Groom / bride portrait card — a matching pair */
export const PersonSection = memo(function PersonSection({ who }: { who: 'groom' | 'bride' }) {
  const p = PERSON[who];
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id={who} className="pc-section">
      <div ref={ref} className={`pc-card ${visible ? 'is-visible' : ''}`} style={{ backgroundImage: `url("${FRAME}")` }}>
        <CardArt src={p.photo} alt={p.name} align={p.photoAlign} />

        <div className="pc-line" style={at(1017)}>
          <Rise when={visible} delay={200}>
            <p className="pc-label">{p.label}</p>
          </Rise>
        </div>
        <div className="pc-line" style={at(1100)}>
          <Rise when={visible} delay={350}>
            <h2 className="pc-name">{p.nameGu}</h2>
          </Rise>
        </div>
        <div className="pc-line" style={at(1216)}>
          <Rise when={visible} delay={500}>
            <p className="pc-relation">{p.relation}</p>
          </Rise>
        </div>
        <div className="pc-line" style={at(1258)}>
          <Rise when={visible} delay={600}>
            <p className="pc-parent">
              <Detail value={p.fatherGu} placeholder="પિતાશ્રીનું નામ" />
            </p>
          </Rise>
        </div>
        <div className="pc-line" style={at(1294)}>
          <Rise when={visible} delay={650}>
            <p className="pc-amp">અને</p>
          </Rise>
        </div>
        <div className="pc-line" style={at(1331)}>
          <Rise when={visible} delay={700}>
            <p className="pc-parent">
              <Detail value={p.motherGu} placeholder="માતુશ્રીનું નામ" />
            </p>
          </Rise>
        </div>
      </div>
    </section>
  );
});
