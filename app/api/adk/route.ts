export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getTopKContext } from "@/lib/rag/retrieve";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "messages (array) is required" }, { status: 400 });
    }

    const lastUser = [...messages].reverse().find((m: ChatMessage) => m.role === "user");
    const question = lastUser?.content ?? "";

    let context = "";
    if (question) {
      try {
        context = await getTopKContext(question, 5);
      } catch (err) {
        console.error("RAG error", err);
      }
    }

    const url = process.env.ADK_URL ?? "http://127.0.0.1:8787/ask";

    const payload = { messages, context } as { messages: ChatMessage[]; context: string };

    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await r.json();
    if (!r.ok) {
      return NextResponse.json({ error: data?.detail || "ADK backend error" }, { status: 502 });
    }

    return NextResponse.json({ answer: data.answer });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}
