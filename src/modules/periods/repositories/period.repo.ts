import { pool } from "../../../database/db"

export async function listPeriods() {

  const { rows } = await pool.query(

    `
SELECT *
FROM period
ORDER BY start_date DESC
`

  )

  return rows

}

export async function getCurrentPeriod() {

  const { rows } = await pool.query(

    `
SELECT *
FROM period
ORDER BY start_date DESC
LIMIT 1
`

  )

  return rows[0]

}

export async function closePreviousPeriod(endDate: string) {

  await pool.query(

    `
UPDATE period
SET end_date=$1
WHERE end_date IS NULL
`,
    [endDate]

  )

}

export async function createPeriod(data: any) {

  const { rows } = await pool.query(

    `
INSERT INTO period
(start_date,end_date,salary_pay_date,base_salary_amount,days_worked,pluxee_per_day,pluxee_amount,notes)

VALUES ($1,$2,$3,$4,$5,$6,$7,$8)

RETURNING *
`,
    [
      data.start_date,
      data.end_date,
      data.salary_pay_date,
      data.base_salary_amount,
      data.days_worked ?? null,
      data.pluxee_per_day ?? null,
      data.pluxee_amount ?? null,
      data.notes ?? null
    ]
  )

  return rows[0]

}

export async function updatePeriod(id: string, data: any) {

  const { rows } = await pool.query(

    `
UPDATE period
SET
days_worked=$1,
pluxee_per_day=$2,
pluxee_amount=$3,
notes=$4
WHERE id=$5
RETURNING *
`,
    [
      data.days_worked ?? null,
      data.pluxee_per_day ?? null,
      data.pluxee_amount ?? null,
      data.notes ?? null,
      id
    ]
  )

  return rows[0]

}

export async function deletePeriod(id: string) {

  await pool.query(

    `
DELETE FROM period
WHERE id=$1
`,
    [id]
  )

} 