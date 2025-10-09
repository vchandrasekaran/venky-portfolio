"use client";
import { useCallback, useRef } from "react";

export default function useBlip() {
  const ctxRef = useRef<AudioContext | null>(null);
  const unlockedRef = useRef(false);

  const ensure = () => {
    if (!ctxRef.current) {
      try { ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)(); } catch {}
    }
    const ctx = ctxRef.current;
    if (ctx && ctx.state === 'suspended') {
      // Attempt to resume on first gesture
      ctx.resume().catch(() => {});
    }
    return ctx;
  };

  const blip = useCallback((freq: number = 880) => {
    const ctx = ensure();
    if (!ctx) return;
    try {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.value = freq;
      const now = ctx.currentTime;
      // Very short click with quick decay
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.15, now + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      o.connect(g).connect(ctx.destination);
      o.start(now);
      o.stop(now + 0.14);
    } catch {}
  }, []);

  return blip;
}

