import { useRef, useCallback } from 'react';

export function useAmbientSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const start = useCallback(() => {
    try {
      if (!audioRef.current) {
        const audio = new Audio('https://files.catbox.moe/esmgdg.mp3');
        audio.loop = true;
        audio.volume = 0;
        audioRef.current = audio;
      }

      const audio = audioRef.current;
      
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Fade in smoothly
          let vol = 0;
          const fadeInterval = setInterval(() => {
            vol += 0.02;
            if (vol >= 0.4) {
              audio.volume = 0.4;
              clearInterval(fadeInterval);
            } else {
              audio.volume = vol;
            }
          }, 100);
        }).catch(e => {
          console.warn('Ambient audio start failed', e);
        });
      }
    } catch (e) {
      console.warn('Ambient audio setup failed', e);
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      let vol = audio.volume;
      const fadeInterval = setInterval(() => {
        vol -= 0.05;
        if (vol <= 0) {
          audio.volume = 0;
          audio.pause();
          audio.currentTime = 0;
          clearInterval(fadeInterval);
        } else {
          audio.volume = vol;
        }
      }, 100);
    }
  }, []);

  return { start, stop };
}
