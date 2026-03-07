import { pool } from "../../../database/db";

export async function createRecurring(data: any) {

  const { rows } = await pool.query(
    `
    INSERT INTO recurring_commitment
    (name,amount,category_id,account_id,frequency,start_date,end_date,active)
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
    SELECT 
      r.*,
      c.name as category_name,
      a.name as account_name
    FROM recurring_commitment r
    JOIN category c ON c.id = r.category_id
    JOIN account a ON a.id = r.account_id
    ORDER BY r.created_at DESC
    `
  );

  return rows;

}

export async function updateRecurring(id: string, data: any) {

  const { rows } = await pool.query(
    `
    UPDATE recurring_commitment
    SET
      name = COALESCE($2,name),
      amount = COALESCE($3,amount),
      category_id = COALESCE($4,category_id),
      account_id = COALESCE($5,account_id),
      frequency = COALESCE($6,frequency),
      start_date = COALESCE($7,start_date),
      end_date = COALESCE($8,end_date),
      active = COALESCE($9,active)
    WHERE id=$1
    RETURNING *
    `,
    [
      id,
      data.name ?? null,
      data.amount ?? null,
      data.category_id ?? null,
      data.account_id ?? null,
      data.frequency ?? null,
      data.start_date ?? null,
      data.end_date ?? null,
      data.active ?? null
    ]
  );

  return rows[0];

}

export async function toggleRecurring(id: string) {

  const { rows } = await pool.query(
    `
    UPDATE recurring_commitment
    SET active = NOT active
    WHERE id=$1
    RETURNING *
    `,
    [id]
  );

  return rows[0];

}

export async function deleteRecurring(id: string) {

  await pool.query(
    `DELETE FROM recurring_commitment WHERE id=$1`,
    [id]
  );

}