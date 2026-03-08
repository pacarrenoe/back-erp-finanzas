import * as repo from "../repositories/debt.repo";
import { pool } from "../../../database/db";

function addMonths(date: Date,months: number) {

  const d = new Date(date);
  d.setMonth(d.getMonth()+months);
  return d;

}



export async function getAll() {

  return repo.getAllDebts();

}



export async function getById(id: string) {

  return repo.getDebtById(id);

}



export async function update(id: string,data: any) {

  return repo.updateDebt(id,data);

}



export async function remove(id: string) {

  return repo.deleteDebt(id);

}



export async function createDebt(data: any) {

  const debt = await repo.createDebt(data);

  const installmentAmount =
    Math.round(data.principal_amount/data.installments);

  const schedule = [];

  for (let i=0;i<data.installments;i++) {

    const due =
      addMonths(new Date(data.first_due_date),i);

    schedule.push({

      due_date:
        due.toISOString().split("T")[0],

      amount:
        installmentAmount

    });

  }

  await repo.createSchedule(debt.id,schedule);

  return debt;

}



export async function getSchedule(debtId: string) {

  return repo.getSchedule(debtId);

}



export async function markPaid(
  scheduleId:string,
  accountId:string,
  paymentMethod:string
) {

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    const schedule =
      await repo.getScheduleById(scheduleId);

    if (!schedule) {

      throw new Error("Schedule not found");

    }

    if (schedule.status==="PAID") {

      throw new Error("Schedule already paid");

    }



    const description =
      schedule.description
        ? `Pago deuda ${schedule.description}`
        : `Pago deuda ${schedule.counterparty_name}`;



    const direction =
      schedule.direction==="I_OWE"
        ? "OUT"
        : "IN";



    const transaction =
      await repo.createTransaction(client,{

        date:
          new Date().toISOString().split("T")[0],

        description,

        amount:
          schedule.amount,

        direction,

        account_id:
          accountId,

        category_id:
          process.env.DEBT_CATEGORY_ID,

        payment_method:
          paymentMethod

      });



    const updated =
      await repo.markSchedulePaid(
        client,
        scheduleId,
        transaction.id
      );



    await client.query("COMMIT");

    return updated;

  }

  catch (e) {

    await client.query("ROLLBACK");
    throw e;

  }

  finally {

    client.release();

  }

}


export async function createSchedule(
  debtId: string,
  installments: number,
  firstDueDate: string,
  total: number
) {

  const installmentAmount =
    Math.round(total / installments);

  const schedule = [];

  for (let i = 0; i < installments; i++) {

    const due =
      addMonths(new Date(firstDueDate), i);

    schedule.push({

      due_date:
        due.toISOString().split("T")[0],

      amount:
        installmentAmount

    });

  }

  await repo.createSchedule(debtId, schedule);

}