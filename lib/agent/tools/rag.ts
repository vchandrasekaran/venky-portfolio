export async function askDocs(question: string) {
  const r = await fetch("/api/ask-venkatesh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  return await r.json(); // {answer, sources}
}

