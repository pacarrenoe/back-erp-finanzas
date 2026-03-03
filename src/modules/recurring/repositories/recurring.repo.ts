import { pool } from "../../../database/db";

export async function createRecurring(data: any) {
  const { rows } = await pool.query(
    `
    INSERT INTO recurring_commitment
    (name, amount, category_id, account_id, frequency, start_date, end_date, active)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *
    `,
    [
      data.name,
      data.amount,
      data.category_id,
      data.account_id,
      data.frequency,
      data.start_date,
      data.end_date ?? null,
      data.active ?? true
    ]
  );

  return rows[0];
}

export async function listRecurring() {
  const { rows } = await pool.query(
    `
    SELECT r.*, c.name as category_name, a.name as account_name
    FROM recurring_commitment r
    JOIN category c ON c.id = r.category_id
    JOIN account a ON a.id = r.account_id
    ORDER BY r.created_at DESC
    `
  );
  return rows;
}