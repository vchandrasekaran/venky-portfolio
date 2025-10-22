"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Pos = { x: number; y: number } | null;

export default function PointerOverlay(){
  const [pos, setPos] = useState<Pos>(null);
  useEffect(() => {
    const handler = (e: any) => {
      try {
        const detail = e.detail || {};
        let el: HTMLElement | null = null;
        if (detail.hash) el = document.getElementById(detail.hash.replace('#',''));
        if (!el && detail.selector) el = document.querySelector(detail.selector);
        if (!el && detail.path) {
          const h = (detail.path as string).split('#')[1];
          if (h) el = document.getElementById(h);
        }
        if (el) {
          const r = el.getBoundingClientRect();
          setPos({ x: r.left + r.width/2, y: r.top + r.height/2 });
          setTimeout(() => setPos(null), 1800);
        }
      } catch {}
    };
    window.addEventListener('assistant-highlight', handler as any);
    return () => window.removeEventListener('assistant-highlight', handler as any);
  }, []);

  if (!pos) return null;
  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[2147483647]">
      <div className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[rgba(255,138,0,0.9)] shadow-[0_0_24px_rgba(255,59,0,0.6)] animate-pointer-pulse" style={{ left: pos.x, top: pos.y }} />
    </div>, document.body);
}

