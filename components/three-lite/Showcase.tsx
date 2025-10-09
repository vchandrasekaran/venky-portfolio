"use client";
import { useEffect, useRef } from "react";

export default function ThreeLiteShowcase() {
  return (
    <div className="card p-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="px-2 py-1 text-[10px] uppercase tracking-[0.25em] text-brand.subtle">3D Preview</div>
      </div>
      <div className="relative h-[320px] md:h-[380px]">
        {/* Docking anchor for the AI orb (desktop) */}
        <div id="ai-orb-dock" className="hidden lg:block absolute top-3 right-3 h-16 w-16 z-10" />
        <Orb />
      </div>
    </div>
  );
}

function Orb(){
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative h-56 w-56 md:h-64 md:w-64">
        <div className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle at 45% 40%, rgba(56,189,248,0.9), rgba(56,189,248,0.25) 35%, rgba(139,92,246,0.15) 55%, rgba(2,6,23,0.2) 70%, transparent 75%)",
            filter: "blur(0.2px)",
            boxShadow: "0 0 60px rgba(56,189,248,0.25), inset 0 0 40px rgba(139,92,246,0.25)",
          }}
        />
        <div className="absolute inset-0 rounded-full border border-cyan-300/30" />
        <div className="absolute inset-[-18%] rounded-full animate-spin-slow"
          style={{
            background: "conic-gradient(from 0deg, rgba(56,189,248,0.0), rgba(56,189,248,0.5), rgba(139,92,246,0.0) 40%, rgba(139,92,246,0.4), rgba(56,189,248,0.0) 80%)",
            WebkitMask: "radial-gradient(farthest-side, transparent 62%, #000 63%)",
            mask: "radial-gradient(farthest-side, transparent 62%, #000 63%)",
          }}
        />
        <ParticleField />
      </div>
    </div>
  );
}

// Removed Globe and Mesh; keeping Orb only for performance and focus

function ParticleField(){
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const c = ref.current; if(!c) return; const ctx = c.getContext('2d'); if(!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio||1);
    let w=c.clientWidth, h=c.clientHeight;
    const resize=()=>{ w=c.clientWidth; h=c.clientHeight; c.width=w*dpr; c.height=h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); };
    resize();
    const pts = Array.from({length:60}).map(()=>({x: Math.random()*w, y: Math.random()*h, a: Math.random()*Math.PI*2, s: 0.3+Math.random()*0.6}));
    let raf=0;
    const step=()=>{
      ctx.clearRect(0,0,w,h);
      for(const p of pts){
        p.a += 0.01*p.s; p.x += Math.cos(p.a)*0.3; p.y += Math.sin(p.a)*0.3;
        if (p.x<0) p.x=w; if (p.x>w) p.x=0; if (p.y<0) p.y=h; if (p.y>h) p.y=0;
        ctx.fillStyle = 'rgba(139,92,246,0.35)';
        ctx.fillRect(p.x,p.y,1.5,1.5);
      }
      raf=requestAnimationFrame(step);
    };
    raf=requestAnimationFrame(step);
    const onResize=()=>resize();
    window.addEventListener('resize', onResize);
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  },[]);
  return <canvas ref={ref} className="absolute inset-[14%] rounded-full" />
}
