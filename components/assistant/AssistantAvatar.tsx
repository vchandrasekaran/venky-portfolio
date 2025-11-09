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

  const irisOffsetX = Math.max(-2.5, Math.min(2.5, gaze.x * 2.5));
  const irisOffsetY = Math.max(-2, Math.min(2, gaze.y * 2));
  const headTilt = `rotate(${gaze.x * 4} ${60} ${62})`;

  return (
    <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
      <defs>
        <radialGradient id="aresGlow" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="rgba(255,109,174,0.9)" />
          <stop offset="65%" stopColor="rgba(255,109,174,0.25)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <linearGradient id="suitLine" x1="0%" x2="100%">
          <stop offset="0%" stopColor="rgba(61,229,196,0.95)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.95)" />
        </linearGradient>
      </defs>

      <circle cx="60" cy="60" r="56" fill="url(#aresGlow)" />
      <g transform={headTilt}>
        <circle cx="60" cy="60" r="55" fill="none" stroke="rgba(255,109,174,0.6)" strokeWidth="1.5" />
        {/* head */}
        <path d="M30,72 C30,40 45,26 60,26 C75,26 90,40 90,72 C90,88 78,99 60,99 C42,99 30,88 30,72Z" fill="rgba(10,12,16,0.95)" stroke="rgba(255,109,174,0.5)" />
        {/* hair bun silhouette */}
        <circle cx="78" cy="30" r="10" fill="rgba(7,8,12,0.95)" stroke="rgba(255,109,174,0.4)" />
        {/* hair plate */}
        <path d="M36,46 C40,32 52,28 60,28 C68,28 80,32 84,46 C76,42 66,39.5 60,39.5 C54,39.5 44,42 36,46Z" fill="rgba(6,7,10,0.96)" />
        {/* cheek highlights and jawline */}
        <path d="M44,64 C46,60 48,58 52,57" stroke="rgba(255,235,243,0.25)" />
        <path d="M76,64 C74,60 72,58 68,57" stroke="rgba(255,235,243,0.25)" />
        <path d="M46,74 C50,78 54,79 60,79 C66,79 70,78 74,74" stroke="rgba(255,235,243,0.18)" />

        {/* eyesockets */}
        <rect x="42" y="54.5" width="12" height="5" rx="2.5" fill="rgba(18,20,26,1)" stroke="rgba(255,109,174,0.35)" />
        <rect x="66" y="54.5" width="12" height="5" rx="2.5" fill="rgba(18,20,26,1)" stroke="rgba(255,109,174,0.35)" />
        {/* irises following gaze */}
        <circle cx={48 + irisOffsetX} cy={57 + irisOffsetY} r="1.6" fill={listening ? 'rgba(127,93,255,0.95)' : 'rgba(255,235,243,0.95)'} />
        <circle cx={72 + irisOffsetX} cy={57 + irisOffsetY} r="1.6" fill={listening ? 'rgba(127,93,255,0.95)' : 'rgba(255,235,243,0.95)'} />
        {/* eyelids animated via JS */}
        <rect ref={leftLid} x="42" y="54" width="12" height="0" fill="rgba(255,109,174,0.85)" />
        <rect ref={rightLid} x="66" y="54" width="12" height="0" fill="rgba(255,109,174,0.85)" />

        {/* mouth */}
        <rect x="52" y="68" width="16" height={mouth} rx="2" fill={speaking ? 'rgba(255,109,174,0.95)' : 'rgba(255,235,243,0.95)'} />
        {/* visor glare */}
        <ellipse cx="60" cy="52" rx="28" ry="10" fill="rgba(255,255,255,0.06)" />

        {/* upper suit + identity disc */}
        <circle cx="88" cy="66" r="10" fill="rgba(10,12,16,0.9)" stroke="rgba(61,229,196,0.75)" strokeWidth="1.5" />
        <circle cx="88" cy="66" r="6" fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="1" className="animate-spin-slow" />
        {/* glowing suit lines */}
        <path d="M32,70 C40,64 44,56 46,50" stroke="url(#suitLine)" strokeWidth="2" />
        <path d="M88,48 C84,54 80,60 76,66" stroke="url(#suitLine)" strokeWidth="2" />
        <path d="M36,82 C44,86 52,90 60,90" stroke="url(#suitLine)" strokeWidth="2" />
        <path d="M84,82 C76,86 68,90 60,90" stroke="url(#suitLine)" strokeWidth="2" />
      </g>
    </svg>
  );
}
