"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

type QAResponse = { answer: string; sources: { source: string }[] };

const SUGGESTIONS = ["Snowflake", "dbt", "Power BI", "Domo", "AI Job Market"];

export default function AIOrbAssistant() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<QAResponse | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [navHint, setNavHint] = useState<{ path: string; hash?: string; label: string } | null>(null);
  const [navList, setNavList] = useState<{ path: string; hash?: string; label: string }[] | null>(null);
  const router = useRouter();

  // Voice
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [dock, setDock] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setMounted(true);
    const findDock = () => {
      const el = document.getElementById('ai-orb-dock');
      setDock(el as HTMLElement | null);
    };
    findDock();
    const obs = new MutationObserver(findDock);
    obs.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', findDock);
    return () => { obs.disconnect(); window.removeEventListener('resize', findDock); };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const to = setTimeout(() => inputRef.current?.focus(), 50);
    return () => { clearTimeout(to); document.body.style.overflow = prevOverflow; };
  }, [open]);

  const ask = async (text?: string) => {
    const question = (text ?? q).trim();
    if (!question) return;
    setLoading(true);
    setResp(null);
    try {
      // Try streaming assistant first
      const r = await fetch('/api/assistant/stream', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }) })
      if (r.ok && r.body) {
        const reader = r.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let answer = '';
        let sources: { source: string }[] = [];
        let metaParsed = false; let buffer = '';
        setResp({ answer: '', sources: []});
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          // handle META line
          if (!metaParsed && buffer.startsWith('META ')) {
            const nl = buffer.indexOf('\n');
            if (nl !== -1) {
              try { const j = JSON.parse(buffer.slice(5, nl)); sources = j.sources || []; if (j.nav) setNavHint(j.nav); if (j.navList) setNavList(j.navList); } catch {}
              metaParsed = true; buffer = buffer.slice(nl+1);
              setResp({ answer: '', sources });
            } else {
              continue;
            }
          }
          if (metaParsed && buffer) {
            answer += buffer; buffer='';
            setResp({ answer, sources });
          }
        }
        if (voiceEnabled && answer && typeof window !== 'undefined' && 'speechSynthesis' in window) {
          try { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(answer.replace(/[#*`>-]/g,' ')); u.rate=1.02; u.pitch=1.02; window.speechSynthesis.speak(u);} catch {}
        }
      } else {
        // Fallback to simple keyword API
        const r2 = await fetch("/api/ask-venkatesh", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }) })
        const data = (await r2.json()) as QAResponse
        setResp(data)
        if (voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
          try { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(data.answer.replace(/[#*`>-]/g,' ')); u.rate=1.02; u.pitch=1.02; window.speechSynthesis.speak(u);} catch {}
        }
      }
    } catch (e) {
      setToast("Network error");
      setTimeout(() => setToast(null), 1200);
    } finally {
      setLoading(false);
    }
  };

  const toggleListen = () => {
    if (isListening) {
      try { recognitionRef.current?.stop?.(); } catch {}
      setIsListening(false);
      return;
    }
    const W: any = window as any;
    const Rec = W.SpeechRecognition || W.webkitSpeechRecognition;
    if (!Rec) {
      setToast("Voice not supported in this browser");
      setTimeout(() => setToast(null), 1400);
      return;
    }
    const rec = new Rec();
    recognitionRef.current = rec;
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.continuous = false;
    rec.onresult = (ev: any) => {
      const t = Array.from(ev.results).map((r: any) => r[0]?.transcript || '').join(' ');
      setQ(t);
    };
    rec.onerror = () => { setIsListening(false); };
    rec.onend = () => {
      setIsListening(false);
      const finalText = (q || '').trim();
      if (finalText) ask(finalText);
    };
    try { rec.start(); setIsListening(true); } catch {}
  };

  const orbButton = (
    <button
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      aria-label="Open AI assistant"
      className={`ai-orb ${dock ? '' : 'fixed sm:bottom-6 sm:right-6 bottom-4 right-4'} z-[2147483646] h-16 w-16 rounded-full outline-none ${isListening ? 'listening' : ''}`}
      title={isListening ? 'Listening…' : 'AI Assistant'}
    >
      <HoloOrb listening={isListening} />
    </button>
  );

  const panel = open ? (
    <>
      <div className="fixed inset-0 z-[2147483645] bg-black/40 backdrop-blur-sm" aria-hidden onClick={() => setOpen(false)} />
      <div className="fixed sm:bottom-20 sm:right-6 bottom-20 right-4 z-[2147483647] w-[380px] max-w-[92vw] rounded-2xl border border-slate-700 bg-slate-950/90 p-4 shadow-2xl backdrop-blur">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="text-sm text-slate-300">Ask about my experience, projects, or tools.</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setVoiceEnabled(v => !v)} className="text-xs rounded border border-slate-700 px-2 py-1 text-slate-300 hover:text-white" title="Toggle voice">
                  {voiceEnabled ? 'Voice On' : 'Voice Off'}
                </button>
                <button onClick={() => setOpen(false)} className="text-xs rounded border border-slate-700 px-2 py-1 text-slate-300 hover:text-white">Close</button>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && ask()}
                placeholder={isListening ? 'Listening… speak your question' : 'Type a question'}
                className="flex-1 rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              />
              <button onClick={() => ask()} disabled={loading} className="rounded-lg bg-cyan-400 text-slate-900 px-3 py-2 text-sm min-h-[36px] hover:brightness-95 disabled:opacity-60">
                {loading ? '…' : 'Ask'}
              </button>
              <button onClick={toggleListen} className={`rounded-lg px-3 py-2 text-sm border ${isListening ? 'border-emerald-400 text-emerald-300' : 'border-slate-700 text-slate-300'}`} title="Speak your question">
                {isListening ? 'Stop' : 'Mic'}
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => { setQ(s); setTimeout(() => ask(s), 0); }} className="text-xs rounded-full px-2.5 py-1 border border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800/80">
                  {s}
                </button>
              ))}
            </div>
            <div className="mt-3 text-sm whitespace-pre-wrap max-h-[50vh] overflow-auto pr-1" aria-live="polite">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-3 rounded bg-slate-800/80 animate-pulse" />
                  <div className="h-3 rounded bg-slate-800/80 animate-pulse w-11/12" />
                  <div className="h-3 rounded bg-slate-800/80 animate-pulse w-10/12" />
                </div>
              ) : resp ? (
                <>
                  <div className="text-slate-200">{resp.answer}</div>
                  {navHint || navList?.length ? (
                    <div className="mt-3 rounded-lg border border-slate-700 bg-slate-900/60 px-2 py-2 text-xs">
                      <div className="mb-2 text-slate-300">Navigate:</div>
                      <div className="flex flex-wrap gap-2">
                        {[navHint, ...(navList || [])].filter(Boolean).map((n, i) => (
                          <button key={i}
                            onClick={() => { if (!n) return; setOpen(false); router.push(n.path + (n.hash || '')); }}
                            className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2 py-1 text-cyan-200 hover:bg-cyan-400/20"
                          >{n!.label}</button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                  {resp.sources?.length ? (
                    <div className="mt-2 text-slate-400 flex flex-wrap items-center gap-2">
                      <span className="opacity-80">Sources:</span>
                      {resp.sources.map((s, i) => (
                        <span key={i} className="text-xs rounded-full px-2 py-0.5 border border-slate-700 bg-slate-900/60 text-slate-300">{s.source}</span>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
            {toast && <div className="mt-3 text-xs text-emerald-300/90">{toast}</div>}
          </div>
    </>
  ) : null;

  // Global shortcut: Cmd/Ctrl + K to toggle
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && k === 'k') { e.preventDefault(); setOpen(o => !o); }
      if (k === 'escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!mounted) return null;
  return <>
    {createPortal(orbButton, dock || document.body)}
    {panel && createPortal(panel, document.body)}
  </>;
}

function HoloOrb({ listening }: { listening?: boolean }){
  return (
    <div className={`relative h-full w-full ${listening ? 'listening' : ''}`}>
      <div className="absolute inset-0 rounded-full"
        style={{
          background: "radial-gradient(circle at 45% 40%, rgba(56,189,248,0.9), rgba(56,189,248,0.25) 35%, rgba(139,92,246,0.15) 55%, rgba(2,6,23,0.2) 70%, transparent 75%)",
          boxShadow: "0 0 40px rgba(56,189,248,0.35), inset 0 0 26px rgba(139,92,246,0.25)",
        }}
      />
      <div className="absolute inset-0 rounded-full border border-cyan-300/30" />
      <div className="absolute inset-[-30%] rounded-full animate-spin-slow"
        style={{
          background: "conic-gradient(from 0deg, rgba(56,189,248,0.0), rgba(56,189,248,0.55), rgba(139,92,246,0.0) 40%, rgba(139,92,246,0.45), rgba(56,189,248,0.0) 80%)",
          WebkitMask: "radial-gradient(farthest-side, transparent 60%, #000 61%)",
          mask: "radial-gradient(farthest-side, transparent 60%, #000 61%)",
        }}
      />
      <div className="absolute inset-0 rounded-full" style={{ boxShadow: "0 0 60px rgba(56,189,248,0.35)" }} />
      {listening ? <Waveform /> : null}
    </div>
  );
}

function Waveform(){
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(()=>{
    const c = ref.current; if(!c) return; const ctx = c.getContext('2d'); if(!ctx) return;
    let raf = 0; const dpr = Math.min(2, window.devicePixelRatio||1);
    const resize=()=>{ const s=c.parentElement?.getBoundingClientRect(); if(!s) return; c.width=s.width*dpr; c.height=s.height*dpr; ctx.setTransform(dpr,0,0,dpr,0,0); };
    resize();
    const bars = 40; let t=0;
    const step=()=>{
      const w=c.width/dpr, h=c.height/dpr; ctx.clearRect(0,0,w,h);
      const cx=w/2, cy=h/2, r=Math.min(w,h)/2*0.68;
      for(let i=0;i<bars;i++){
        const a = (i/bars)*Math.PI*2 + t; const amp = 8 + 6*Math.sin(t*2 + i*0.6);
        const x1 = cx + Math.cos(a)*(r-amp), y1 = cy + Math.sin(a)*(r-amp);
        const x2 = cx + Math.cos(a)*(r+amp), y2 = cy + Math.sin(a)*(r+amp);
        ctx.strokeStyle = 'rgba(34,211,238,0.55)'; ctx.lineWidth=1.2; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
      }
      t += 0.03; raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const onResize=()=>resize(); window.addEventListener('resize', onResize);
    return ()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  },[]);
  return <canvas ref={ref} className="absolute inset-0 rounded-full" aria-hidden />
}
