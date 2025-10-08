"use client";
import { useEffect, useRef, useState } from "react";

type Mode = "orb" | "globe" | "mesh";

export default function ThreeLiteShowcase() {
  const [mode, setMode] = useState<Mode>("orb");

  useEffect(() => {
    const saved = (typeof window !== 'undefined' && (localStorage.getItem('three-mode') as Mode)) || 'orb';
    setMode(saved);
  }, []);

  const select = (m: Mode) => {
    setMode(m);
    try { localStorage.setItem('three-mode', m); } catch {}
  };

  return (
    <div className="card p-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="px-2 py-1 text-[10px] uppercase tracking-[0.25em] text-brand.subtle">3D Preview</div>
        <div className="flex gap-2 p-1 rounded-full bg-white/5 border border-white/10">
          {(["orb","globe","mesh"] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => select(m)}
              className={`px-3 py-1 rounded-full text-xs ${mode===m? 'bg-brand.accent text-slate-900' : 'text-slate-300 hover:text-white'}`}
            >{m}</button>
          ))}
        </div>
      </div>
      <div className="relative h-[320px] md:h-[380px]">
        {/* Docking anchor for the AI orb (desktop) */}
        <div id="ai-orb-dock" className="hidden lg:block absolute top-3 right-3 h-16 w-16 z-10" />
        {mode === 'orb' && <Orb />}
        {mode === 'globe' && <Globe />}
        {mode === 'mesh' && <Mesh />}
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

function Globe(){
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="relative h-64 w-64 md:h-72 md:w-72">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 to-violet-500/10 blur-2xl" />
        <svg className="absolute inset-0 animate-spin-slower" viewBox="0 0 100 100" aria-hidden>
          <defs>
            <radialGradient id="g" cx="40%" cy="35%" r="70%">
              <stop offset="0%" stopColor="rgba(56,189,248,0.7)"/>
              <stop offset="60%" stopColor="rgba(56,189,248,0.15)"/>
              <stop offset="100%" stopColor="transparent"/>
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="30" fill="url(#g)" />
          {/* Longitudes */}
          {Array.from({length:6}).map((_,i)=>{
            const x = i*15;
            return <ellipse key={i} cx="50" cy="50" rx="30" ry="12" transform={`rotate(${x} 50 50)`} fill="none" stroke="rgba(203,213,225,0.35)" strokeWidth="0.3"/>;
          })}
          {/* Latitudes */}
          {Array.from({length:5}).map((_,i)=>{
            const ry = 5 + i*5;
            return <ellipse key={'lat'+i} cx="50" cy="50" rx="30" ry={ry} fill="none" stroke="rgba(203,213,225,0.25)" strokeWidth="0.25"/>;
          })}
          {/* Nodes */}
          {[[65,40],[40,65],[55,70],[30,45]].map(([x,y],i)=> (
            <circle key={i} cx={x} cy={y} r="1.6" fill="rgba(56,189,248,0.9)" />
          ))}
        </svg>
      </div>
    </div>
  );
}

function Mesh(){
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const ctx = c.getContext('2d'); if (!ctx) return;
    let w = c.clientWidth, h = c.clientHeight;
    const resize = () => { w = c.clientWidth; h = c.clientHeight; c.width = w*dpr; c.height = h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); };
    resize();
    const N = 26;
    const nodes = Array.from({length:N}).map(()=>({ x: Math.random()*w, y: Math.random()*h, z: Math.random()*1, vx: (Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3 }));
    let raf = 0;
    const step = ()=>{
      ctx.clearRect(0,0,w,h);
      // links
      for (let i=0;i<N;i++) for (let j=i+1;j<N;j++){
        const a = nodes[i], b = nodes[j];
        const dx=a.x-b.x, dy=a.y-b.y; const dist = Math.hypot(dx,dy);
        if (dist < 120){
          const alpha = 0.12*(1-dist/120);
          ctx.strokeStyle = `rgba(34,211,238,${alpha.toFixed(3)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
      // nodes
      for (const n of nodes){
        n.x += n.vx; n.y += n.vy;
        if (n.x<0||n.x>w) n.vx*=-1; if (n.y<0||n.y>h) n.vy*=-1;
        const r = 2 + n.z*2;
        ctx.fillStyle = `rgba(56,189,248,${0.6 + n.z*0.4})`;
        ctx.beginPath(); ctx.arc(n.x,n.y,r,0,Math.PI*2); ctx.fill();
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const onResize = ()=> resize();
    window.addEventListener('resize', onResize);
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
  return (
    <canvas ref={ref} className="absolute inset-0"/>
  );
}

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
