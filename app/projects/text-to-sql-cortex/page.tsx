"use client"

import { useState } from 'react'
import ResultChart from '@/components/ResultChart'

type Row = Record<string, any>

export default function TextToSQLCortexPage() {
  const liveDemosEnabled = process.env.NEXT_PUBLIC_ENABLE_LIVE_DEMOS === 'true'
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedSQL, setGeneratedSQL] = useState('')
  const [executedSQL, setExecutedSQL] = useState('')
  const [rows, setRows] = useState<Row[]>([])
  const [error, setError] = useState<string | null>(null)
  const [mock, setMock] = useState(false)

  async function run(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setRows([])
    setGeneratedSQL('')
    setExecutedSQL('')
    setMock(false)

    try {
      const res = await fetch('/api/text-to-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryText: q })
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || 'Unknown error')
      } else {
        setGeneratedSQL(data.generated_sql || data.generatedSQL || '')
        setExecutedSQL(data.executed_sql || data.executedSQL || '')
        setRows(Array.isArray(data.rows) ? data.rows : [])
        setMock(Boolean(data.mock))
      }
    } catch (err: any) {
      setError(err.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  const hasRows = rows.length > 0
  const columns = hasRows ? Object.keys(rows[0]) : []

  return (
    <div className="container-max space-y-8 pb-16 pt-6">
      <section className="section-shell p-8 md:p-10">
        <p className="eyebrow">{liveDemosEnabled ? 'Live demo' : 'Case study'}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 md:text-5xl">
          Text to SQL with Snowflake and Cortex
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
          Ask a question about the Tasty Bytes <code className="rounded bg-slate-100 px-2 py-1 text-sm">MENU</code> table.
          The app generates SQL, executes a safe procedure, and returns rows plus a quick chart.
        </p>

        {!liveDemosEnabled ? (
          <div className="mt-6 rounded-lg border border-slate-200 bg-white/80 p-5">
            <p className="eyebrow">Public deployment note</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              The public site shows this project as a case study only. Live query execution is disabled so the website
              does not expose Snowflake or model-backed usage to public traffic.
            </p>
          </div>
        ) : null}
      </section>

      {liveDemosEnabled ? (
        <section className="card p-6 md:p-8">
          <form onSubmit={run} className="space-y-4">
            <label className="block">
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">Question</span>
              <div className="mt-3 flex flex-col gap-3 md:flex-row">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Top 10 most expensive menu items by brand"
                  className="flex-1 rounded-md border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-blue-300"
                />
                <button
                  disabled={loading || !q.trim()}
                  className="rounded-md bg-blue-600 px-6 py-4 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                  {loading ? 'Running...' : 'Run query'}
                </button>
              </div>
            </label>
          </form>

          {mock ? (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Mock mode is active because Snowflake environment variables are not configured.
            </div>
          ) : null}

          {error ? (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
          ) : null}

          {generatedSQL ? (
            <div className="mt-6">
              <p className="eyebrow">Generated SQL</p>
              <pre className="mt-3 overflow-auto rounded-lg border border-slate-200 bg-slate-950 p-5 text-sm text-slate-100">
                {generatedSQL}
              </pre>
            </div>
          ) : null}

          {executedSQL && executedSQL !== generatedSQL ? (
            <div className="mt-6">
              <p className="eyebrow">Executed SQL</p>
              <pre className="mt-3 overflow-auto rounded-lg border border-slate-200 bg-slate-950 p-5 text-sm text-slate-100">
                {executedSQL}
              </pre>
            </div>
          ) : null}

          {hasRows ? (
            <>
              <div className="mt-6 overflow-auto rounded-lg border border-slate-200 bg-white">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      {columns.map((c) => (
                        <th key={c} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rows.map((r, i) => (
                      <tr key={i} className="odd:bg-white even:bg-slate-50/50">
                        {columns.map((c) => (
                          <td key={c} className="px-4 py-3 text-sm text-slate-600">
                            {String(r[c])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8">
                <p className="eyebrow">Quick visualization</p>
                <div className="mt-3">
                  <ResultChart rows={rows} prefer="bar" />
                </div>
              </div>
            </>
          ) : null}
        </section>
      ) : (
        <section className="section-shell p-6 md:p-8">
          <p className="eyebrow">How the workflow works</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <article className="card p-5">
              <h2 className="text-lg font-semibold text-slate-950">Question</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                A user asks a business question in natural language against a constrained Snowflake dataset.
              </p>
            </article>
            <article className="card p-5">
              <h2 className="text-lg font-semibold text-slate-950">Translation</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Cortex Analyst generates vetted SQL, which the app records and passes into a controlled execution path.
              </p>
            </article>
            <article className="card p-5">
              <h2 className="text-lg font-semibold text-slate-950">Output</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                The response includes generated SQL, executed SQL when applicable, returned rows, and a lightweight chart.
              </p>
            </article>
          </div>
        </section>
      )}
    </div>
  )
}
