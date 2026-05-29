'use client'

import { useMemo } from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts'

type Row = Record<string, any>

function isNumeric(v: any) {
  if (v === null || v === undefined) return false
  const n = Number(v)
  return Number.isFinite(n)
}

const COLORS = ['#2563eb', '#14b8a6', '#7c3aed']

export default function ResultChart({
  rows,
  prefer = 'bar',
  maxPoints = 20
}: {
  rows: Row[]
  prefer?: 'bar' | 'line'
  maxPoints?: number
}) {
  const { dimKey, metKeys, data } = useMemo(() => {
    if (!rows?.length) return { dimKey: null, metKeys: [] as string[], data: [] as Row[] }

    const sample = rows[0]
    const keys = Object.keys(sample)

    const stringKeys = keys.filter((k) => typeof sample[k] === 'string' || sample[k] instanceof Date)
    const numericKeys = keys.filter((k) => isNumeric(sample[k]))

    const dimKey = stringKeys[0] ?? keys[0]
    const metKeys = numericKeys.length ? numericKeys.slice(0, 3) : []
    const data = rows.slice(0, maxPoints)

    return { dimKey, metKeys, data }
  }, [rows, maxPoints])

  if (!rows?.length) return null

  if (!dimKey || !metKeys.length) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        Not enough structured data to chart. The result set needs one text or date column and at least one numeric column.
      </div>
    )
  }

  const Chart = prefer === 'line' ? LineChart : BarChart

  return (
    <div className="h-80 w-full rounded-lg border border-slate-200 bg-white p-4">
      <ResponsiveContainer>
        <Chart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey={dimKey} tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 18px 40px rgba(15, 23, 42, 0.08)'
            }}
          />
          <Legend />
          {metKeys.map((k, idx) =>
            prefer === 'line' ? (
              <Line
                key={k}
                dataKey={k}
                type="monotone"
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            ) : (
              <Bar key={k} dataKey={k} fill={COLORS[idx % COLORS.length]} radius={[8, 8, 0, 0]} barSize={28} />
            )
          )}
        </Chart>
      </ResponsiveContainer>
    </div>
  )
}
