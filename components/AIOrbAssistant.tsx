"use client";
import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
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

type StageVariant = "portrait" | "mini";
type StageComponent = ComponentType<{ className?: string; speaking?: boolean; variant?: StageVariant }>;

function AssistantVisual({ variant, speaking, listening }: { variant: StageVariant; speaking: boolean; listening: boolean }) {
  const shellSize = variant === "mini" ? "h-16 w-16" : "h-[min(70vw,70vh,520px)] w-[min(70vw,70vh,520px)]";
  const glowSize = variant === "mini" ? "h-20 w-20 blur-xl" : "h-[min(78vw,78vh,620px)] w-[min(78vw,78vh,620px)] blur-2xl";
  const frameClass =
    variant === "mini"
      ? "rounded-full border border-[rgba(255,235,243,0.35)] bg-[rgba(12,18,30,0.75)] shadow-[0_12px_40px_rgba(10,12,16,0.65)]"
      : "rounded-[18px] border border-[rgba(255,235,243,0.28)] bg-[rgba(12,14,18,0.85)] shadow-[0_20px_60px_rgba(2,6,23,0.55)]";
  return (
    <div className={`relative flex items-center justify-center ${shellSize}`}>
      <div className={`pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-[rgba(255,235,243,0.08)] via-[rgba(255,109,174,0.08)] to-transparent`} />
      <div className={`pointer-events-none absolute ${glowSize} rounded-full bg-[rgba(127,93,255,0.18)]`} />
      <div className={`relative flex h-full w-full items-center justify-center ${frameClass}`}>
        <AssistantAvatar listening={listening} speaking={speaking} />
      </div>
    </div>
  );
}

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
  const [Stage3DComponent, setStage3DComponent] = useState<StageComponent | null>(null);
  const [VRMStageComponent, setVRMStageComponent] = useState<StageComponent | null>(null);
  const [useThreeDee, setUseThreeDee] = useState(true);
  const router = useRouter();

  const [isListening, setIsListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const recognitionRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const transcriptRef = useRef("");

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let cancelled = false;
    import("@/components/assistant3d/Stage")
      .then((mod) => {
        if (cancelled) return;
        const stage = mod as { default?: StageComponent };
        if (stage.default) {
          const Comp = stage.default as StageComponent;
          setStage3DComponent(() => Comp);
        }
      })
      .catch(() => {});
    import("@/components/assistant3d/VRMStage")
      .then((mod) => {
        if (cancelled) return;
        const vrm = mod as { default?: StageComponent };
        if (vrm.default) {
          const Comp = vrm.default as StageComponent;
          setVRMStageComponent(() => Comp);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
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
      const r = await fetch("/api/assistant/stream", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }) });
      if (r.ok && r.body) {
        const reader = r.body.getReader();
        const decoder = new TextDecoder("utf-8");
        let answer = "";
        let sources: { source: string }[] = [];
        let metaParsed = false;
        let buffer = "";
        setResp({ answer: "", sources: [] });
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          if (!metaParsed && buffer.startsWith("META ")) {
            const nl = buffer.indexOf("\n");
            if (nl === -1) continue;
            try {
              const meta = JSON.parse(buffer.slice(5, nl));
              sources = meta.sources || [];
              if (meta.nav) setNavHint(meta.nav);
              if (meta.navList) setNavList(meta.navList);
            } catch {}
            metaParsed = true;
            buffer = buffer.slice(nl + 1);
            setResp({ answer: "", sources });
          }
          if (metaParsed && buffer) {
            answer += buffer;
            buffer = "";
            setResp({ answer, sources });
          }
        }
        if (voiceEnabled && answer && typeof window !== "undefined" && "speechSynthesis" in window) {
          try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(answer.replace(/[#*`>-]/g, " "));
            utterance.rate = 1.02;
            utterance.pitch = 1.02;
            utterance.onstart = () => setSpeaking(true);
            utterance.onend = () => setSpeaking(false);
            utterance.onboundary = () => setSpeaking((prev) => !prev);
            window.speechSynthesis.speak(utterance);
          } catch {}
        }
      } else {
        const r2 = await fetch("/api/ask-venkatesh", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }) });
        const data = (await r2.json()) as QAResponse;
        setResp(data);
        if (voiceEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
          try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(data.answer.replace(/[#*`>-]/g, " "));
            utterance.onstart = () => setSpeaking(true);
            utterance.onend = () => setSpeaking(false);
            utterance.onboundary = () => setSpeaking((prev) => !prev);
            utterance.rate = 1.02;
            utterance.pitch = 1.02;
            window.speechSynthesis.speak(utterance);
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
    try { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); } catch {}
    const rec = new Rec();
    recognitionRef.current = rec;
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.continuous = false;
    transcriptRef.current = "";
    rec.onresult = (ev: any) => {
      let final = "";
      let interim = "";
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
      const finalText = (transcriptRef.current || q || "").trim();
      if (finalText) ask(finalText);
    };
    try { rec.start(); setIsListening(true); } catch {}
  };

  const orbButton = (
    <div className="pointer-events-none fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[2147483647]">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Open AI assistant"
        className={`relative ai-orb h-16 w-16 pointer-events-auto rounded-full outline-none overflow-hidden border border-[rgba(255,109,174,0.35)] bg-[rgba(10,12,16,0.85)] shadow-[0_0_0_1px_rgba(255,109,174,0.12),0_8px_20px_rgba(5,6,10,0.6)] ${isListening ? "listening" : ""}`}
        title={isListening ? "Listening..." : "AI Assistant"}
      >
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {useThreeDee && VRMStageComponent ? (
            <VRMStageComponent speaking={speaking} variant="mini" />
          ) : useThreeDee && Stage3DComponent ? (
            <Stage3DComponent speaking={speaking} variant="mini" />
          ) : (
            <AssistantVisual variant="mini" speaking={speaking} listening={isListening} />
          )}
        </div>
        <span className="absolute inset-0 rounded-full border border-[rgba(127,93,255,0.35)]" />
      </button>
    </div>
  );

  const panel = open ? (
    <>
      <div className="fixed inset-0 z-[2147483645] bg-black/40 backdrop-blur-sm" aria-hidden onClick={() => setOpen(false)} />
      <div className="fixed sm:bottom-20 sm:right-6 bottom-20 right-4 z-[2147483647] w-[380px] max-w-[92vw] rounded-2xl border border-slate-700 bg-slate-950/90 p-4 shadow-2xl backdrop-blur">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="text-sm text-slate-300">Ask about my experience, projects, or tools.</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setExpanded(true)} className="text-xs rounded border border-slate-700 px-2 py-1 text-slate-300 hover:text-white" title="Expand portrait">Expand</button>
            {(VRMStageComponent || Stage3DComponent) ? (
              <button
                onClick={() => setUseThreeDee((v) => !v)}
                className={`text-xs rounded border px-2 py-1 ${useThreeDee ? "border-cyan-400 text-cyan-200" : "border-slate-700 text-slate-300"} hover:text-white`}
                title="Toggle 3D avatar"
              >
                {useThreeDee ? "3D On" : "3D Off"}
              </button>
            ) : null}
            <button onClick={() => setVoiceEnabled((v) => !v)} className="text-xs rounded border border-slate-700 px-2 py-1 text-slate-300 hover:text-white" title="Toggle voice">
              {voiceEnabled ? "Voice On" : "Voice Off"}
            </button>
            <button onClick={() => setOpen(false)} className="text-xs rounded border border-slate-700 px-2 py-1 text-slate-300 hover:text-white">Close</button>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask()}
            placeholder={isListening ? "Listening... speak your question" : "Type a question"}
            className="flex-1 rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          />
          <button onClick={() => ask()} disabled={loading} className="rounded-lg bg-cyan-400 text-slate-900 px-3 py-2 text-sm min-h-[36px] hover:brightness-95 disabled:opacity-60">
            {loading ? "..." : "Ask"}
          </button>
          <button onClick={toggleListen} className={`rounded-lg px-3 py-2 text-sm border ${isListening ? "border-emerald-400 text-emerald-300" : "border-slate-700 text-slate-300"}`} title="Speak your question">
            {isListening ? "Stop" : "Mic"}
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                const t = s.toLowerCase();
                if (t.includes("open projects") || t.includes("projects")) {
                  setOpen(false);
                  router.push("/projects");
                  return;
                }
                if (t.includes("experience")) { setOpen(false); router.push("/experience"); return; }
                if (t.includes("contact")) { setOpen(false); router.push("/contact"); return; }
                if (t.includes("skills")) { setOpen(false); router.push("/#skills"); return; }
                if (t.includes("ai talent")) { setOpen(false); router.push("/projects/ai-talent-pulse"); return; }
                setQ(s);
                setTimeout(() => ask(s), 0);
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
                      <button
                        key={i}
                        onClick={() => {
                          if (!n) return;
                          setOpen(false);
                          router.push(n.path + (n.hash || ""));
                          setTimeout(() => {
                            window.dispatchEvent(new CustomEvent("assistant-highlight", { detail: { path: n.path, hash: n.hash } }));
                          }, 350);
                        }}
                        className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2 py-1 text-cyan-200 hover:bg-cyan-400/20"
                      >
                        {n!.label}
                      </button>
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

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && k === "k") { e.preventDefault(); setOpen((o) => !o); }
      if (k === "escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!mounted) return null;
  return (
    <>
      {createPortal(orbButton, document.body)}
      {panel && createPortal(panel, document.body)}
      {expanded && createPortal(
        <div className="fixed inset-0 z-[2147483646] bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="relative w-[min(92vw,1000px)] max-h-[85vh] overflow-auto rounded-3xl border border-[rgba(255,109,174,0.35)] bg-[rgba(10,12,16,0.9)] p-6 shadow-[0_0_0_1px_rgba(255,109,174,0.12),0_24px_60px_rgba(5,6,10,0.7)]">
            <div className="flex items-start justify-between">
              <div className="text-sm text-slate-300">Ares Assistant</div>
              <button onClick={() => setExpanded(false)} className="text-xs rounded border border-slate-700 px-2 py-1 text-slate-300 hover:text-white">Collapse</button>
            </div>
            <div className="mt-4 grid gap-6 md:grid-cols-[1fr,1.1fr] items-center">
              <div className="assistant-breath relative mx-auto aspect-square w-[min(70vw,70vh,520px)] portrait-frame">
                {useThreeDee && VRMStageComponent ? <VRMStageComponent className="absolute inset-0" speaking={speaking} variant="portrait" /> : null}
                {useThreeDee && !VRMStageComponent && Stage3DComponent ? (
                  <div className="absolute inset-0">
                    <Stage3DComponent className="absolute inset-0" speaking={speaking} variant="portrait" />
                  </div>
                ) : null}
                {(!useThreeDee || (!VRMStageComponent && !Stage3DComponent)) ? (
                  <AssistantVisual variant="portrait" speaking={speaking} listening={isListening} />
                ) : null}
                <span className="frame-corner tl" /><span className="frame-corner tr" /><span className="frame-corner bl" /><span className="frame-corner br" />
              </div>
              <div>
                <div className="text-slate-200 text-lg">How can I help?</div>
                <div className="mt-3 flex gap-2">
                  <button onClick={toggleListen} className={`rounded-lg px-3 py-2 text-sm border ${isListening ? "border-emerald-400 text-emerald-300" : "border-slate-700 text-slate-300"}`}>{isListening ? "Stop Listening" : "Start Listening"}</button>
                  <button onClick={() => setOpen(true)} className="rounded-lg border border-[rgba(255,109,174,0.45)] bg-[rgba(255,109,174,0.12)] px-3 py-2 text-sm text-[rgba(255,235,243,0.95)]">Open Chat</button>
                </div>
                <div className="mt-4 text-xs text-slate-400">Tip: Say &ldquo;Open Projects&rdquo; or &ldquo;Go to Experience&rdquo; - I&apos;ll navigate and highlight the target.</div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
