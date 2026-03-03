import { pool } from "../../../database/db";

export async function createRule(data: any) {
  const { rows } = await pool.query(
    `
    INSERT INTO budget_rule (category_id, limit_amount, alert_threshold_pct)
    VALUES ($1,$2,$3)
    RETURNING *
    `,
    [
      data.category_id,
      data.limit_amount,
      data.alert_threshold_pct ?? 80,
    ]
  );
  return rows[0];
}

export async function getActiveRules() {
  const { rows } = await pool.query(
    `
    SELECT br.*, c.name AS category_name
    FROM budget_rule br
    JOIN category c ON c.id = br.category_id
    WHERE br.active = true
    `
  );
  return rows;
}