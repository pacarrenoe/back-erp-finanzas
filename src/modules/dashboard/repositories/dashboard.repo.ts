import { pool } from "../../../database/db";

export type PeriodRow = {
  id: string;
  start_date: string;
  end_date: string | null;
  salary_pay_date: string;
  base_salary_amount: number;
  pluxee_amount: number | null;
};

export async function getCurrentPeriod(): Promise<PeriodRow | null> {
  // "actual" = hoy entre start/end, si no existe, usa el último por start_date
  const { rows } = await pool.query(
    `
    WITH current_p AS (
      SELECT *
      FROM period
      WHERE CURRENT_DATE BETWEEN start_date AND COALESCE(end_date, start_date + INTERVAL '30 day')
      ORDER BY start_date DESC
      LIMIT 1
    )
    SELECT * FROM current_p
    UNION ALL
    SELECT *
    FROM period
    WHERE NOT EXISTS (SELECT 1 FROM current_p)
    ORDER BY start_date DESC
    LIMIT 1;
    `
  );
  return rows[0] ?? null;
}

export async function getPeriodById(id: string): Promise<PeriodRow | null> {
  const { rows } = await pool.query(`SELECT * FROM period WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export async function getPeriodKpis(periodId: string) {
  const { rows } = await pool.query(
    `
    SELECT
      $1::uuid as period_id,

      COALESCE(SUM(CASE WHEN t.direction = 'IN'  AND c.kind = 'INCOME'  THEN t.amount END), 0) AS income_total,
      COALESCE(SUM(CASE WHEN t.direction = 'OUT' AND c.kind = 'EXPENSE' THEN t.amount END), 0) AS expense_total,

      COALESCE(SUM(CASE WHEN t.direction = 'IN'  AND c.kind = 'INCOME'  THEN t.amount END), 0)
      -
      COALESCE(SUM(CASE WHEN t.direction = 'OUT' AND c.kind = 'EXPENSE' THEN t.amount END), 0)
      AS net_total

    FROM transaction t
    JOIN category c ON c.id = t.category_id
    WHERE t.period_id = $1
      AND c.kind <> 'TRANSFER'
    `,
    [periodId]
  );

  return rows[0];
}

export async function getBreakdownByCategory(periodId: string) {
  const { rows } = await pool.query(
    `
    SELECT
      c.kind,
      c.name,
      SUM(t.amount)::int AS total
    FROM transaction t
    JOIN category c ON c.id = t.category_id
    WHERE t.period_id = $1
      AND c.kind IN ('INCOME','EXPENSE')
    GROUP BY c.kind, c.name
    ORDER BY c.kind ASC, total DESC;
    `,
    [periodId]
  );
  return rows;
}

export async function getBreakdownByAccount(periodId: string) {
  const { rows } = await pool.query(
    `
    SELECT
      a.name,
      a.type,
      SUM(CASE WHEN t.direction='OUT' THEN t.amount ELSE 0 END)::int AS out_total,
      SUM(CASE WHEN t.direction='IN'  THEN t.amount ELSE 0 END)::int AS in_total
    FROM transaction t
    JOIN account a ON a.id = t.account_id
    JOIN category c ON c.id = t.category_id
    WHERE t.period_id = $1
      AND c.kind <> 'TRANSFER'
    GROUP BY a.name, a.type
    ORDER BY (SUM(CASE WHEN t.direction='OUT' THEN t.amount ELSE 0 END)) DESC;
    `,
    [periodId]
  );
  return rows;
}

export async function getPeriodsTrend(n = 6) {
  const { rows } = await pool.query(
    `
    WITH last_periods AS (
      SELECT id, start_date, end_date
      FROM period
      ORDER BY start_date DESC
      LIMIT $1
    )
    SELECT
      p.id,
      p.start_date,
      p.end_date,

      COALESCE(SUM(CASE WHEN t.direction = 'IN'  AND c.kind='INCOME'  THEN t.amount END), 0)::int AS income_total,
      COALESCE(SUM(CASE WHEN t.direction = 'OUT' AND c.kind='EXPENSE' THEN t.amount END), 0)::int AS expense_total

    FROM last_periods p
    LEFT JOIN transaction t ON t.period_id = p.id
    LEFT JOIN category c ON c.id = t.category_id
    GROUP BY p.id, p.start_date, p.end_date
    ORDER BY p.start_date ASC;
    `,
    [n]
  );

  return rows;
}