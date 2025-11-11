// app/api/text-to-sql/route.ts
export const runtime = "nodejs"; // ensure Node runtime (not Edge)
export const dynamic = "force-dynamic"; // avoid static optimization for API

import { NextResponse } from "next/server";
import { getConnection, exec } from "@/lib/snowflake";

export async function POST(req: Request) {
  try {
    const { queryText } = await req.json();

    if (!queryText || typeof queryText !== "string") {
      return NextResponse.json({ error: "queryText is required" }, { status: 400 });
    }

    if (!process.env.SNOWFLAKE_ACCOUNT) {
      return NextResponse.json({
        generated_sql:
          "SELECT MENU_ITEM_NAME, TRUCK_BRAND_NAME, SALE_PRICE_USD FROM MENU ORDER BY SALE_PRICE_USD DESC LIMIT 10",
        executed_sql:
          "SELECT MENU_ITEM_NAME, TRUCK_BRAND_NAME, SALE_PRICE_USD FROM MENU ORDER BY SALE_PRICE_USD DESC LIMIT 10",
        rows: [
          { MENU_ITEM_NAME: "Example Dish", TRUCK_BRAND_NAME: "Demo Truck", SALE_PRICE_USD: 12.5 },
        ],
        mock: true,
      });
    }

    const conn = await getConnection();
    const rows = await exec(conn, "CALL TEXT_TO_SQL_MENU(?)", [queryText]);

    const firstRow = rows?.[0] ?? {};

    const payload =
      firstRow.TEXT_TO_SQL_MENU ||
      firstRow.COLUMN1 ||
      firstRow["TEXT_TO_SQL_MENU(PROMPT STRING)"] ||
      firstRow;

    return NextResponse.json(payload);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}
