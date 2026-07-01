"use client"

const stack = ['Alexa Skills Kit', 'Node.js', 'Python', 'AWS Lambda', 'API Gateway', 'Truckstop APIs']
const highlights = [
  'End-to-end voice booking flow that trims multi-screen workflows down to a single Alexa request.',
  'Lambda orchestration handles authentication, slot validation, and response formatting for a hands-free workflow.',
  'Events can flow into Truckstop and Snowflake for auditability, telemetry, and BI reporting.'
]

const flow = [
  {
    title: '1. Voice intent',
    body: 'A broker speaks a load request and Alexa parses equipment, lane, and other intent slots.'
  },
  {
    title: '2. Validation',
    body: 'Node.js Lambda normalizes slots, applies business rules, and checks authentication.'
  },
  {
    title: '3. Search',
    body: 'Python logic calls Truckstop APIs, ranks options, and prepares the best match set.'
  },
  {
    title: '4. Confirmation',
    body: 'Follow-up intents confirm the booking and trigger notifications or downstream events.'
  },
  {
    title: '5. Telemetry',
    body: 'Each action becomes a measurable event that can power dashboarding and workflow analytics.'
  }
]

export default function TrucklexaPage() {
  return (
    <div className="container-max space-y-6 pb-10 pt-5">
      <section className="section-shell p-6 md:p-8">
        <p className="eyebrow">Voice workflow</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Trucklexa | Alexa skill for load booking
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          A voice-first broker assistant that compresses a multi-screen booking workflow into a spoken request, then
          hands the result back through Alexa and downstream operational systems.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {stack.map((item) => (
            <span key={item} className="pill">
              {item}
            </span>
          ))}
        </div>
      </section>

      <section className="grid items-start gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="section-shell p-6 md:p-8">
          <p className="eyebrow">Flow</p>
          <div className="mt-6 grid gap-4">
            {flow.map((item) => (
              <article key={item.title} className="card p-5">
                <h2 className="text-lg font-semibold text-slate-950">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <p className="eyebrow">Why it matters</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              {highlights.map((item) => (
                <li key={item} className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-6">
            <p className="eyebrow">Positioning</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This project sits at the intersection of conversational interfaces and operational BI. It is less about the
              device itself and more about reducing friction in a workflow that operators repeat constantly.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
