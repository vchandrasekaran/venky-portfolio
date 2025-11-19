import os
from fastapi import FastAPI
from pydantic import BaseModel
from google.adk.agents import Agent
from google.adk.models.google_llm import Gemini
from google.adk.runners import InMemoryRunner
from google.genai import types
from google.adk.tools import google_search
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
assert GOOGLE_API_KEY, "GOOGLE_API_KEY not set in environment/.env"

retry_config = types.HttpRetryOptions(
    attempts=5,
    exp_base=7,
    initial_delay=1,
    http_status_codes=[429, 500, 503, 504],
)

root_agent = Agent(
    name="site_helper",
    model=Gemini(model="gemini-2.5-flash-lite", retry_options=retry_config),
    description="Conversational assistant for Venky and general questions.",
    instruction=(
        "You are a helpful, conversational assistant for Venky's portfolio website. "
        "You are given optional context chunks from the website. "
        "1) ALWAYS prefer answering directly from that context if it clearly contains the answer. "
        "2) If the context does not contain the answer and the question is about general knowledge, current events, or anything unrelated to Venky, "
        "you MUST invoke the Google Search tool and answer using those search results. "
        "3) Only say 'I don’t have that knowledge yet based on this website’s content, but I’ll soon be able to help.' "
        "when both the site context and Google Search fail to provide a clear answer. "
        "Keep answers concise and friendly."
    ),
    tools=[google_search],
)

runner = InMemoryRunner(agent=root_agent)
app = FastAPI()


class ChatMessage(BaseModel):
    role: str
    content: str


class AskIn(BaseModel):
    messages: list[ChatMessage]
    context: str | None = None


def build_prompt(messages: list[ChatMessage], context: str | None) -> str:
    parts = []
    if context:
        parts.append("Website context:\n" + context + "\n")

    parts.append("Conversation so far:")
    for m in messages:
        role = m.role.lower()
        prefix = "User" if role == "user" else "Assistant"
        parts.append(f"{prefix}: {m.content}")
    parts.append("Assistant:")
    return "\n".join(parts)


@app.post("/ask")
async def ask(payload: AskIn):
    try:
        prompt = build_prompt(payload.messages, payload.context)
        resp = await runner.run_debug(prompt)
        answer = getattr(resp, "final_response", None) or str(resp)
        return {"answer": answer}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
