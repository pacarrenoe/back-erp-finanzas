import { pool } from "../database/db";

export async function findPeriodByDate(date: string) {
  const { rows } = await pool.query(
    `
    SELECT id
    FROM period
    WHERE $1::date BETWEEN start_date AND COALESCE(end_date, (start_date + INTERVAL '30 day')::date)
    ORDER BY start_date DESC
    LIMIT 1
    `,
    [date]
  );

  return rows[0]?.id ?? null;
}