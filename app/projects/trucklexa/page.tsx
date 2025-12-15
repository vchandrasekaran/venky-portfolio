"use client";

export default function TrucklexaPage() {
  const stack = ["Alexa Skills Kit", "Node.js", "Python", "AWS Lambda", "API Gateway", "Truckstop APIs"];
  const highlights = [
    "End-to-end voice booking flow that trims multi-screen workflows down to a single Alexa request.",
    "Lambda orchestrations handle authentication, slot validation, and status checks so brokers keep their hands free.",
    "Events land in Truckstop + Snowflake for audit trails and BI dashboards, proving out conversational BI patterns.",
  ];

  return (
    <div className="mx-auto max-w-3xl py-12 space-y-8">
      <header>
        <p className="text-sm uppercase tracking-[0.4em] text-white/60">Active Project</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Trucklexa · Alexa Skill for Load Booking</h1>
        <p className="mt-3 text-white/70">
          Voice-first broker assistant: speak a load request, Alexa hits Truckstop, Lambdas validate and book, then BI
          dashboards show what happened. Below is the end-to-end flow so you can see where each piece fits.
        </p>
      </header>

      <section className="rounded-2xl border border-white/15 bg-white/5 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-white">Technical Snapshot</h2>
        <ul className="mt-4 flex flex-wrap gap-2 text-sm text-white/80">
          {stack.map((item) => (
            <li key={item} className="rounded-full border border-white/20 px-3 py-1 bg-white/10">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-white/15 bg-white/5 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-white">Flowchart · How Trucklexa runs</h2>
        <div className="mt-4 grid gap-4 text-sm text-white/80">
          <FlowItem
            title="1) Voice intent to Alexa"
            body="Broker says, “Alexa, ask Trucklexa for reefer loads to Dallas.” Alexa Skills Kit parses the utterance into slots (equipment, lane, dates)."
          />
          <FlowItem
            title="2) Intent router (Lambda · Node.js)"
            body="Validates slots, normalizes city/state, and enforces auth against a pre-registered broker profile. Bad/missing slots trigger a reprompt."
          />
          <FlowItem
            title="3) Search (Lambda · Python)"
            body="Calls Truckstop load search APIs, applies business filters (equipment, distance, deadhead), and ranks options by score."
          />
          <FlowItem
            title="4) Voice response + SSML"
            body="Alexa responds with the top option(s): lane, rate, pickup ETA. SSML adds brief pauses so it’s easy to follow while driving."
          />
          <FlowItem
            title="5) Booking confirmation"
            body="“Book it” follow-up intent hits a secure Lambda to confirm the load, log the decision, and trigger notifications (Slack/email)."
          />
          <FlowItem
            title="6) Telemetry + BI"
            body="All intents, responses, and bookings stream into Snowflake (or Domo) for dashboards: intent volume, success rate, and top lanes."
          />
        </div>
      </section>

      <section className="rounded-2xl border border-white/15 bg-white/5 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-white">Why it matters</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-white/80">
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function FlowItem({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 p-4 shadow-[0_8px_20px_rgba(0,0,0,0.15)]">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">{title}</p>
      <p className="mt-2 text-white/80">{body}</p>
    </div>
  );
}
