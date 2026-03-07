import { pool } from "../../../database/db";

export async function createPurchaseRow(data:any){

  const { rows } = await pool.query(

  `
  INSERT INTO credit_card_purchase
  (transaction_id,total_amount,installments,installment_amount,first_installment_date,card_account_id,status)

  VALUES ($1,$2,$3,$4,$5,$6,'ACTIVE')

  RETURNING *
  `,
  [

    data.transaction_id ?? null,
    data.total_amount,
    data.installments,
    data.installment_amount,
    data.first_installment_date,
    data.card_account_id

  ])

  return rows[0]

}

export async function listPurchases(){

  const { rows } = await pool.query(

  `
  SELECT 

    p.*,
    a.name as card_name,
    a.last4 as card_last4,

    COUNT(i.id) as total_installments,
    COUNT(i.id) FILTER (WHERE i.status='PAID') as paid_installments

  FROM credit_card_purchase p

  JOIN account a
  ON a.id = p.card_account_id

  LEFT JOIN installment i
  ON i.purchase_id = p.id

  GROUP BY p.id,a.name,a.last4

  ORDER BY p.created_at DESC
  `
  )

  return rows

}