"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const SUGGESTIONS = ["Snowflake", "dbt", "Power BI", "Domo", "AI Job Market"];

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(text: string, query: string) {
  const words = query.toLowerCase().split(/\W+/).filter(Boolean);
  if (!words.length) return text;
  const re = new RegExp("(" + words.map(escapeRegex).join("|") + ")", "ig");
  const parts = text.split(re);
  return parts.map((part, i) =>
    words.includes(part.toLowerCase()) ? (
      <mark key={i} className="bg-yellow-300/30 text-inherit rounded px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function AskWidget() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<{ answer: string; sources: { source: string }[] } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    setShow(true);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const to = setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(to);
      document.body.style.overflow = prevOverflow;
      setShow(false);
    };
  }, [open]);

  const ask = async () => {
    if (!q.trim()) return;
    setLoading(true);
    setResp(null);
    const r = await fetch("/api/ask-venkatesh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q }),
    });
    const data = await r.json();
    setResp(data);
    setLoading(false);
  };

  const copyAnswer = async () => {
    if (!resp?.answer) return;
    try {
      await navigator.clipboard.writeText(resp.answer);
      setToast("Answer copied");
      setTimeout(() => setToast(null), 1200);
    } catch {}
  };

  const copySource = async (src: string) => {
    try {
      await navigator.clipboard.writeText(src);
      setToast("Source copied");
      setTimeout(() => setToast(null), 1200);
    } catch {}
  };

  const widget = (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="ask-toggle fixed sm:bottom-6 sm:right-6 bottom-4 right-4 z-[2147483646] rounded-full bg-cyan-400 text-slate-900 px-4 py-3 min-h-[44px] min-w-[44px] shadow-lg hover:brightness-95 active:translate-y-px transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 touch-manipulation"
      >
        {open ? "Close Q&A" : "Ask Venkatesh"}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[2147483645] bg-black/30 backdrop-blur-sm select-none"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            role="dialog"
            aria-modal="true"
            className={`fixed sm:bottom-20 sm:right-6 bottom-20 right-4 z-[2147483647] w-[360px] max-w-[92vw] bg-slate-900/95 backdrop-blur border border-slate-700 rounded-2xl p-4 shadow-2xl transition duration-150 ease-out transform ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="text-sm text-slate-300">Ask about my experience, projects, or tools.</div>
              {resp?.answer ? (
                <button
                  onClick={copyAnswer}
                  className="text-xs text-slate-300/80 hover:text-white border border-slate-700 rounded px-2 py-1"
                  title="Copy answer"
                >
                  Copy
                </button>
              ) : null}
            </div>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={q}
                onChange={e => setQ(e.target.value)}
                onKeyDown={e => e.key === "Enter" && ask()}
                placeholder="e.g., How did you consolidate 200+ dashboards?"
                className="flex-1 rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              />
              <button onClick={ask} disabled={loading} className="rounded-lg bg-cyan-400 text-slate-900 px-3 py-2 text-sm min-h-[36px] sm:min-h-[40px] hover:brightness-95 disabled:opacity-60">
                {loading ? "â€¦" : "Ask"}
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setQ(s); setTimeout(ask, 0); }}
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
                  <div className="h-3 rounded bg-slate-800/80 animate-pulse w-9/12" />
                </div>
              ) : resp ? (
                <>
                  <div className="text-slate-200">{highlight(resp.answer, q)}</div>
                  {resp.sources?.length ? (
                    <div className="mt-2 text-slate-400 flex flex-wrap items-center gap-2">
                      <span className="opacity-80">Sources:</span>
                      {resp.sources.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => copySource(s.source)}
                          className="text-xs rounded-full px-2 py-0.5 border border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800/80"
                          title="Copy source path"
                        >
                          {s.source}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
            {toast && (
              <div className="mt-3 text-xs text-emerald-300/90">{toast}</div>
            )}
          </div>
        </>
      )}
    </>
  );

  // Avoid SSR/client markup mismatch: render nothing on server
  if (!mounted) return null;

  return createPortal(widget, document.body);
}


