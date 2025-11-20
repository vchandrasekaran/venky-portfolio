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
        <p className="text-sm uppercase tracking-[0.4em] text-gray-400">Active Project</p>
        <h1 className="mt-2 text-3xl font-semibold text-gray-900">Trucklexa · Alexa Skill for Load Booking</h1>
        <p className="mt-3 text-gray-600">
          A hands-free brokerage assistant Venky built so carrier reps can request availability, confirm details, and
          book loads using only their voice. It pairs Alexa voice intents with Python + Node.js Lambdas that talk to
          Truckstop APIs and push telemetry into BI dashboards.
        </p>
      </header>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Technical Snapshot</h2>
        <ul className="mt-4 flex flex-wrap gap-2 text-sm text-gray-600">
          {stack.map((item) => (
            <li key={item} className="rounded-full border border-gray-200 px-3 py-1 bg-gray-50">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Why it matters</h2>
        <p className="text-gray-600">
          Venky wanted to validate how conversational interfaces can collapse mundane workflows. Trucklexa became the
          proving ground: speech-to-intent mapping, secure booking actions, and downstream BI instrumentation all in a
          single prototype.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700">
          {highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Demo flow</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-gray-700">
          <li>
            Broker says, &ldquo;Alexa, ask Trucklexa to check reefer loads for Dallas&rdquo;. Alexa sends the intent to
            Lambda.
          </li>
          <li>
            Lambda calls Truckstop search APIs, scores the options, and responds verbally while logging metrics to
            Snowflake/Domo dashboards.
          </li>
          <li>
            A follow-up voice command confirms the booking and triggers notifications plus a Slack handoff.
          </li>
        </ol>
      </section>
    </div>
  );
}
