import { pool } from "../../../database/db";

export async function getPeriodById(id: string) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM period
    WHERE id = $1
    LIMIT 1
    `,
    [id]
  );

  return rows[0] ?? null;
}

export async function getLastPeriod() {
  const { rows } = await pool.query(`
    SELECT *
    FROM period
    ORDER BY start_date DESC
    LIMIT 1
  `);

  return rows[0] ?? null;
}

export async function getFuturePeriodsFrom(startDate: string, limit: number) {
  const { rows } = await pool.query(
    `
    SELECT *
    FROM period
    WHERE start_date >= $1
    ORDER BY start_date ASC
    LIMIT $2
    `,
    [startDate, limit]
  );

  return rows;
}

export async function getInstallmentsFuture(fromDate: string) {
  const { rows } = await pool.query(
    `
    SELECT due_date, amount, status
    FROM installment
    WHERE status = 'PENDING'
      AND due_date >= $1
    ORDER BY due_date ASC
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

export async function getDebtFuture(fromDate: string) {
  const { rows } = await pool.query(
    `
    SELECT
      d.direction,
      s.due_date,
      s.amount,
      s.status
    FROM debt_payment_schedule s
    JOIN debt d ON d.id = s.debt_id
    WHERE s.status = 'PENDING'
      AND s.due_date >= $1
    ORDER BY s.due_date ASC
    `,
    [fromDate]
  );

  return rows;
}