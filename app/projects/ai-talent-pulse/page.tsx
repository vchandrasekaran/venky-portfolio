export default function AITalentPulse() {
  const src = "https://ai-talent-data.streamlit.app/?embed=true";
  return (
    <main className="container-max py-10">
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">🤖 AI Talent Pulse</h1>
      <p className="mt-2 text-slate-400">
        Interactive labor-market signals for AI roles — filters, KPIs, and charts. Phase 2 adds Snowflake + dbt + AI copilot.
      </p>
      <div className="mt-6 card overflow-hidden">
        <iframe
          src={src}
          className="w-full"
          style={{ height: "80vh", border: 0 }}
          allow="fullscreen"
        />
      </div>
    </main>
  );
}
