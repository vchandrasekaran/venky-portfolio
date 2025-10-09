export async function runSnowflakeQuery(sql: string, params?: Record<string, any>) {
  // TODO: implement server-side route to run read-only parameterized queries.
  return { rows: [], tookMs: 0 };
}

