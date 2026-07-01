"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

function extractFromEventString(input: string): string | null {
  const matches = [...input.matchAll(/text=(["']{1,3})([\s\S]*?)\1/g)]
    .map((m) => m[2]?.trim())
    .filter(Boolean)

  if (matches.length) return matches.join("\n").trim()
  return null
}

function formatAnswer(answer: unknown): string {
  if (answer === null || answer === undefined) return ""

  if (typeof answer === "string") {
    const trimmed = answer.trim()
    if (!trimmed) return ""

    const eventText = extractFromEventString(trimmed)
    if (eventText) return eventText

    try {
      const parsed = JSON.parse(trimmed)
      return typeof parsed === "string" ? parsed : JSON.stringify(parsed, null, 2)
    } catch {
      return trimmed
    }
  }

  if (typeof answer === "object") {
    if ("content" in answer && typeof (answer as { content?: string }).content === "string") {
      return (answer as { content: string }).content
    }
    return JSON.stringify(answer, null, 2)
  }

  return String(answer)
}

const promptSuggestions = [
  "What projects are featured on this site?",
  "Tell me about the smart paddle patent.",
  "What is the cricket analytics work?",
  "What sports background is listed here?"
]

export default function AdkChat({
  placeholder = "Ask about projects, experience, sports, or contact details from this site"
}: {
  title?: string
  placeholder?: string
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Ask me about Venky's experience, projects, sports background, or contact details. I answer from what is published on this site."
    }
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState("")
  const recognitionRef = useRef<any>(null)
  const messagesRef = useRef<ChatMessage[]>(messages)
  const [speechOutputSupported, setSpeechOutputSupported] = useState(false)
  const [speakReplies, setSpeakReplies] = useState(false)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoListen, setAutoListen] = useState(false)

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    if (typeof window === "undefined") return
    if ("speechSynthesis" in window) {
      setSpeechOutputSupported(true)
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        voiceRef.current = pickExpressiveVoice(voices)
      }
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = null
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const stopSpeaking = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }

    if (speechRef.current) {
      speechRef.current.onend = null
      speechRef.current.onerror = null
      speechRef.current = null
    }

    setIsSpeaking(false)
  }, [])

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current
    if (!recognition) return false

    try {
      recognition.start()
      setIsListening(true)
      setInterimTranscript("")
      return true
    } catch {
      return false
    }
  }, [])

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current
    if (!recognition) return

    try {
      recognition.stop()
    } catch {
      return
    }

    setIsListening(false)
  }, [])

  const pickExpressiveVoice = (voices: SpeechSynthesisVoice[]) => {
    const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("en"))
    const preferred = [
      "aria",
      "jenny",
      "guy",
      "samantha",
      "google us english",
      "google uk english",
      "natural",
      "zira",
      "david",
      "alex"
    ]

    return (
      preferred
        .map((name) => englishVoices.find((voice) => voice.name.toLowerCase().includes(name)))
        .find(Boolean) ??
      englishVoices[0] ??
      voices[0] ??
      null
    )
  }

  const cleanSpokenLine = useCallback((line: string) =>
    line
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/github\.com\/vchandrasekaran/gi, "GitHub, github dot com slash vchandrasekaran")
      .replace(/linkedin\.com\/in\/venkateshnaidu/gi, "LinkedIn, linkedin dot com slash in slash venkatesh naidu")
      .replace(/@venky_6/g, "at venky 6")
      .replace(/DBT/g, "D B T")
      .replace(/BI/g, "B I")
      .replace(/ETL/g, "E T L")
      .replace(/LLM/g, "L L M")
      .replace(/USPTO/g, "U S P T O")
      .replace(/\s{2,}/g, " ")
      .trim(), [])

  const normalizeSpeakText = useCallback((text: string) => {
    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)

    const regularLines: string[] = []
    const bulletLines: string[] = []

    for (const line of lines) {
      if (/^[-*]\s+/.test(line)) bulletLines.push(cleanSpokenLine(line.replace(/^[-*]\s+/, "")))
      else regularLines.push(cleanSpokenLine(line))
    }

    const spokenBullets = bulletLines.map((line, index) => {
      const lead = ["First", "Next", "Also", "Finally"][index] ?? "Also"
      return `${lead}, ${line.replace(/[.!?]$/, "")}.`
    })

    return [...regularLines, ...spokenBullets]
      .join(" ")
      .replace(/\s*:\s*/g, ": ")
      .replace(/\s{2,}/g, " ")
      .trim()
  }, [cleanSpokenLine])

  const speakText = useCallback(
    (text: string) => {
      if (!speechOutputSupported || !text) return

      try {
        stopSpeaking()
        const utterance = new SpeechSynthesisUtterance(normalizeSpeakText(text))
        if (voiceRef.current) utterance.voice = voiceRef.current
        utterance.pitch = 1.08
        utterance.rate = 0.94
        utterance.volume = 1
        utterance.onstart = () => setIsSpeaking(true)
        utterance.onend = () => {
          setIsSpeaking(false)
          if (autoListen) startListening()
        }
        utterance.onerror = () => {
          setIsSpeaking(false)
          if (autoListen) startListening()
        }
        speechRef.current = utterance
        window.speechSynthesis.speak(utterance)
      } catch {
        if (autoListen) startListening()
      }
    },
    [autoListen, normalizeSpeakText, speechOutputSupported, startListening, stopSpeaking]
  )

  const handleSend = useCallback(
    async (text: string, opts?: { fromVoice?: boolean }) => {
      if (!text || loading) return

      const base = messagesRef.current
      const newMessages: ChatMessage[] = [...base, { role: "user", content: text }]

      setMessages(newMessages)
      setInput("")
      setLoading(true)
      setError(null)

      try {
        const res = await fetch("/api/adk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newMessages })
        })

        const data = await res.json()
        if (!res.ok || data.error) {
          setError(data.error || "Unknown error")
        } else {
          const formatted = formatAnswer(data.answer) || "I could not produce a response. Try rephrasing the question."
          const assistantReply: ChatMessage = { role: "assistant", content: formatted }
          setMessages([...newMessages, assistantReply])

          if ((speakReplies || opts?.fromVoice) && speechOutputSupported) {
            speakText(formatted)
          }
        }
      } catch (err: any) {
        setError(err.message || String(err))
      } finally {
        setLoading(false)
      }
    },
    [loading, speakReplies, speakText, speechOutputSupported]
  )

  useEffect(() => {
    if (typeof window === "undefined") return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = true
    recognition.maxAlternatives = 1
    recognition.continuous = false
    recognitionRef.current = recognition
    setSpeechSupported(true)

    recognition.onresult = (event: any) => {
      let finalText = ""
      let interim = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalText += transcript
        } else {
          interim += transcript
        }
      }

      setInterimTranscript(interim)

      if (finalText.trim()) {
        setInterimTranscript("")
        handleSend(finalText.trim(), { fromVoice: true })
      }
    }

    recognition.onstart = () => {
      setIsListening(true)
      setInterimTranscript("")
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimTranscript("")
    }

    recognition.onerror = () => {
      setIsListening(false)
      setInterimTranscript("")
    }

    return () => {
      recognition.stop()
    }
  }, [handleSend])

  useEffect(() => {
    if (!autoListen || !speechSupported) return
    if (!isListening && !isSpeaking) {
      startListening()
    }
  }, [autoListen, speechSupported, isListening, isSpeaking, startListening])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = input.trim()
    await handleSend(text)
  }

  const handleStopAll = useCallback(() => {
    stopSpeaking()
    stopListening()
    setInterimTranscript("")
  }, [stopListening, stopSpeaking])

  const toggleListening = () => {
    if (!speechSupported) return
    if (isListening || isSpeaking) {
      setAutoListen(false)
      handleStopAll()
      return
    }
    stopSpeaking()
    startListening()
  }

  const statusLabel = isListening ? "Listening" : isSpeaking ? "Speaking" : loading ? "Thinking" : "Ready"

  return (
    <section className="container-max py-5">
      <div className="section-shell p-6 md:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="card p-4 sm:p-5">
            <div className="flex flex-col gap-4 border-b border-slate-200 px-1 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">Site chat</p>
                <p className="mt-2 text-sm text-slate-600">
                  Ask about the portfolio, Venky&apos;s background, or anything already published on this site.
                </p>
                <p className="mt-2 text-xs font-medium text-slate-500">Voice: {statusLabel}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={!speechSupported}
                  className={`inline-flex items-center gap-3 rounded-md border px-3 py-2 text-sm font-medium transition ${
                    speechSupported
                      ? "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-slate-950"
                      : "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  }`}
                >
                  <span
                    className={`h-3 w-3 rounded-full ${
                      isListening ? "bg-blue-400" : isSpeaking ? "bg-blue-500" : loading ? "bg-slate-400" : "bg-blue-600"
                    }`}
                  />
                  {isListening || isSpeaking ? "Stop voice" : "Start voice"}
                </button>
                <button
                  type="button"
                  onClick={() => setAutoListen((prev) => !prev)}
                  disabled={!speechSupported}
                  className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                    autoListen
                      ? "border-blue-500 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-slate-950"
                  } ${!speechSupported ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  {autoListen ? "Auto-listen on" : "Auto-listen off"}
                </button>
                <button
                  type="button"
                  onClick={() => setSpeakReplies((prev) => !prev)}
                  disabled={!speechOutputSupported}
                  className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                    speakReplies
                      ? "border-blue-500 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-slate-950"
                  } ${!speechOutputSupported ? "cursor-not-allowed opacity-40" : ""}`}
                >
                  {speechOutputSupported ? (speakReplies ? "Voice replies on" : "Voice replies off") : "No voice output"}
                </button>
              </div>
            </div>

            {interimTranscript ? (
              <p className="mt-4 rounded-lg bg-slate-950 px-4 py-3 text-sm text-white">Listening: {interimTranscript}</p>
            ) : null}

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">Try</span>
              {promptSuggestions.map((prompt) => (
                <button
                  key={`chat-${prompt}`}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:border-blue-300 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto rounded-lg bg-slate-50 p-3 sm:p-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                  className={`max-w-[85%] rounded-lg px-4 py-3 text-sm leading-7 shadow-sm ${
                    m.role === "user"
                        ? "bg-slate-950 text-white"
                        : "border border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>

            {error ? (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-4 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-300"
              />

              <div className="flex justify-end">
                <button
                  disabled={loading || !input.trim()}
                  className="rounded-md bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                  {loading ? "Thinking..." : "Send question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
