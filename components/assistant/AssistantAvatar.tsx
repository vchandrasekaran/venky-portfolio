"use client";
import { useEffect, useRef } from "react";

export default function AssistantAvatar({ listening, speaking }: { listening?: boolean; speaking?: boolean }) {
  const blinkRef = useRef<number | null>(null);
  const leftLid = useRef<SVGRectElement>(null);
  const rightLid = useRef<SVGRectElement>(null);

  useEffect(() => {
    let t = 0;
    const loop = () => {
      t += 1;
      // blink every ~3s with randomness
      const mod = (t % 180) === 0 || (t % (180 + Math.floor(Math.random()*60))) === 0;
      if (mod) {
        [leftLid.current, rightLid.current].forEach((el) => {
          if (!el) return;
          el.animate([{ height: 0 }, { height: 8 }, { height: 0 }], { duration: 160, easing: "ease-in-out" });
        });
      }
      blinkRef.current = requestAnimationFrame(loop);
    };
    blinkRef.current = requestAnimationFrame(loop);
    return () => { if (blinkRef.current) cancelAnimationFrame(blinkRef.current); };
  }, []);

  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      {/* glow */}
      <defs>
        <radialGradient id="aresGlow" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="rgba(255,59,0,0.9)" />
          <stop offset="65%" stopColor="rgba(255,59,0,0.25)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="60" r="56" fill="url(#aresGlow)" />
      <circle cx="60" cy="60" r="55" fill="none" stroke="rgba(255,59,0,0.6)" strokeWidth="1.5" />

      {/* head shape */}
      <path d="M30,70 C30,40 45,28 60,28 C75,28 90,40 90,70 C90,86 78,96 60,96 C42,96 30,86 30,70Z" fill="rgba(10,12,16,0.9)" stroke="rgba(255,59,0,0.5)" />
      {/* hair silhouette */}
      <path d="M36,48 C40,34 52,30 60,30 C68,30 80,34 84,48 C75,44 66,42 60,42 C54,42 45,44 36,48Z" fill="rgba(5,6,10,0.9)" />

      {/* eyes */}
      <rect x="43" y="56" width="10" height="2" rx="1" fill={listening ? 'rgba(255,138,0,0.9)' : 'rgba(255,200,180,0.9)'} />
      <rect x="67" y="56" width="10" height="2" rx="1" fill={listening ? 'rgba(255,138,0,0.9)' : 'rgba(255,200,180,0.9)'} />
      {/* eyelids (animated) */}
      <rect ref={leftLid} x="43" y="54" width="10" height="0" fill="rgba(255,59,0,0.8)" />
      <rect ref={rightLid} x="67" y="54" width="10" height="0" fill="rgba(255,59,0,0.8)" />

      {/* mouth / lip-sync bar */}
      <rect x="52" y="68" width="16" height={speaking ? 6 : 2} rx="2" fill={speaking ? 'rgba(255,59,0,0.9)' : 'rgba(255,200,180,0.9)'}>
        {speaking ? <animate attributeName="height" values="4;7;3;6;2;6;4" dur="0.8s" repeatCount="indefinite" /> : null}
      </rect>

      {/* shoulder lines */}
      <path d="M30,74 C38,78 44,84 47,92" stroke="rgba(255,59,0,0.6)" strokeWidth="1.2" />
      <path d="M90,74 C82,78 76,84 73,92" stroke="rgba(255,59,0,0.6)" strokeWidth="1.2" />
    </svg>
  );
}

