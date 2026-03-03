import { pool } from "../../../database/db";

export async function listPeriods() {
  const { rows } = await pool.query(
    `SELECT * FROM period ORDER BY start_date DESC`
  );
  return rows;
}

export async function createPeriod(data: any) {
  const { rows } = await pool.query(
    `
    INSERT INTO period
    (start_date, end_date, salary_pay_date, base_salary_amount, days_worked, pluxee_per_day, pluxee_amount, notes)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
    `,
    [
      data.start_date,
      data.end_date,
      data.salary_pay_date,
      data.base_salary_amount,
      data.days_worked ?? null,
      data.pluxee_per_day ?? null,
      data.pluxee_amount ?? null,
      data.notes ?? null,
    ]
  );

  return rows[0];
}