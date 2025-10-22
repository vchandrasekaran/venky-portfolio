"use client";
import { useEffect, useRef, useState } from "react";

export default function AssistantAvatar({ listening, speaking }: { listening?: boolean; speaking?: boolean }) {
  const leftLid = useRef<SVGRectElement>(null);
  const rightLid = useRef<SVGRectElement>(null);
  const [gaze, setGaze] = useState({ x: 0, y: 0 }); // -1..1 range
  const [mouth, setMouth] = useState(2); // height

  // Random blink
  useEffect(() => {
    let alive = true;
    const tick = () => {
      const lids = [leftLid.current, rightLid.current];
      lids.forEach((el) => el?.animate([{ height: 0 }, { height: 8 }, { height: 0 }], { duration: 150 }));
      if (alive) setTimeout(tick, 2500 + Math.random() * 2000);
    };
    const id = setTimeout(tick, 1500);
    return () => { alive = false; clearTimeout(id); };
  }, []);

  // Follow pointer with eyes/head tilt
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const vw = window.innerWidth, vh = window.innerHeight;
      const nx = (e.clientX / vw) * 2 - 1; // -1..1
      const ny = (e.clientY / vh) * 2 - 1;
      setGaze({ x: nx, y: ny });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Approx lip-sync with TTS: mild randomization while speaking
  useEffect(() => {
    if (!speaking) { setMouth(2); return; }
    const id = setInterval(() => setMouth(2 + Math.round(Math.random() * 6)), 110);
    return () => clearInterval(id);
  }, [speaking]);

  const irisOffsetX = Math.max(-2, Math.min(2, gaze.x * 2));
  const irisOffsetY = Math.max(-1.5, Math.min(1.5, gaze.y * 1.5));
  const headTilt = `rotate(${gaze.x * 3} ${60} ${60})`;

  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="aresGlow" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="rgba(255,59,0,0.9)" />
          <stop offset="65%" stopColor="rgba(255,59,0,0.25)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      <circle cx="60" cy="60" r="56" fill="url(#aresGlow)" />
      <g transform={headTilt}>
        <circle cx="60" cy="60" r="55" fill="none" stroke="rgba(255,59,0,0.6)" strokeWidth="1.5" />
        {/* head */}
        <path d="M30,70 C30,40 45,28 60,28 C75,28 90,40 90,70 C90,86 78,96 60,96 C42,96 30,86 30,70Z" fill="rgba(10,12,16,0.92)" stroke="rgba(255,59,0,0.5)" />
        {/* hair plate */}
        <path d="M36,48 C40,34 52,30 60,30 C68,30 80,34 84,48 C76,44 66,41.5 60,41.5 C54,41.5 44,44 36,48Z" fill="rgba(6,7,10,0.95)" />

        {/* eyesockets */}
        <rect x="42" y="54.5" width="12" height="5" rx="2.5" fill="rgba(18,20,26,1)" stroke="rgba(255,59,0,0.35)" />
        <rect x="66" y="54.5" width="12" height="5" rx="2.5" fill="rgba(18,20,26,1)" stroke="rgba(255,59,0,0.35)" />
        {/* irises following gaze */}
        <circle cx={48 + irisOffsetX} cy={57 + irisOffsetY} r="1.6" fill={listening ? 'rgba(255,138,0,0.95)' : 'rgba(255,200,180,0.95)'} />
        <circle cx={72 + irisOffsetX} cy={57 + irisOffsetY} r="1.6" fill={listening ? 'rgba(255,138,0,0.95)' : 'rgba(255,200,180,0.95)'} />
        {/* eyelids animated via JS */}
        <rect ref={leftLid} x="42" y="54" width="12" height="0" fill="rgba(255,59,0,0.85)" />
        <rect ref={rightLid} x="66" y="54" width="12" height="0" fill="rgba(255,59,0,0.85)" />

        {/* mouth */}
        <rect x="52" y="68" width="16" height={mouth} rx="2" fill={speaking ? 'rgba(255,59,0,0.95)' : 'rgba(255,200,180,0.95)'} />

        {/* shoulder streaks */}
        <path d="M30,74 C38,78 44,84 47,92" stroke="rgba(255,59,0,0.6)" strokeWidth="1.2" />
        <path d="M90,74 C82,78 76,84 73,92" stroke="rgba(255,59,0,0.6)" strokeWidth="1.2" />
      </g>
    </svg>
  );
}
