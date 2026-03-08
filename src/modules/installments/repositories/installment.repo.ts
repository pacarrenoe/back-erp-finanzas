import { pool } from "../../../database/db";

type BulkInstallmentRow = {
  due_date: string;
  amount: number;
  period_id: string | null;
};

export async function bulkCreateInstallments(
  purchaseId: string,
  rowsToInsert: BulkInstallmentRow[]
) {
  if (rowsToInsert.length === 0) return [];

  const values: any[] = [];
  const placeholders = rowsToInsert.map((r, i) => {
    const base = i * 4;
    values.push(purchaseId, r.period_id, r.due_date, r.amount);
    return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4})`;
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
    SELECT
      i.*,
      p.card_account_id,
      p.description,
      p.status as purchase_status,
      a.name as card_name,
      a.last4 as card_last4
    FROM installment i
    JOIN credit_card_purchase p ON p.id = i.purchase_id
    JOIN account a ON a.id = p.card_account_id
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY i.due_date ASC
    `,
    values
  );

  return rows;
}

export async function listCurrentPeriodInstallments(periodId: string) {
  const { rows } = await pool.query(
    `
    SELECT
      i.*,
      p.card_account_id,
      p.description,
      p.status as purchase_status,
      a.name as card_name,
      a.last4 as card_last4
    FROM installment i
    JOIN credit_card_purchase p ON p.id = i.purchase_id
    JOIN account a ON a.id = p.card_account_id
    WHERE i.period_id = $1
      AND i.status = 'PENDING'
    ORDER BY i.due_date ASC
    `,
    [periodId]
  );

  return rows;
}

export async function checkPurchaseStatus(purchaseId: string) {
  const { rows } = await pool.query(
    `
    SELECT COUNT(*) FILTER (WHERE status = 'PENDING')::int AS pending_count
    FROM installment
    WHERE purchase_id = $1
    `,
    [purchaseId]
  );

  const pendingCount = Number(rows[0]?.pending_count ?? 0);

  if (pendingCount === 0) {
    await pool.query(
      `
      UPDATE credit_card_purchase
      SET status = 'FINISHED'
      WHERE id = $1
      `,
      [purchaseId]
    );
  }
}

export async function markPaid(id: string, paidTxId?: string) {
  const { rows } = await pool.query(
    `
    UPDATE installment
    SET
      status = 'PAID',
      paid_transaction_id = $2
    WHERE id = $1
    RETURNING *
    `,
    [id, paidTxId ?? null]
  );

  const installment = rows[0] ?? null;

  if (!installment) return null;

  await checkPurchaseStatus(installment.purchase_id);

  return installment;
}

export async function getSummaryByPeriod(periodId: string) {
  const { rows } = await pool.query(
    `
    SELECT
      COALESCE(SUM(CASE WHEN i.status = 'PENDING' THEN i.amount END), 0)::int AS pending_total,
      COALESCE(SUM(CASE WHEN i.status = 'PAID' THEN i.amount END), 0)::int AS paid_total,
      COALESCE(COUNT(*) FILTER (WHERE i.status = 'PENDING'), 0)::int AS pending_count,
      COALESCE(COUNT(*) FILTER (WHERE i.status = 'PAID'), 0)::int AS paid_count
    FROM installment i
    WHERE i.period_id = $1
    `,
    [periodId]
  );

  return rows[0];
}