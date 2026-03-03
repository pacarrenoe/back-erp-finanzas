import { pool } from "../../../database/db";

export async function createDebt(data: any) {
  const { rows } = await pool.query(
    `
    INSERT INTO debt (direction, counterparty_name, description, principal_amount)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [
      data.direction,
      data.counterparty_name,
      data.description ?? null,
      data.principal_amount,
    ]
  );
  return rows[0];
}

export async function createSchedule(debtId: string, schedule: any[]) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const s of schedule) {
      await client.query(
        `
        INSERT INTO debt_payment_schedule (debt_id, due_date, amount)
        VALUES ($1,$2,$3)
        `,
        [debtId, s.due_date, s.amount]
      );
    }

    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

export async function getAllDebts() {
  const { rows } = await pool.query(`SELECT * FROM debt ORDER BY created_at DESC`);
  return rows;
}

export async function getScheduleByPeriod(start: string, end: string) {
  const { rows } = await pool.query(
    `
    SELECT d.direction, s.*
    FROM debt_payment_schedule s
    JOIN debt d ON d.id = s.debt_id
    WHERE s.status = 'PENDING'
      AND s.due_date BETWEEN $1 AND $2
    `,
    [start, end]
  );
  return rows;
}

export async function markPaid(id: string) {
  const { rows } = await pool.query(
    `
    UPDATE debt_payment_schedule
    SET status='PAID'
    WHERE id=$1
    RETURNING *
    `,
    [id]
  );
  return rows[0];
}