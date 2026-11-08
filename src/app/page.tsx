'use client';

import { useCallback, useEffect, useState } from 'react';
import { BlessingsSection } from '@/components/BlessingsSection';
import { Celebration } from '@/components/Celebration';
import { CoupleSection } from '@/components/CoupleSection';
import { FinalSection } from '@/components/FinalSection';
import { HeroSection } from '@/components/HeroSection';
import { InvitationLetter } from '@/components/InvitationLetter';
import { InvitationSection } from '@/components/InvitationSection';
import { MusicButton } from '@/components/MusicButton';
import { PetalEffect } from '@/components/PetalEffect';
import { ScratchScreen } from '@/components/ScratchScreen';
import { TempleDoors } from '@/components/temple/TempleDoors';
import { TimelineSection } from '@/components/TimelineSection';
import { MUSIC_SRC, WEDDING_DATE } from '@/data/wedding';
import { useMusic } from '@/hooks/useMusic';

/**
 * letter   → sealed invitation letter; dissolves into ivory
 * closed   → temple doorway, waiting for "Tap to Enter"
 * opening  → carved doors swing open, camera moves into the light (scratch card waits underneath)
 * scratch  → scratch the gold foil; on reveal the song starts and flowers burst
 * entering → ~2s later the scratch screen fades out by itself, hero words rise
 * open     → free scrolling
 */
type Phase = 'letter' | 'closed' | 'opening' | 'scratch' | 'entering' | 'open';

export default function Home() {
  const [phase, setPhase] = useState<Phase>('letter');
  const [doorsGone, setDoorsGone] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const music = useMusic(MUSIC_SRC);
  const { play } = music;

  // Fires once the letter has dissolved into ivory — the temple doorway emerges from it
  const handleLetterOpened = useCallback(() => setPhase('closed'), []);

  const handleOpen = useCallback(() => {
    window.scrollTo(0, 0);
    setPhase('opening');
  }, []);
  const handleDoorsOpened = useCallback(() => setPhase('scratch'), []);
  const handleDoorsDone = useCallback(() => setDoorsGone(true), []);

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

      {phase === 'letter' && (
        <div className="print:hidden">
          <InvitationLetter onOpened={handleLetterOpened} />
        </div>
      )}

      {!doorsGone && (phase === 'closed' || phase === 'opening' || phase === 'scratch') && (
        <div className="print:hidden">
          <TempleDoors onEnter={handleOpen} onOpened={handleDoorsOpened} onDone={handleDoorsDone} />
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

      {phase !== 'letter' && phase !== 'closed' && music.available && <MusicButton playing={music.playing} onToggle={music.toggle} />}
    </div>
  );
}
