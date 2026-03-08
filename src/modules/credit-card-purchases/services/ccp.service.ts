import { CreatePurchaseInput } from "../dtos/ccp.schema";
import * as repo from "../repositories/ccp.repo";
import * as instRepo from "../../installments/repositories/installment.repo";
import { findPeriodByDate } from "../../../shared/periodFinder";
import { pool } from "../../../database/db";

function addMonths(isoDate: string, months: number) {

    const d = new Date(isoDate + "T00:00:00")

    d.setMonth(d.getMonth() + months)

    return d.toISOString().slice(0, 10)

}

export async function create(input: CreatePurchaseInput) {

    const base = Math.floor(input.total_amount / input.installments)

    const remainder = input.total_amount - base * input.installments

    const purchase = await repo.createPurchaseRow({

        ...input,
        installment_amount: base

    })

    const installmentsToCreate = []

    for (let i = 0; i < input.installments; i++) {

        const due = addMonths(input.first_installment_date, i)

        const periodId = await findPeriodByDate(due)

        const amount = i === 0 ? base + remainder : base

        installmentsToCreate.push({

            due_date: due,
            amount,
            period_id: periodId

        })

    }

    const createdInstallments = await instRepo.bulkCreateInstallments(

        purchase.id,
        installmentsToCreate

    )

    return {

        purchase,
        installments: createdInstallments

    }

}

export async function list() {

    return repo.listPurchases()

}

export async function remove(id: string) {

    await repo.deletePurchase(id)

}



export async function currentInstallments() {

    const { rows } = await pool.query(

        `
SELECT 

i.*,
p.description,
a.name as card_name

FROM installment i

JOIN credit_card_purchase p
ON p.id = i.purchase_id

JOIN account a
ON a.id = p.card_account_id

WHERE i.period_id = (
SELECT id
FROM period
ORDER BY start_date DESC
LIMIT 1
)

AND i.status='PENDING'
`

    )

    return rows

}

export async function summary(){

const { rows } = await pool.query(

`
SELECT 

SUM(amount) FILTER (WHERE status='PENDING') as pending_amount,

SUM(amount) FILTER (WHERE status='PAID') as paid_amount,

COUNT(*) FILTER (WHERE status='PENDING') as pending_installments

FROM installment
`

)

return rows[0]

}