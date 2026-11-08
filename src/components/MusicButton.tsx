'use client';

import { memo } from 'react';
import { VolumeX } from 'lucide-react';

/** Floating music toggle — bottom-left, clear of WhatsApp browser controls */
export const MusicButton = memo(function MusicButton({
  playing,
  onToggle,
}: {
  playing: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={playing ? 'સંગીત બંધ કરો' : 'સંગીત ચાલુ કરો'}
      aria-pressed={playing}
      className="fixed z-30 flex h-12 w-12 items-center justify-center rounded-full
                 bg-night/90 border border-gold/60 text-gold-200
                 shadow-[0_6px_18px_-6px_rgba(0,0,0,0.9)]
                 transition-transform active:scale-90 print:hidden"
      style={{
        left: 'calc(var(--safe-left) + 14px)',
        bottom: 'calc(var(--safe-bottom) + 16px)',
      }}
    >
      {playing ? (
        <span className="eq flex items-center gap-[3px] h-4" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      ) : (
        <VolumeX className="w-5 h-5" />
      )}
    </button>
  );
});
