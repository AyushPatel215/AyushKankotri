'use client';

import { useCallback, useEffect, useState } from 'react';
import { BlessingsSection } from '@/components/BlessingsSection';
import { Celebration } from '@/components/Celebration';
import { CoupleSection } from '@/components/CoupleSection';
import { FinalSection } from '@/components/FinalSection';
import { HeroSection } from '@/components/HeroSection';
import { InvitationSection } from '@/components/InvitationSection';
import { MusicButton } from '@/components/MusicButton';
import { OpeningScreen } from '@/components/OpeningScreen';
import { PetalEffect } from '@/components/PetalEffect';
import { ScratchScreen } from '@/components/ScratchScreen';
import { TimelineSection } from '@/components/TimelineSection';
import { MUSIC_SRC, WEDDING_DATE } from '@/data/wedding';
import { useMusic } from '@/hooks/useMusic';

/**
 * closed   → doors shut, waiting for "કંકોત્રી ખોલો"
 * opening  → doors swinging open over the scratch card
 * scratch  → scratch the gold foil; on reveal the song starts and flowers burst
 * entering → ~2s later the scratch screen fades out by itself, hero words rise
 * open     → free scrolling
 */
type Phase = 'closed' | 'opening' | 'scratch' | 'entering' | 'open';

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Home() {
  const [phase, setPhase] = useState<Phase>('closed');
  const [celebrating, setCelebrating] = useState(false);
  const music = useMusic(MUSIC_SRC);
  const { play } = music;

  const handleOpen = useCallback(() => {
    window.scrollTo(0, 0);
    setPhase('opening');
    setTimeout(() => setPhase('scratch'), prefersReduced() ? 350 : 2300);
  }, []);

  // After the foil is scratched: song + burst, then move on automatically
  const handleReveal = useCallback(() => {
    play(); // still inside the scratch / tap gesture, so mobile browsers allow audio
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 8500);
    setTimeout(() => {
      setPhase('entering');
      setTimeout(() => setPhase('open'), 1200);
    }, 2000);
  }, [play]);

  // Lock scroll until the invitation is fully open
  useEffect(() => {
    document.body.style.overflow = phase === 'open' ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  const showScratch = phase === 'opening' || phase === 'scratch' || phase === 'entering';
  const heroStarted = phase === 'entering' || phase === 'open';

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      <PetalEffect active={heroStarted} />

      {(phase === 'closed' || phase === 'opening') && (
        <div className="print:hidden">
          <OpeningScreen opening={phase === 'opening'} onOpen={handleOpen} />
        </div>
      )}

      {showScratch && (
        <div className="print:hidden">
          <ScratchScreen active={phase === 'scratch'} leaving={phase === 'entering'} onReveal={handleReveal} />
        </div>
      )}

      {celebrating && <Celebration />}

      <main className="relative z-[1]">
        <HeroSection target={WEDDING_DATE} started={heroStarted} />
        <CoupleSection />
        <InvitationSection />
        <TimelineSection />
        <BlessingsSection />
        <FinalSection />
      </main>

      {phase !== 'closed' && music.available && <MusicButton playing={music.playing} onToggle={music.toggle} />}
    </div>
  );
}
