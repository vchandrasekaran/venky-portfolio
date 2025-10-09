"use client";
import { useEffect, useState } from "react";

export default function VoiceClient() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    let recognition: any;
    if (!recording) return;
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) return;
    recognition = new SR();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = (e: any) => {
      let txt = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        txt += e.results[i][0].transcript;
      }
      setTranscript(txt);
    };
    recognition.start();
    return () => { try { recognition && recognition.stop(); } catch {} };
  }, [recording]);

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="text-xs text-slate-400 space-y-2">
      <div className="flex gap-2">
        <button onClick={() => setRecording(v => !v)} className="rounded bg-slate-800 px-3 py-1 border border-slate-600">
          {recording ? "Stop" : "Start"} Voice
        </button>
        <button onClick={() => speak("Hello, I am your AI console.")} className="rounded bg-slate-800 px-3 py-1 border border-slate-600">
          Test TTS
        </button>
      </div>
      {transcript ? <div className="mt-1 text-slate-300">You said: {transcript}</div> : null}
    </div>
  );
}

