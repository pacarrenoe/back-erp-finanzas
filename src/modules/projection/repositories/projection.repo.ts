import { pool } from "../../../database/db";

export async function getLastPeriod() {
  const { rows } = await pool.query(`
    SELECT *
    FROM period
    ORDER BY start_date DESC
    LIMIT 1
  `);
  return rows[0] ?? null;
}

export async function getInstallmentsFuture(fromDate: string) {
  const { rows } = await pool.query(
    `
    SELECT due_date, amount
    FROM installment
    WHERE status = 'PENDING'
      AND due_date >= $1
    `,
    [fromDate]
  );
  return rows;
}

export async function getRecurringAll() {
  const { rows } = await pool.query(`
    SELECT *
    FROM recurring_commitment
    WHERE active = true
  `);
  return rows;
}