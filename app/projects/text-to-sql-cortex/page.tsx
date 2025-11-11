"use client";

import { useState } from "react";
import ResultChart from "@/components/ResultChart";

type Row = Record<string, any>;

export default function TextToSQLCortexPage() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedSQL, setGeneratedSQL] = useState("");
  const [executedSQL, setExecutedSQL] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mock, setMock] = useState(false);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRows([]);
    setGeneratedSQL("");
    setExecutedSQL("");
    setMock(false);

    try {
      const res = await fetch("/api/text-to-sql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queryText: q }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Unknown error");
      } else {
        setGeneratedSQL(data.generated_sql || data.generatedSQL || "");
        setExecutedSQL(data.executed_sql || data.executedSQL || "");
        setRows(Array.isArray(data.rows) ? data.rows : []);
        setMock(Boolean(data.mock));
      }
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  const hasRows = rows && rows.length > 0;
  const columns = hasRows ? Object.keys(rows[0]) : [];

  return (
    <div className="mx-auto max-w-3xl py-12">
      <h1 className="text-3xl font-bold mb-2">Text → SQL (Snowflake + Cortex)</h1>
      <p className="text-gray-600 mb-6">
        Ask a question about the <code>MENU</code> table from Tasty Bytes.
      </p>

      <form onSubmit={run} className="flex gap-2 mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g., top 10 most expensive menu items (name, brand, price)"
          className="flex-1 border rounded-lg p-3"
        />
        <button
          disabled={loading || !q.trim()}
          className="px-4 py-3 rounded-lg bg-black text-white disabled:opacity-50"
        >
          {loading ? "Running..." : "Run"}
        </button>
      </form>

      {mock && (
        <div className="mb-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900">
          Mock mode (no Snowflake env vars).
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-red-800">
          {error}
        </div>
      )}

      {generatedSQL && (
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-1">Generated SQL</div>
          <pre className="bg-gray-100 p-3 rounded overflow-auto whitespace-pre-wrap">
            {generatedSQL}
          </pre>
        </div>
      )}

      {executedSQL && executedSQL !== generatedSQL && (
        <div className="mb-4">
          <div className="text-sm font-semibold text-gray-700 mb-1">Executed SQL (safe)</div>
          <pre className="bg-gray-100 p-3 rounded overflow-auto whitespace-pre-wrap">
            {executedSQL}
          </pre>
        </div>
      )}

      {hasRows && (
        <>
          <div className="mt-6 overflow-auto">
            <table className="min-w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((c) => (
                    <th key={c} className="text-left px-3 py-2 border-b border-gray-200">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="odd:bg-white even:bg-gray-50">
                    {columns.map((c) => (
                      <td key={c} className="px-3 py-2 border-b border-gray-100">
                        {String(r[c])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Quick Visualization</h3>
            <ResultChart rows={rows} prefer="bar" />
          </div>
        </>
      )}
    </div>
  );
}
