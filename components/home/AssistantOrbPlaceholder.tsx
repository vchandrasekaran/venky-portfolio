"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type OrbStatus = "idle" | "listening" | "thinking" | "speaking";

export default function AssistantOrbPlaceholder() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Tap the orb and ask anything about Venky, his BI stack, or even general trivia.",
    },
  ]);
  const [status, setStatus] = useState<OrbStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [interim, setInterim] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechOutSupported, setSpeechOutSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const normalizeSpeechText = (text: string) =>
    text
      .replace(/\s+\*/g, " times ")
      .replace(/\*/g, " times ")
      .replace(/#/g, " number ")
      .replace(/\s{2,}/g, " ")
      .trim();

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !speechOutSupported || !text) return;
      try {
        setStatus("speaking");
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(normalizeSpeechText(text));
        utterance.rate = 1.15;
        utterance.pitch = 1.05;
        utterance.onend = () => setStatus("idle");
        utterance.onerror = () => setStatus("idle");
        window.speechSynthesis.speak(utterance);
      } catch {
        setStatus("idle");
      }
    },
    [speechOutSupported]
  );

  const sendPrompt = useCallback(
    async (text: string) => {
      if (!text) return;
      const base = messagesRef.current;
      const newMessages: ChatMessage[] = [...base, { role: "user", content: text }];
      setMessages(newMessages);
      setStatus("thinking");
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
          setStatus("idle");
        } else {
          const reply: ChatMessage = {
            role: "assistant",
            content: typeof data.answer === "string" ? data.answer : JSON.stringify(data.answer, null, 2),
          };
          setMessages((prev) => [...prev, reply]);
          if (speechOutSupported) speak(reply.content);
          else setStatus("idle");
        }
      } catch (err: any) {
        setError(err.message || String(err));
        setStatus("idle");
      }
    },
    [speak, speechOutSupported]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;
      setSpeechSupported(true);

      recognition.onresult = (event: any) => {
        let finalText = "";
        let interimText = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalText += transcript;
          else interimText += transcript;
        }
        setInterim(interimText);
        if (finalText.trim()) {
          setInterim("");
          sendPrompt(finalText.trim());
        }
      };
      recognition.onstart = () => setStatus("listening");
      recognition.onerror = () => {
        setStatus("idle");
        setInterim("");
      };
      recognition.onend = () => {
        if (status === "listening") setStatus("idle");
      };
    }
    if ("speechSynthesis" in window) {
      setSpeechOutSupported(true);
    }
    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, [sendPrompt, status]);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    if (status === "listening") {
      recognition.stop();
      setStatus("idle");
      return;
    }
    try {
      recognition.start();
      setInterim("");
    } catch {
      setStatus("idle");
    }
  };

  const orbGlow =
    status === "listening"
      ? "from-[#1b52ff] via-[#2ca4ff] to-[#66f2ff]"
      : status === "speaking"
      ? "from-[#6a5bff] via-[#9c7dff] to-[#c3a7ff]"
      : "from-[#0f1b3f] via-[#163966] to-[#1b52ff]";

  const statusLabel =
    status === "listening"
      ? "Listening..."
      : status === "thinking"
      ? "Thinking..."
      : status === "speaking"
      ? "Speaking..."
      : "Tap to talk";

  return (
    <section className="container-max pb-16">
      <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-[#0b0d18] px-6 py-10 text-slate-200 shadow-[0_25px_45px_rgba(0,0,0,0.45)] lg:flex-row lg:items-center">
        <button
          type="button"
          onClick={toggleListening}
          disabled={!speechSupported}
          className={`relative mx-auto flex h-40 w-40 items-center justify-center rounded-full transition-all duration-500 ${
            speechSupported ? "" : "opacity-40 cursor-not-allowed"
          }`}
        >
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${orbGlow} blur-2xl opacity-70 transition-all`}
          />
          <div className={`relative h-32 w-32 rounded-full border border-white/15 bg-gradient-to-br ${orbGlow} shadow-[0_0_60px_rgba(39,171,255,0.45)]`} />
        </button>
        <div className="flex-1 space-y-4 text-center lg:text-left">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[#7f88a9]">Voice Orb</p>
          <h3 className="text-2xl font-semibold text-white">Ask out loud</h3>
          <p className="text-sm text-slate-300">
            Leveraging the same ADK agent used in chat, the orb listens, sends the prompt, and plays back the response.
          </p>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 shadow-[0_15px_30px_rgba(0,0,0,0.35)] backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#b3b3b3]">
              {speechSupported ? "Status" : "Microphone unavailable"}
            </p>
            <p className="mt-2 text-base text-white">{speechSupported ? statusLabel : "Enable microphone access in your browser"}</p>
            {interim && <p className="mt-2 text-xs text-cyan-200">�{interim}�</p>}
            {error && <p className="mt-2 text-xs text-red-300">{error}</p>}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 shadow-[0_15px_30px_rgba(0,0,0,0.35)] backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.4em] text-[#b3b3b3]">Recent reply</p>
            <p className="mt-2 text-sm text-slate-200">{messages[messages.length - 1]?.content}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
