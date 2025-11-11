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
      <div className="rounded-lg border p-3 text-sm text-gray-600">
        Not enough structured data to chart (need one text/date column and one numeric column).
      </div>
    )
  }

  const Chart = prefer === 'line' ? LineChart : BarChart
  const Series = prefer === 'line' ? Line : Bar

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <Chart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={dimKey} tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          {metKeys.map((k) => (
            <Series
              key={k}
              dataKey={k}
              type={prefer === 'line' ? 'monotone' : undefined}
              barSize={prefer === 'bar' ? 28 : undefined}
            />
          ))}
        </Chart>
      </ResponsiveContainer>
    </div>
  )
}
