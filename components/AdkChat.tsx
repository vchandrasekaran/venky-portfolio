"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
  const [speechSupported, setSpeechSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const messagesRef = useRef<ChatMessage[]>(messages);
  const [speechOutputSupported, setSpeechOutputSupported] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("speechSynthesis" in window) {
      setSpeechOutputSupported(true);
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

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

  const normalizeSpeakText = (text: string) => {
    if (!text) return "";
    const bulletMap: Record<string, string> = {
      "\\*": "•",
      "-": "•",
      "•": "•",
    };

    let sanitized = text;
    sanitized = sanitized.replace(/\*\*(.*?)\*\*/g, "$1");
    sanitized = sanitized.replace(
      /([•\-\*]\s+)([^•\-\*]+)/g,
      (_match, prefix, content) => {
        return `• ${content.trim()}\n`;
      }
    );
    sanitized = sanitized.replace(/\\s+/g, " ");
    sanitized = sanitized.replace(/#+/g, " number ");
    return sanitized.trim();
  };

  const speakText = useCallback(
    (text: string) => {
      if (!speechOutputSupported || !text) return;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(normalizeSpeakText(text));
        utterance.pitch = 1.1;
        utterance.rate = 1.2;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } catch {}
    },
    [speechOutputSupported]
  );

  const handleSend = useCallback(
    async (text: string) => {
      if (!text || loading) return;

      const base = messagesRef.current;
      const newMessages: ChatMessage[] = [...base, { role: "user", content: text }];

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
          const formatted = formatAnswer(data.answer);
          const assistantReply: ChatMessage = {
            role: "assistant",
            content: formatted,
          };
          setMessages([...newMessages, assistantReply]);
          if (speakReplies || isListening) {
            speakText(formatted);
          }
        }
      } catch (err: any) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    },
    [loading, speakReplies, speakText]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;
    recognitionRef.current = recognition;
    setSpeechSupported(true);

    recognition.onresult = (event: any) => {
      let finalText = "";
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interim += transcript;
        }
      }
      setInterimTranscript(interim);
      if (finalText.trim()) {
        setInterimTranscript("");
        handleSend(finalText.trim());
      }
    };

    recognition.onstart = () => {
      setIsListening(true);
      setInterimTranscript("");
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    recognition.onerror = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    return () => {
      recognition.stop();
    };
  }, [handleSend]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    await handleSend(text);
  }

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }
    try {
      recognition.start();
      setIsListening(true);
      setInterimTranscript("");
    } catch (_err) {
      setIsListening(false);
    }
  };

  const orbState = isListening ? "listening" : isSpeaking ? "speaking" : loading ? "thinking" : "idle";
  const orbGlow =
    orbState === "listening"
      ? "from-[#1b52ff] via-[#2ca4ff] to-[#66f2ff]"
      : orbState === "speaking"
      ? "from-[#6a5bff] via-[#9c7dff] to-[#c3a7ff]"
      : orbState === "thinking"
      ? "from-[#ff9b5f] via-[#ffb677] to-[#ffd7a3]"
      : "from-[#0f1b3f] via-[#163966] to-[#1b52ff]";
  const statusLabel =
    orbState === "listening"
      ? "Listening..."
      : orbState === "speaking"
      ? "Speaking..."
      : orbState === "thinking"
      ? "Thinking..."
      : "Tap to talk";

  return (
    <section className="container-max mt-12">
      <div className="rounded-3xl border border-white/10 bg-[#0b0d18] shadow-[0_35px_80px_rgba(3,7,18,0.65)] p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.45em] text-[#a1a6c4]">
              ADK x Gemini
            </span>
            <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>
            <p className="text-sm text-[#a6abc9]">
              Powered by Venky's site context, Gemini 2.5, and Google Search.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 lg:flex-row lg:gap-6">
            <button
              type="button"
              onClick={toggleListening}
              disabled={!speechSupported}
              className={`relative flex h-24 w-24 items-center justify-center rounded-full transition-all duration-500 ${
                speechSupported ? "" : "opacity-40 cursor-not-allowed"
              }`}
            >
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${orbGlow} blur-2xl opacity-70 transition-all`}
              />
              <div
                className={`relative h-20 w-20 rounded-full border border-white/20 bg-gradient-to-br ${orbGlow} shadow-[0_0_35px_rgba(39,171,255,0.45)]`}
              />
            </button>
            <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-center text-[12px] text-[#cfd2e9] shadow-inner lg:text-left">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#b3b3b3]">
                {speechSupported ? "Voice Status" : "Microphone unavailable"}
              </p>
              <p className="mt-2 text-base text-white">{speechSupported ? statusLabel : "Enable microphone to talk"}</p>
              {interimTranscript && <p className="mt-1 text-xs text-cyan-200">“{interimTranscript}”</p>}
            </div>
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
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSpeakReplies((prev) => !prev)}
              disabled={!speechOutputSupported}
              className={`rounded-xl px-4 py-3 text-sm font-semibold md:min-w-[120px] ${
                speechOutputSupported
                  ? speakReplies
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-white hover:bg-white/20"
                  : "bg-white/5 text-white/40 cursor-not-allowed"
              }`}
            >
              {speechOutputSupported ? (speakReplies ? "Mute replies" : "Speak replies") : "No TTS"}
            </button>
            <button
              disabled={loading || !input.trim()}
              className="rounded-xl bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-40 md:min-w-[120px]"
            >
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>
        </form>
        {interimTranscript && speechSupported && (
          <p className="text-xs text-white/60">Listening: {interimTranscript}</p>
        )}
      </div>
    </section>
  );
}
