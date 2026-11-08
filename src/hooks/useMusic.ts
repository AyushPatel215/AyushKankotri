'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Looping background music. play() must be called from inside a user gesture
 * (tap / pointerup) so iOS Safari and in-app browsers (WhatsApp, Instagram) allow it.
 * Pauses while the tab is hidden and resumes when the guest comes back.
 */
export function useMusic(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wantPlayRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const audio = new Audio(src);
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.65;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onError = () => {
      setAvailable(false);
      setPlaying(false);
    };
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    audioRef.current = audio;

    const onVisibility = () => {
      if (document.hidden) audio.pause();
      else if (wantPlayRef.current) audio.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.pause();
      audioRef.current = null;
    };
  }, [src]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    wantPlayRef.current = true;
    audio.play().catch(() => setPlaying(false));
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      wantPlayRef.current = true;
      audio.play().catch(() => setPlaying(false));
    } else {
      wantPlayRef.current = false;
      audio.pause();
    }
  }, []);

  return { playing, available, play, toggle };
}
