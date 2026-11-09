'use client';

import { useCallback, useEffect, useState } from 'react';
import { preload } from 'react-dom';
import { BlessingsSection } from '@/components/BlessingsSection';
import { Celebration } from '@/components/Celebration';
import { FinalSection } from '@/components/FinalSection';
import { InvitationLetter } from '@/components/InvitationLetter';
import { InvitationSection } from '@/components/InvitationSection';
import { MusicButton } from '@/components/MusicButton';
import { PersonSection } from '@/components/PersonSection';
import { PetalEffect } from '@/components/PetalEffect';
import { TempleDoors } from '@/components/temple/TempleDoors';
import { TimelineSection } from '@/components/TimelineSection';
import { WelcomeSection } from '@/components/WelcomeSection';
import { LETTER, MUSIC_SRC, WEDDING_DATE } from '@/data/wedding';
import { useMusic } from '@/hooks/useMusic';

/**
 * closed  → temple doorway, waiting for "Tap to Enter"
 * opening → carved doors swing open, camera moves into the light
 * letter  → the sealed kankotri appears; tapping the seal starts the song and opens it,
 *           Radha Krishna show inside for a moment
 * open    → the kankotri dissolves straight into the website (golden Ganesha page) — free scrolling
 */
type Phase = 'closed' | 'opening' | 'letter' | 'open';

export default function Home() {
  const [phase, setPhase] = useState<Phase>('closed');
  const [doorsGone, setDoorsGone] = useState(false);
  const [letterGone, setLetterGone] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const music = useMusic(MUSIC_SRC);
  const { play } = music;
  // the kankotri's temple background downloads while the doors are showing
  preload(LETTER.background, { as: 'image' });
  preload(LETTER.insideImage, { as: 'image' });

  const handleOpen = useCallback(() => {
    window.scrollTo(0, 0);
    setPhase('opening');
  }, []);
  // Door-opening completion event → the sealed kankotri appears in the light
  const handleDoorsOpened = useCallback(() => setPhase('letter'), []);
  const handleDoorsDone = useCallback(() => setDoorsGone(true), []);

  // Tapping the wax seal is a user gesture, so mobile browsers allow the song to start here
  const handleLetterTap = useCallback(() => play(), [play]);

  // Kankotri opened → the website shows through as the ivory fades away, with a flower burst
  const handleLetterOpened = useCallback(() => {
    window.scrollTo(0, 0);
    setPhase('open');
    setCelebrating(true);
    setTimeout(() => setLetterGone(true), 1400);
    setTimeout(() => setCelebrating(false), 8500);
  }, []);

  // Lock scroll until the website is showing
  useEffect(() => {
    document.body.style.overflow = phase === 'open' ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [phase]);

  const started = phase === 'open';

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden">
      <PetalEffect active={started} />

      {!doorsGone && phase !== 'open' && (
        <div className="print:hidden">
          <TempleDoors onEnter={handleOpen} onOpened={handleDoorsOpened} onDone={handleDoorsDone} />
        </div>
      )}

      {!letterGone && (phase === 'letter' || phase === 'open') && (
        <div className="print:hidden">
          <InvitationLetter onOpenStart={handleLetterTap} onOpened={handleLetterOpened} fading={phase === 'open'} />
        </div>
      )}

      {celebrating && <Celebration />}

      <main className="relative z-[1]">
        <WelcomeSection target={WEDDING_DATE} started={started} />
        <PersonSection who="groom" />
        <PersonSection who="bride" />
        <InvitationSection />
        <TimelineSection />
        <BlessingsSection />
        <FinalSection />
      </main>

      {phase !== 'closed' && music.available && <MusicButton playing={music.playing} onToggle={music.toggle} />}
    </div>
  );
}
