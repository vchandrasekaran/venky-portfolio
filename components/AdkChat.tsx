"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

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
    if ("content" in answer && typeof (answer as any).content === "string") {
      return (answer as any).content;
    }
    return JSON.stringify(answer, null, 2);
  }
  return String(answer);
}

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
  const [autoListen, setAutoListen] = useState(false);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("speechSynthesis" in window) {
      setSpeechOutputSupported(true);
      setSpeakReplies(true);
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (speechRef.current) {
      speechRef.current.onend = null;
      speechRef.current.onerror = null;
      speechRef.current = null;
    }
    setIsSpeaking(false);
  }, []);

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return false;
    try {
      recognition.start();
      setIsListening(true);
      setInterimTranscript("");
      return true;
    } catch {
      return false;
    }
  }, []);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.stop();
    } catch {
      // SpeechRecognition can throw if already stopped; ignore.
    }
    setIsListening(false);
  }, []);

  const normalizeSpeakText = (text: string) => {
    if (!text) return "";
    return text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/^[\s]*[-*\u2022]\s*/gm, " bullet ")
      .replace(/[-*\u2022]\s+/g, " bullet ")
      .replace(/#/g, " number ")
      .replace(/\s{2,}/g, " ")
      .replace(/[\r\n]+/g, ". ")
      .trim();
  };

  const speakText = useCallback(
    (text: string) => {
      if (!speechOutputSupported || !text) return;
      try {
        stopSpeaking();
        const utterance = new SpeechSynthesisUtterance(normalizeSpeakText(text));
        utterance.pitch = 1.1;
        utterance.rate = 1.2;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          if (autoListen) {
            startListening();
          }
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          if (autoListen) {
            startListening();
          }
        };
        speechRef.current = utterance;
        window.speechSynthesis.speak(utterance);
      } catch {
        if (autoListen) {
          startListening();
        }
      }
    },
    [autoListen, speechOutputSupported, startListening, stopSpeaking]
  );

  const handleSend = useCallback(
    async (text: string, opts?: { fromVoice?: boolean }) => {
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
          if ((speakReplies || opts?.fromVoice) && speechOutputSupported) {
            speakText(formatted);
          }
        }
      } catch (err: any) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    },
    [loading, speakReplies, speakText, speechOutputSupported]
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
        handleSend(finalText.trim(), { fromVoice: true });
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

  useEffect(() => {
    if (!autoListen || !speechSupported) return;
    if (!isListening && !isSpeaking) {
      startListening();
    }
  }, [autoListen, speechSupported, isListening, isSpeaking, startListening]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    await handleSend(text);
  }

  const handleStopAll = useCallback(() => {
    stopSpeaking();
    stopListening();
    setInterimTranscript("");
  }, [stopListening, stopSpeaking]);

  const toggleListening = () => {
    if (!speechSupported) return;
    if (isListening) {
      stopListening();
      return;
    }
    stopSpeaking();
    startListening();
  };

  const engaged = isListening || isSpeaking;
  const orbState = isListening ? "listening" : isSpeaking ? "speaking" : loading ? "thinking" : "idle";
  const orbGradient =
    orbState === "listening"
      ? "linear-gradient(145deg, #1b52ff 0%, #2ca4ff 50%, #66f2ff 100%)"
      : orbState === "speaking"
      ? "linear-gradient(145deg, #6a5bff 0%, #9c7dff 45%, #c3a7ff 100%)"
      : orbState === "thinking"
      ? "linear-gradient(145deg, #ff9b5f 0%, #ffb677 45%, #ffd7a3 100%)"
      : "linear-gradient(145deg, #0f1b3f 0%, #163966 45%, #1b52ff 100%)";
  const orbShadow =
    orbState === "listening"
      ? "0 0 55px rgba(38,160,255,0.55)"
      : orbState === "speaking"
      ? "0 0 55px rgba(156,125,255,0.55)"
      : orbState === "thinking"
      ? "0 0 45px rgba(255,166,110,0.45)"
      : "0 0 35px rgba(52,92,255,0.45)";
  const statusLabel =
    orbState === "listening"
      ? "Listening..."
      : orbState === "speaking"
      ? "Speaking..."
      : orbState === "thinking"
      ? "Thinking..."
      : "Tap to talk";

  const waveStyles = `
    .adk-wave-wrap {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      mix-blend-mode: screen;
    }
    .adk-wave {
      position: absolute;
      width: 180%;
      height: 80%;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%) scale(1.05);
      opacity: 0.85;
      background-size: 200% 100%;
      filter: drop-shadow(0 25px 45px rgba(24, 173, 255, 0.35));
    }
    .adk-wave-two {
      animation-duration: 13s;
      animation-direction: alternate-reverse;
      opacity: 0.65;
      filter: drop-shadow(0 25px 45px rgba(255, 118, 187, 0.3));
    }
    .adk-wave-three {
      width: 210%;
      height: 95%;
      opacity: 0.55;
      filter: blur(8px);
      animation-duration: 16s;
    }
    .adk-wave-one {
      background-image: linear-gradient(115deg, rgba(103,79,255,0.05), rgba(103,79,255,0.65) 30%, rgba(255,53,167,0.8) 70%, rgba(255,240,158,0.6));
      clip-path: polygon(0% 68%, 7% 63%, 14% 60%, 21% 63%, 28% 58%, 36% 61%, 44% 55%, 52% 58%, 60% 52%, 68% 56%, 76% 50%, 84% 54%, 92% 48%, 100% 51%, 100% 100%, 0% 100%);
      animation: adkWaveDrift 10s ease-in-out infinite alternate, adkWaveShift 18s linear infinite;
    }
    .adk-wave-two {
      background-image: linear-gradient(105deg, rgba(51,232,255,0.3), rgba(68,149,255,0.7) 40%, rgba(255,55,155,0.85) 70%, rgba(255,153,102,0.4));
      clip-path: polygon(0% 78%, 8% 73%, 16% 70%, 24% 74%, 32% 67%, 40% 72%, 48% 64%, 56% 69%, 64% 62%, 72% 66%, 80% 59%, 88% 64%, 96% 56%, 100% 60%, 100% 100%, 0% 100%);
      animation: adkWaveDrift 13s ease-in-out infinite alternate-reverse, adkWaveShiftReverse 24s linear infinite;
    }
    .adk-wave-three {
      background-image: linear-gradient(140deg, rgba(143, 76, 255, 0.15), rgba(84, 220, 255, 0.65) 45%, rgba(255, 80, 156, 0.45) 80%);
      clip-path: polygon(0% 60%, 7% 55%, 15% 58%, 23% 53%, 31% 56%, 39% 50%, 47% 54%, 55% 48%, 63% 52%, 71% 47%, 79% 49%, 87% 45%, 95% 47%, 100% 44%, 100% 100%, 0% 100%);
      animation: adkWaveDriftSlow 16s ease-in-out infinite alternate, adkWaveShift 28s linear infinite;
    }
    .adk-wave-glow {
      position: absolute;
      inset: 12%;
      border-radius: 999px;
      background: radial-gradient(circle at 40% 50%, rgba(41,196,255,0.45), transparent 70%);
      filter: blur(30px);
      animation: adkWavePulse 6s ease-in-out infinite;
    }
    @keyframes adkWaveDrift {
      0% {
        transform: translate(-50%, -50%) scale(1);
      }
      50% {
        transform: translate(-48%, -52%) scale(1.05);
      }
      100% {
        transform: translate(-52%, -48%) scale(1.08);
      }
    }
    @keyframes adkWaveDriftSlow {
      0% {
        transform: translate(-50%, -50%) scale(1.02);
      }
      100% {
        transform: translate(-49%, -51%) scale(1.08);
      }
    }
    @keyframes adkWaveShift {
      from {
        background-position: 0% 50%;
      }
      to {
        background-position: 200% 50%;
      }
    }
    @keyframes adkWaveShiftReverse {
      from {
        background-position: 200% 50%;
      }
      to {
        background-position: 0% 50%;
      }
    }
    @keyframes adkWavePulse {
      0% {
        opacity: 0.35;
        transform: scale(0.9);
      }
      50% {
        opacity: 0.7;
        transform: scale(1.05);
      }
      100% {
        opacity: 0.35;
        transform: scale(0.95);
      }
    }
  `;

  return (
    <>
      <section className="container-max mt-12">
        <div className="rounded-3xl border border-white/10 bg-[#0b0d18] shadow-[0_35px_80px_rgba(3,7,18,0.65)] p-6 md:p-8 relative overflow-hidden">
          {engaged && (
            <div className="adk-wave-wrap">
              <div className="adk-wave adk-wave-one" />
              <div className="adk-wave adk-wave-two" />
              <div className="adk-wave adk-wave-three" />
              <div className="adk-wave-glow" />
            </div>
          )}
          <div className="relative z-10 flex flex-col gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.45em] text-[#a1a6c4]">
              ADK x Gemini
            </span>
            <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>
            <p className="text-sm text-[#a6abc9]">
              Powered by Venky&apos;s site context, Gemini 2.5, and Google Search.
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
                className="absolute inset-0 rounded-full blur-3xl opacity-70 transition-all"
                style={{ backgroundImage: orbGradient, boxShadow: orbShadow }}
              />
              <div
                className="relative h-20 w-20 rounded-full border border-white/20 transition-all"
                style={{ backgroundImage: orbGradient, boxShadow: orbShadow }}
              />
            </button>
            <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-center text-[12px] text-[#cfd2e9] shadow-inner lg:text-left">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#b3b3b3]">
                {speechSupported ? "Voice Status" : "Microphone unavailable"}
              </p>
              <p className="mt-2 text-base text-white">{speechSupported ? statusLabel : "Enable microphone to talk"}</p>
              {interimTranscript && (
                <p className="mt-1 text-xs text-cyan-200">&ldquo;{interimTranscript}&rdquo;</p>
              )}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <button
                  type="button"
                  onClick={handleStopAll}
                  className="rounded-xl border border-white/20 px-3 py-1.5 text-[11px] font-semibold text-white/80 transition hover:text-white"
                >
                  Stop
                </button>
                <button
                  type="button"
                  onClick={() => setAutoListen((prev) => !prev)}
                  disabled={!speechSupported}
                  className={`rounded-xl px-3 py-1.5 text-[11px] font-semibold transition ${
                    speechSupported
                      ? autoListen
                        ? "bg-white/20 text-white"
                        : "bg-white/10 text-white/80 hover:text-white"
                      : "bg-white/5 text-white/30 cursor-not-allowed"
                  }`}
                >
                  {autoListen ? "Auto-listen on" : "Auto-listen off"}
                </button>
              </div>
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
        </div>
      </section>
      <style jsx>{waveStyles}</style>
    </>
  );
}
