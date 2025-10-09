"use client";
import { useState } from "react";

export default function AIConsole() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<{ answer: string; sources?: { source: string }[] } | null>(null);

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

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 rounded-full bg-cyan-400 text-slate-900 px-4 py-3 shadow-lg"
      >
        {open ? "Close Console" : "Open AI Console"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-[400px] max-w-[92vw] bg-slate-900/90 backdrop-blur border border-slate-700 rounded-2xl p-4 shadow-xl">
          <div className="text-xs uppercase tracking-widest text-cyan-300 mb-1">AI Console</div>
          <div className="text-sm text-slate-300 mb-2">Ask about my experience or projects.</div>
          <div className="flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask()}
              placeholder="e.g., How did you cut dashboard sprawl?"
              className="flex-1 rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
            />
            <button onClick={ask} disabled={loading} className="rounded-lg bg-cyan-400 text-slate-900 px-3 py-2 text-sm">
              {loading ? "…" : "Ask"}
            </button>
          </div>
          <div className="mt-3 text-sm whitespace-pre-wrap">
            {resp && (
              <>
                <div className="text-slate-200">{resp.answer}</div>
                {resp.sources?.length ? (
                  <div className="mt-2 text-slate-400">Sources: {resp.sources.map((s, i) => (<span key={i} className="mr-2">{s.source}</span>))}</div>
                ) : null}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

