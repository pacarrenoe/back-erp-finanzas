import { pool } from "../../../database/db";

export async function findPeriodByDate(date: string) {
  const { rows } = await pool.query(
    `
    SELECT * FROM period
    WHERE $1 BETWEEN start_date AND end_date
    ORDER BY start_date DESC
    LIMIT 1
    `,
    [date]
  );

  return rows[0] ?? null;
}

export async function createTransaction(data: any) {
  const { rows } = await pool.query(
    `
    INSERT INTO transaction
    (date, description, amount, direction, account_id, category_id, period_id, payment_method, merchant)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
    `,
    [
      data.date,
      data.description ?? null,
      data.amount,
      data.direction,
      data.account_id,
      data.category_id,
      data.period_id ?? null,
      data.payment_method,
      data.merchant ?? null,
    ]
  );

  return rows[0];
}

export async function listTransactions(periodId?: string) {
  const { rows } = await pool.query(
    `
    SELECT t.*, a.name as account_name, c.name as category_name
    FROM transaction t
    JOIN account a ON a.id = t.account_id
    JOIN category c ON c.id = t.category_id
    ${periodId ? `WHERE t.period_id = $1` : ""}
    ORDER BY date DESC
    `,
    periodId ? [periodId] : []
  );

  return rows;
}

export async function findTransactionById(id: string) {
  const { rows } = await pool.query(
    `
    SELECT t.*, a.name as account_name, c.name as category_name
    FROM transaction t
    JOIN account a ON a.id = t.account_id
    JOIN category c ON c.id = t.category_id
    WHERE t.id = $1
    `,
    [id]
  );

  return rows[0] ?? null;
}

export async function updateTransaction(id: string, data: any) {
  const { rows } = await pool.query(
    `
    UPDATE transaction
    SET
      date = COALESCE($1, date),
      description = COALESCE($2, description),
      amount = COALESCE($3, amount),
      direction = COALESCE($4, direction),
      account_id = COALESCE($5, account_id),
      category_id = COALESCE($6, category_id),
      payment_method = COALESCE($7, payment_method),
      merchant = COALESCE($8, merchant)
    WHERE id = $9
    RETURNING *
    `,
    [
      data.date ?? null,
      data.description ?? null,
      data.amount ?? null,
      data.direction ?? null,
      data.account_id ?? null,
      data.category_id ?? null,
      data.payment_method ?? null,
      data.merchant ?? null,
      id,
    ]
  );

  return rows[0];
}

export async function deleteTransaction(id: string) {
  await pool.query(
    `
    DELETE FROM transaction
    WHERE id = $1
    `,
    [id]
  );
}