"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function PointerAura(){
  const [mounted, setMounted] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  useEffect(()=>{ setMounted(true); },[]);
  useEffect(()=>{
    if (!mounted) return; const el = dotRef.current; if(!el) return;
    const move = (e: MouseEvent)=>{
      el.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
    };
    window.addEventListener('mousemove', move, { passive: true });
    return ()=> window.removeEventListener('mousemove', move as any);
  },[mounted]);
  if (!mounted) return null;
  return createPortal(
    <div ref={dotRef} className="pointer-events-none fixed z-[2147483646] h-5 w-5 rounded-full border border-cyan-300/40 shadow-[0_0_24px_rgba(34,211,238,0.35)] mix-blend-screen" aria-hidden/>,
    document.body
  );
}

