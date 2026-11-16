'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface MusicTracks {
  /** short clip played when the guest enters */
  intro: string;
  /** how much of the intro to play, in seconds */
  introSeconds: number;
  /** song that loops once the invitation is open */
  main: string;
}

const INTRO_VOLUME = 0.7;
const MAIN_VOLUME = 0.65;
const FADE_MS = 700;

/**
 * Two-part music: a short intro on the guest's taps, then the main song on a loop.
 *
 * Phones only allow sound that starts inside a tap, so `playIntro()` must be called from
 * one: it plays the intro and also starts the main song *muted*. `playMain()` can then
 * bring the main song in later without a tap — it only restarts and unmutes it.
 * Everything pauses while the tab is hidden and resumes when the guest comes back.
 */
export function useMusic(tracks: MusicTracks) {
  const introRef = useRef<HTMLAudioElement | null>(null);
  const mainRef = useRef<HTMLAudioElement | null>(null);
  const wantMainRef = useRef(false);
  const mainHeardRef = useRef(false); // once the main song is on, the intro never plays again
  const introTimersRef = useRef<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    const intro = new Audio(tracks.intro);
    intro.preload = 'auto';
    intro.volume = INTRO_VOLUME;
    const main = new Audio(tracks.main);
    main.preload = 'auto';
    main.loop = true;
    main.volume = MAIN_VOLUME;
    introRef.current = intro;
    mainRef.current = main;

    // "playing" means the guest can hear the main song
    const sync = () => setPlaying(!main.paused && !main.muted);
    const onError = () => {
      setAvailable(false);
      setPlaying(false);
    };
    main.addEventListener('play', sync);
    main.addEventListener('pause', sync);
    main.addEventListener('volumechange', sync);
    main.addEventListener('error', onError);

    const onVisibility = () => {
      if (document.hidden) {
        intro.pause();
        main.pause();
      } else if (wantMainRef.current) {
        main.play().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const timers = introTimersRef;
    return () => {
      timers.current.forEach(clearTimeout);
      document.removeEventListener('visibilitychange', onVisibility);
      main.removeEventListener('play', sync);
      main.removeEventListener('pause', sync);
      main.removeEventListener('volumechange', sync);
      main.removeEventListener('error', onError);
      intro.pause();
      main.pause();
      introRef.current = null;
      mainRef.current = null;
    };
  }, [tracks.intro, tracks.main]);

  /** Silently get the main song going inside a tap, so it can be unmuted later */
  const prime = useCallback(() => {
    const main = mainRef.current;
    if (!main || !main.paused) return;
    main.muted = true;
    main.play().catch(() => {});
  }, []);

  /** Stop the intro: it is unloaded, so phone media controls can't bring it back on their own */
  const stopIntro = useCallback(() => {
    const intro = introRef.current;
    if (!intro) return;
    intro.pause();
    if (intro.getAttribute('src')) {
      intro.removeAttribute('src');
      intro.load();
    }
  }, []);

  /**
   * Play the first `introSeconds` of the intro, then fade and stop. Call from a tap —
   * it runs on "પ્રવેશ કરો" and again on the kankotri card. Each call starts it afresh.
   */
  const playIntro = useCallback(() => {
    const intro = introRef.current;
    if (!intro || mainHeardRef.current) return;
    introTimersRef.current.forEach(clearTimeout);
    introTimersRef.current = [];
    if (!intro.getAttribute('src')) intro.src = tracks.intro;
    intro.currentTime = 0;
    intro.volume = INTRO_VOLUME;
    intro.play().catch(() => {});
    prime();

    const at = (ms: number, fn: () => void) => introTimersRef.current.push(window.setTimeout(fn, ms));
    const end = tracks.introSeconds * 1000;
    // gentle fade (where the browser allows volume changes), then stop
    for (let i = 1; i <= 7; i++) {
      at(end - FADE_MS + (FADE_MS / 7) * i, () => {
        if (intro.getAttribute('src')) intro.volume = Math.max(0, INTRO_VOLUME * (1 - i / 7));
      });
    }
    at(end, stopIntro);
  }, [prime, stopIntro, tracks.intro, tracks.introSeconds]);

  /** Bring in the main song from the beginning; it then repeats */
  const playMain = useCallback(() => {
    const main = mainRef.current;
    if (!main) return;
    introTimersRef.current.forEach(clearTimeout);
    stopIntro();
    mainHeardRef.current = true;
    wantMainRef.current = true;
    main.currentTime = 0;
    main.muted = false;
    if (main.paused) main.play().catch(() => setPlaying(false));

    // lock-screen / notification / earphone controls now drive the main song
    if ('mediaSession' in navigator) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({ title: 'રામ રામ જય રાજા રામ', artist: 'Ayush ♥ Priya' });
        navigator.mediaSession.setActionHandler('play', () => {
          wantMainRef.current = true;
          main.play().catch(() => {});
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          wantMainRef.current = false;
          main.pause();
        });
      } catch {
        // older browsers: media session is optional
      }
    }
  }, [stopIntro]);

  /** Music button: pause / resume the main song */
  const toggle = useCallback(() => {
    const main = mainRef.current;
    if (!main) return;
    if (!main.paused && !main.muted) {
      wantMainRef.current = false;
      main.pause();
    } else {
      wantMainRef.current = true;
      main.muted = false;
      main.play().catch(() => setPlaying(false));
    }
  }, []);

  return { playing, available, playIntro, prime, playMain, toggle };
}
