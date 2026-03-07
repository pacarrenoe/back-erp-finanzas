import { pool } from "../../../database/db";

export async function createDebt(data: any) {

  const { rows } = await pool.query(
    `
    INSERT INTO debt
    (direction,counterparty_name,description,principal_amount)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [
      data.direction,
      data.counterparty_name,
      data.description ?? null,
      data.principal_amount
    ]
  );

  return rows[0];
}



export async function getDebtById(id: string) {

  const { rows } = await pool.query(
    `SELECT * FROM debt WHERE id=$1`,
    [id]
  );

  return rows[0];
}



export async function updateDebt(id: string,data: any) {

  const { rows } = await pool.query(
    `
    UPDATE debt
    SET
      counterparty_name=COALESCE($2,counterparty_name),
      description=COALESCE($3,description),
      principal_amount=COALESCE($4,principal_amount)
    WHERE id=$1
    RETURNING *
    `,
    [
      id,
      data.counterparty_name ?? null,
      data.description ?? null,
      data.principal_amount ?? null
    ]
  );

  return rows[0];
}



export async function deleteDebt(id: string) {

  await pool.query(
    `DELETE FROM debt WHERE id=$1`,
    [id]
  );

  return true;
}



export async function createSchedule(
  debtId: string,
  schedule: any[]
) {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    for (const s of schedule) {

      await client.query(
        `
        INSERT INTO debt_payment_schedule
        (debt_id,due_date,amount)
        VALUES ($1,$2,$3)
        `,
        [
          debtId,
          s.due_date,
          s.amount
        ]
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



export async function getSchedule(debtId: string) {

  const { rows } = await pool.query(
    `
    SELECT *
    FROM debt_payment_schedule
    WHERE debt_id=$1
    ORDER BY due_date
    `,
    [debtId]
  );

  return rows;
}



export async function getScheduleById(id: string) {

  const { rows } = await pool.query(
    `
    SELECT
      s.*,
      d.description,
      d.counterparty_name,
      d.direction
    FROM debt_payment_schedule s
    JOIN debt d
      ON d.id=s.debt_id
    WHERE s.id=$1
    `,
    [id]
  );

  return rows[0];
}



export async function createTransaction(
  client:any,
  data:any
) {

  const { rows } = await client.query(
    `
    INSERT INTO transaction
    (
      date,
      description,
      amount,
      direction,
      account_id,
      category_id,
      payment_method
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [
      data.date,
      data.description ?? null,
      data.amount,
      data.direction,
      data.account_id,
      data.category_id,
      data.payment_method
    ]
  );

  return rows[0];
}



export async function markSchedulePaid(
  client:any,
  scheduleId:string,
  transactionId:string
) {

  const { rows } = await client.query(
    `
    UPDATE debt_payment_schedule
    SET
      status='PAID',
      paid_transaction_id=$2
    WHERE id=$1
    RETURNING *
    `,
    [
      scheduleId,
      transactionId
    ]
  );

  return rows[0];
}



export async function getAllDebts() {

  const { rows } = await pool.query(
    `
    SELECT
      d.*,

      COUNT(s.id)
      FILTER (WHERE s.status='PAID')
      AS paid_installments,

      COUNT(s.id)
      AS total_installments,

      COALESCE(
        d.principal_amount -
        SUM(
          CASE
            WHEN s.status='PAID'
            THEN s.amount
            ELSE 0
          END
        ),
        d.principal_amount
      )
      AS pending_amount

    FROM debt d

    LEFT JOIN debt_payment_schedule s
      ON s.debt_id=d.id

    GROUP BY d.id

    ORDER BY
      d.counterparty_name,
      d.created_at DESC
    `
  );

  return rows;
}