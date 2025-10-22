"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import AssistantAvatar from "@/components/assistant/AssistantAvatar";

type QAResponse = { answer: string; sources: { source: string }[] };

const SUGGESTIONS = [
  "Open Projects",
  "Show Experience",
  "Contact Venkatesh",
  "Skills and Tools",
  "AI Talent Pulse"
];

export default function AIOrbAssistant() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<QAResponse | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [navHint, setNavHint] = useState<{ path: string; hash?: string; label: string } | null>(null);
  const [navList, setNavList] = useState<{ path: string; hash?: string; label: string }[] | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [mode3D, setMode3D] = useState(false);
  const router = useRouter();

  // Voice
  const [isListening, setIsListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const transcriptRef = useRef("");

  useEffect(() => { setMounted(true); }, []);

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
          try { 
            window.speechSynthesis.cancel(); 
            const u = new SpeechSynthesisUtterance(answer.replace(/[#*`>-]/g,' ')); 
            u.rate=1.02; u.pitch=1.02; 
            u.onstart = () => setSpeaking(true);
            u.onend = () => setSpeaking(false);
            u.onboundary = () => setSpeaking(prev => !prev);
            window.speechSynthesis.speak(u);
          } catch {}
        }
      } else {
        // Fallback to simple keyword API
        const r2 = await fetch("/api/ask-venkatesh", { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question }) })
        const data = (await r2.json()) as QAResponse
        setResp(data)
        if (voiceEnabled && typeof window !== 'undefined' && 'speechSynthesis' in window) {
          try { 
            window.speechSynthesis.cancel(); 
            const u = new SpeechSynthesisUtterance(data.answer.replace(/[#*`>-]/g,' '));
            u.onstart = () => setSpeaking(true);
            u.onend = () => setSpeaking(false);
            u.onboundary = () => setSpeaking(prev => !prev);
            u.rate=1.02; u.pitch=1.02; 
            window.speechSynthesis.speak(u);
          } catch {}
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
    try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch {}
    const rec = new Rec();
    recognitionRef.current = rec;
    rec.lang = 'en-US';
    rec.interimResults = true;
    rec.continuous = false;
    transcriptRef.current = "";
    rec.onresult = (ev: any) => {
      let final = ""; let interim = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const res = ev.results[i];
        if (res.isFinal) final += res[0].transcript;
        else interim += res[0].transcript;
      }
      const combined = (transcriptRef.current + " " + (final || interim)).trim();
      transcriptRef.current = (transcriptRef.current + " " + final).trim();
      setQ(combined);
    };
    rec.onerror = (e: any) => {
      setIsListening(false);
      if (e?.error) {
        setToast(`Voice error: ${e.error}`);
        setTimeout(() => setToast(null), 1500);
      }
    };
    rec.onend = () => {
      setIsListening(false);
      const finalText = (transcriptRef.current || q || '').trim();
      if (finalText) ask(finalText);
    };
    try { rec.start(); setIsListening(true); } catch {}
  };

  const orbButton = (
    <button
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      aria-label="Open AI assistant"
      className={`ai-orb fixed sm:bottom-6 sm:right-6 bottom-4 right-4 z-[2147483646] h-16 w-16 rounded-full outline-none ${isListening ? 'listening' : ''}`}
      title={isListening ? 'Listeningâ€¦' : 'AI Assistant'}
    >
      <AssistantAvatar listening={isListening} speaking={speaking} />
    </button>
  );

  const panel = open ? (
    <>
      <div className="fixed inset-0 z-[2147483645] bg-black/40 backdrop-blur-sm" aria-hidden onClick={() => setOpen(false)} />
      <div className="fixed sm:bottom-20 sm:right-6 bottom-20 right-4 z-[2147483647] w-[380px] max-w-[92vw] rounded-2xl border border-slate-700 bg-slate-950/90 p-4 shadow-2xl backdrop-blur">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="text-sm text-slate-300">Ask about my experience, projects, or tools.</div>
              <div className="flex items-center gap-2">
                <button onClick={() => setExpanded(true)} className="text-xs rounded border border-slate-700 px-2 py-1 text-slate-300 hover:text-white" title="Expand portrait">Expand</button>
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
                placeholder={isListening ? 'Listeningâ€¦ speak your question' : 'Type a question'}
                className="flex-1 rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              />
              <button onClick={() => ask()} disabled={loading} className="rounded-lg bg-cyan-400 text-slate-900 px-3 py-2 text-sm min-h-[36px] hover:brightness-95 disabled:opacity-60">
                {loading ? 'â€¦' : 'Ask'}
              </button>
              <button onClick={toggleListen} className={`rounded-lg px-3 py-2 text-sm border ${isListening ? 'border-emerald-400 text-emerald-300' : 'border-slate-700 text-slate-300'}`} title="Speak your question">
                {isListening ? 'Stop' : 'Mic'}
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    const t = s.toLowerCase();
                    // Handle common nav intents directly to avoid API calls and errors
                    if (t.includes('open projects') || t.includes('projects')) {
                      setOpen(false); router.push('/projects'); return;
                    }
                    if (t.includes('experience')) { setOpen(false); router.push('/experience'); return; }
                    if (t.includes('contact')) { setOpen(false); router.push('/contact'); return; }
                    if (t.includes('skills')) { setOpen(false); router.push('/#skills'); return; }
                    if (t.includes('ai talent')) { setOpen(false); router.push('/projects/ai-talent-pulse'); return; }
                    // Fallback to asking if not a nav chip
                    setQ(s); setTimeout(() => ask(s), 0);
                  }}
                  className="text-xs rounded-full px-2.5 py-1 border border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800/80"
                >
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
                            onClick={() => { if (!n) return; setOpen(false); router.push(n.path + (n.hash || '')); setTimeout(() => { window.dispatchEvent(new CustomEvent('assistant-highlight', { detail: { path: n.path, hash: n.hash } })); }, 350); }}
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
    {createPortal(orbButton, document.body)}
    {panel && createPortal(panel, document.body)}
    {expanded && createPortal(
      <div className="fixed inset-0 z-[2147483646] bg-black/70 backdrop-blur-sm flex items-center justify-center">
        <div className="relative w-[92vw] max-w-[720px] rounded-3xl border border-[rgba(255,59,0,0.35)] bg-[rgba(10,12,16,0.9)] p-6 shadow-[0_0_0_1px_rgba(255,59,0,0.12),0_24px_60px_rgba(5,6,10,0.7)]">
          <div className="flex items-start justify-between">
            <div className="text-sm text-slate-300">Ares Assistant</div>
            <button onClick={() => setExpanded(false)} className="text-xs rounded border border-slate-700 px-2 py-1 text-slate-300 hover:text-white">Collapse</button>
          </div>
          <div className="mt-4 grid gap-6 md:grid-cols-[0.9fr,1.1fr] items-center">
            <div className="assistant-breath h-56 w-56 mx-auto">
              {mode3D ? (
                // Lazy import via dynamic would be ideal; keeping simple here
                require('@/components/assistant3d/AssistantStage').default()
              ) : (
                <AssistantAvatar listening={isListening} speaking={speaking} />
              )}
            </div>
            <div>
              <div className="text-slate-200 text-lg">How can I help?</div>
              <div className="mt-3 flex gap-2">
                <button onClick={toggleListen} className={`rounded-lg px-3 py-2 text-sm border ${isListening ? 'border-emerald-400 text-emerald-300' : 'border-slate-700 text-slate-300'}`}>{isListening ? 'Stop Listening' : 'Start Listening'}</button>
                <button onClick={() => setOpen(true)} className="rounded-lg border border-[rgba(255,59,0,0.45)] bg-[rgba(255,59,0,0.12)] px-3 py-2 text-sm text-[rgba(255,200,180,0.95)]">Open Chat</button>
                <button onClick={() => setMode3D(m => !m)} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:text-white">{mode3D ? '2D' : '3D Beta'}</button>
              </div>
              <div className="mt-4 text-xs text-slate-400">Tip: Say "Open Projects" or "Go to Experience" — I'll navigate and highlight the target.</div>
            </div>
          </div>
        </div>
      </div>, document.body)}
  </>;
}

// (local avatar and waveform moved to components/assistant/AssistantAvatar)

