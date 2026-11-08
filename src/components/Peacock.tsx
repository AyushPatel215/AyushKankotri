import { memo, useId } from 'react';

const GOLD = '#a8833f';
const GOLD_LIGHT = '#c9a45c';
const SAGE = '#8a9f86';
const SAGE_DEEP = '#4f6b5c';

// Fan feathers radiate from this point behind the body
const BASE_X = 100;
const BASE_Y = 108;

const OUTER = [-78, -62, -46, -31, -15.5, 0, 15.5, 31, 46, 62, 78];
const INNER = [-70, -54, -38, -23, -7.75, 7.75, 23, 38, 54, 70];

function Feather({ angle, length, eye }: { angle: number; length: number; eye: number }) {
  const tip = BASE_Y - length;
  return (
    <g transform={`rotate(${angle} ${BASE_X} ${BASE_Y})`}>
      <line x1={BASE_X} y1={BASE_Y} x2={BASE_X} y2={tip + eye * 1.2} stroke={GOLD} strokeWidth="0.45" />
      {/* soft vane around the upper shaft */}
      <path
        d={`M${BASE_X} ${BASE_Y - length * 0.42} Q ${BASE_X - eye * 1.25} ${BASE_Y - length * 0.8} ${BASE_X} ${tip - 1}
            Q ${BASE_X + eye * 1.25} ${BASE_Y - length * 0.8} ${BASE_X} ${BASE_Y - length * 0.42}Z`}
        fill={SAGE}
        fillOpacity="0.12"
        stroke={GOLD_LIGHT}
        strokeWidth="0.35"
      />
      {/* the "eye" */}
      <ellipse cx={BASE_X} cy={tip + eye} rx={eye * 0.66} ry={eye} fill={SAGE} fillOpacity="0.28" stroke={GOLD} strokeWidth="0.6" />
      <ellipse cx={BASE_X} cy={tip + eye * 1.12} rx={eye * 0.36} ry={eye * 0.54} fill={SAGE_DEEP} fillOpacity="0.75" />
      <circle cx={BASE_X} cy={tip + eye * 1.2} r={eye * 0.16} fill={GOLD_LIGHT} />
    </g>
  );
}

/** Original fine-line Indian peacock in antique gold and muted sage */
export const Peacock = memo(function Peacock({ className = '' }: { className?: string }) {
  const id = `pc${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  return (
    <svg viewBox="0 0 200 136" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6f8f86" />
          <stop offset="1" stopColor={SAGE_DEEP} />
        </linearGradient>
      </defs>

      <g className="pk-fan">
        {OUTER.map((a) => (
          <Feather key={`o${a}`} angle={a} length={76} eye={5.6} />
        ))}
        <g opacity="0.8">
          {INNER.map((a) => (
            <Feather key={`i${a}`} angle={a} length={52} eye={4} />
          ))}
        </g>
      </g>

      {/* body — ivory underlay hides the feather lines behind it */}
      <path
        d="M100 122 C 87 114, 86 94, 95 81 C 98 75, 97 67, 93.5 61 C 91.5 57, 93 51.5, 97.5 51 C 102 50.8, 103.5 55.5, 101 60
           C 99.5 64, 100.5 71, 104 78 C 113 92, 113 114, 100 122Z"
        fill="#fbf8f1"
      />
      <path
        d="M100 122 C 87 114, 86 94, 95 81 C 98 75, 97 67, 93.5 61 C 91.5 57, 93 51.5, 97.5 51 C 102 50.8, 103.5 55.5, 101 60
           C 99.5 64, 100.5 71, 104 78 C 113 92, 113 114, 100 122Z"
        fill={`url(#${id}b)`}
        fillOpacity="0.55"
        stroke={GOLD}
        strokeWidth="0.7"
      />
      {/* wing scallops */}
      <g fill="none" stroke={GOLD_LIGHT} strokeWidth="0.45" opacity="0.9">
        <path d="M95 94 q4 3 8 0 M94 101 q5 3.5 10 0 M95 108 q4.5 3 9 0 M97 114 q3 2 6 0" />
        <path d="M102 86 C 107 95, 107 106, 101 116" />
      </g>
      {/* head: beak, eye, crest */}
      <path d="M93.4 54 L 87.5 55.6 L 93.6 56.6Z" fill={GOLD} />
      <circle cx="96.6" cy="54.2" r="0.9" fill="#3a2318" />
      <path d="M95.6 56.6 q2 0.8 4 -0.2" stroke="#f4ead6" strokeWidth="0.6" fill="none" />
      <g stroke={GOLD} strokeWidth="0.45">
        <line x1="97.5" y1="51" x2="93" y2="41" />
        <line x1="98" y1="51" x2="97.6" y2="39.5" />
        <line x1="98.6" y1="51" x2="102.4" y2="41" />
      </g>
      <g fill={GOLD}>
        <circle cx="93" cy="40.6" r="1.1" />
        <circle cx="97.6" cy="39" r="1.2" />
        <circle cx="102.4" cy="40.6" r="1.1" />
      </g>
      {/* feet + ground flourish */}
      <path d="M97 121 l-1.5 5 M103 121 l1.5 5" stroke={GOLD} strokeWidth="0.6" />
      <path
        d="M62 128 C 80 132, 120 132, 138 128 M90 131 q10 3 20 0"
        fill="none"
        stroke={GOLD_LIGHT}
        strokeWidth="0.5"
      />
      <circle cx="58" cy="127.6" r="1.1" fill={GOLD_LIGHT} />
      <circle cx="142" cy="127.6" r="1.1" fill={GOLD_LIGHT} />
    </svg>
  );
});
