import snowflake from "snowflake-sdk";

/** open a connection using .env vars */
export async function getConnection(): Promise<snowflake.Connection> {
  const connection = snowflake.createConnection({
    account: process.env.SNOWFLAKE_ACCOUNT!,
    username: process.env.SNOWFLAKE_USER!,
    password: process.env.SNOWFLAKE_PASSWORD!,
    warehouse: process.env.SNOWFLAKE_WAREHOUSE!,
    database: process.env.SNOWFLAKE_DATABASE!,
    schema: process.env.SNOWFLAKE_SCHEMA!,
  });

  await new Promise<void>((resolve, reject) => {
    connection.connect((err) => (err ? reject(err) : resolve()));
  });

  return connection;
}

/** run a query or stored procedure */
export async function exec(
  conn: snowflake.Connection,
  sqlText: string,
  binds?: any[]
): Promise<any[]> {
  return new Promise<any[]>((resolve, reject) => {
    conn.execute({
      sqlText,
      binds,
      complete: (err, _stmt, rows) => (err ? reject(err) : resolve(rows || [])),
    });
  });
}
