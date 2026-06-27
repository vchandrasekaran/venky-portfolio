export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { helpResponse, retrieveKnowledge, summarizeChunks } from "@/lib/assistant/retrieval";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const LOCAL_ADK_URL =
  process.env.NODE_ENV === "development" && !process.env.VERCEL ? "http://127.0.0.1:8787/ask" : undefined;
const ADK_AGENT_URL = process.env.ADK_AGENT_URL ?? process.env.ADK_URL ?? LOCAL_ADK_URL;
const ADK_TIMEOUT_MS = Number(process.env.ADK_TIMEOUT_MS ?? 4500);
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const SITE_ASSISTANT_ENGINE = (process.env.SITE_ASSISTANT_ENGINE ?? "local").toLowerCase();
const SITE_ASSISTANT_MODEL = process.env.SITE_ASSISTANT_MODEL ?? "gemini-2.5-flash-lite";
const GEMINI_TIMEOUT_MS = Number(process.env.SITE_ASSISTANT_TIMEOUT_MS ?? 7000);
const MAX_CONTEXT_CHARS = 6500;
const MAX_HISTORY_MESSAGES = 8;

const SYSTEM_PROMPT = [
  "You are the conversational website guide for Venkatesh Naidu's portfolio.",
  "Answer only from the provided website context and the current conversation.",
  "Be direct, accurate, and conversational, similar to a strong portfolio walkthrough.",
  "When answering about a role, project, patent, or skill, include the specific outcomes, metrics, tools, and page details that are present in the website context.",
  "If the context includes bullet points for the relevant topic, use the strongest 2 or 3 bullets in your answer.",
  "Do not mention retrieval, context chunks, source files, ADK, Gemini, or implementation details.",
  "Do not use outside knowledge, search the web, or invent missing facts.",
  "If the website context does not contain the answer, say that plainly and offer the closest related website detail.",
  "Keep most answers to 2-5 sentences. Use bullets only when the user asks for a list or comparison.",
  "When asked where something is, name the page or section in normal language."
].join(" ");

function engineEnabled(engine: "adk" | "model") {
  if (engine === "adk") return SITE_ASSISTANT_ENGINE === "adk";
  return SITE_ASSISTANT_ENGINE === "model" || SITE_ASSISTANT_ENGINE === "gemini" || SITE_ASSISTANT_ENGINE === "grounded-model";
}

function extractFromEventString(input: string): string | null {
  const matches = [...input.matchAll(/text=(["']{1,3})([\s\S]*?)\1/g)]
    .map((match) => match[2]?.trim())
    .filter(Boolean);

  if (matches.length) return matches.join("\n").trim();
  return null;
}

function cleanAgentAnswer(answer: unknown) {
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

  if (typeof answer === "object" && "content" in answer && typeof (answer as { content?: string }).content === "string") {
    return (answer as { content: string }).content;
  }

  return String(answer);
}

async function askAdkAgent(messages: ChatMessage[], context: string) {
  if (!engineEnabled("adk") || !ADK_AGENT_URL) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ADK_TIMEOUT_MS);

  try {
    const response = await fetch(ADK_AGENT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, context }),
      signal: controller.signal
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) return null;

    const answer = cleanAgentAnswer(data?.answer);
    return answer || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function recentConversation(messages: ChatMessage[]) {
  return messages
    .slice(-MAX_HISTORY_MESSAGES)
    .map((message) => {
      const role = message.role === "assistant" ? "Assistant" : "User";
      return `${role}: ${message.content.trim()}`;
    })
    .join("\n");
}

function buildGroundedPrompt(messages: ChatMessage[], context: string) {
  const websiteContext = context.trim()
    ? context.trim().slice(0, MAX_CONTEXT_CHARS)
    : "No matching website content was found for this question.";

  return [
    "Website context:",
    websiteContext,
    "",
    "Conversation:",
    recentConversation(messages),
    "",
    "Write the next assistant reply. Stay grounded to the website context."
  ].join("\n");
}

function extractGeminiText(data: any) {
  const parts = data?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return "";

  return parts
    .map((part) => (typeof part?.text === "string" ? part.text : ""))
    .filter(Boolean)
    .join("\n")
    .trim();
}

async function askGroundedModel(messages: ChatMessage[], context: string) {
  if (!engineEnabled("model") || !GOOGLE_API_KEY) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), GEMINI_TIMEOUT_MS);
  const model = encodeURIComponent(SITE_ASSISTANT_MODEL);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: [
            {
              role: "user",
              parts: [{ text: buildGroundedPrompt(messages, context) }]
            }
          ],
          generationConfig: {
            temperature: 0.35,
            topP: 0.9,
            maxOutputTokens: 520
          }
        }),
        signal: controller.signal
      }
    );

    const data = await response.json().catch(() => ({}));
    if (!response.ok) return null;

    return extractGeminiText(data) || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages (array) is required" }, { status: 400 });
    }

    const lastUser = [...messages].reverse().find((m: ChatMessage) => m.role === "user");
    const question = lastUser?.content?.trim() ?? "";
    if (!question) {
      return NextResponse.json({ error: "A user question is required." }, { status: 400 });
    }

    const normalized = question.toLowerCase();
    if (["help", "what can you answer", "what can you do"].includes(normalized)) {
      return NextResponse.json({ answer: helpResponse() });
    }

    const { chunks, context, sources } = await retrieveKnowledge(question, process.cwd(), 5);
    const groundedAnswer = await askGroundedModel(messages, context);
    if (groundedAnswer) {
      return NextResponse.json({ answer: groundedAnswer, sources, mode: "grounded-model" });
    }

    const agentAnswer = await askAdkAgent(messages, context);
    if (agentAnswer) {
      return NextResponse.json({ answer: agentAnswer, sources, mode: "adk" });
    }

    const answer = summarizeChunks(question, chunks);
    return NextResponse.json({ answer, sources, mode: "local" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}
