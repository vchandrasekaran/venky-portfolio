"use client";

import { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function AdkChat({
  title = "Chat with Venky's Assistant",
  placeholder = "Ask anything about Venky's BI work, pickleball journey, or general questions",
}: {
  title?: string;
  placeholder?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm Venky's AI assistant. Ask me about his background, BI/analytics work, pickleball journey, or general questions. I can also use Google Search for fresh info.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function extractFromEventString(input: string): string | null {
    const matches = [...input.matchAll(/text=(["']{1,3})([\s\S]*?)\1/g)]
      .map((m) => m[2]?.trim())
      .filter(Boolean);
    if (matches.length) return matches.join("\n").trim();
    return null;
  }

  function formatAnswer(answer: any): string {
    if (answer === null || answer === undefined) return "";
    if (typeof answer === "string") {
      const trimmed = answer.trim();
      if (!trimmed) return "";
      const eventText = extractFromEventString(trimmed);
      if (eventText) return eventText;
      try {
        const parsed = JSON.parse(trimmed);
        return typeof parsed === "string" ? parsed : JSON.stringify(parsed, null, 2);
      } catch {
        return trimmed;
      }
    }
    if (typeof answer === "object") {
      if ("content" in answer && typeof answer.content === "string") return answer.content;
      return JSON.stringify(answer, null, 2);
    }
    return String(answer);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/adk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Unknown error");
      } else {
        const assistantReply: ChatMessage = {
          role: "assistant",
          content: formatAnswer(data.answer),
        };
        setMessages([...newMessages, assistantReply]);
      }
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="container-max mt-12">
      <div className="rounded-3xl border border-white/10 bg-[#0b0d18] shadow-[0_35px_80px_rgba(3,7,18,0.65)] p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.45em] text-[#a1a6c4]">
              ADK x Gemini
            </span>
            <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>
            <p className="text-sm text-[#a6abc9]">
              Powered by Venky's site context, Gemini 2.5, and Google Search.
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-[12px] text-[#cfd2e9] shadow-inner">
            Ask about projects, BI stack, or anything you’re curious about.
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111425] p-4 max-h-96 overflow-y-auto space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white rounded-br-sm"
                    : "bg-white/5 text-[#d5d9f3] rounded-bl-sm border border-white/5"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-2 text-xs text-red-200 shadow-inner">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#0f1224] p-3 shadow-inner md:flex-row md:items-center"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            className="flex-1 rounded-xl border border-white/10 bg-[#0b0d1a] px-4 py-3 text-sm text-white placeholder:text-white/40 outline-none transition focus:border-white/40"
          />
          <button
            disabled={loading || !input.trim()}
            className="rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-40 md:min-w-[120px]"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </form>
      </div>
    </section>
  );
}
