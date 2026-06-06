import { useRef, useCallback } from 'react';

export function useSoftwareLoadingSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const loadingIntervalRef = useRef<number | null>(null);

  const start = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      if (loadingIntervalRef.current !== null) return;

      loadingIntervalRef.current = window.setInterval(() => {
        if (ctx.state === 'suspended') return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        const freqs = [800, 1200, 2400, 3200, 4800, 6000];
        osc.frequency.value = freqs[Math.floor(Math.random() * freqs.length)];
        osc.type = Math.random() > 0.5 ? 'square' : 'sine';
        
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }, 40);
    } catch (e) {
      console.warn('Audio start failed', e);
    }
  }, []);

  const stop = useCallback(() => {
     if (loadingIntervalRef.current !== null) {
       clearInterval(loadingIntervalRef.current);
       loadingIntervalRef.current = null;
     }
  }, []);

  return { start, stop };
}
