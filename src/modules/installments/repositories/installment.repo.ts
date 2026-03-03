import { pool } from "../../../database/db";

export async function bulkCreateInstallments(purchaseId: string, rowsToInsert: Array<{due_date:string, amount:number, period_id:string|null}>) {
  if (rowsToInsert.length === 0) return [];

  const values: any[] = [];
  const placeholders = rowsToInsert.map((r, i) => {
    const base = i * 4;
    values.push(purchaseId, r.period_id, r.due_date, r.amount);
    return `($${base+1}, $${base+2}, $${base+3}, $${base+4})`;
  });

  const { rows } = await pool.query(
    `
    INSERT INTO installment (purchase_id, period_id, due_date, amount)
    VALUES ${placeholders.join(",")}
    RETURNING *
    `,
    values
  );

  return rows;
}

export async function listInstallments(filter?: { periodId?: string; status?: string }) {
  const where: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (filter?.periodId) {
    where.push(`i.period_id = $${idx++}`);
    values.push(filter.periodId);
  }
  if (filter?.status) {
    where.push(`i.status = $${idx++}`);
    values.push(filter.status);
  }

  const { rows } = await pool.query(
    `
    SELECT i.*, p.card_account_id
    FROM installment i
    JOIN credit_card_purchase p ON p.id = i.purchase_id
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY i.due_date ASC
    `,
    values
  );

  return rows;
}

export async function markPaid(id: string, paidTxId?: string) {
  const { rows } = await pool.query(
    `
    UPDATE installment
    SET status = 'PAID',
        paid_transaction_id = $2
    WHERE id = $1
    RETURNING *
    `,
    [id, paidTxId ?? null]
  );
  return rows[0] ?? null;
}