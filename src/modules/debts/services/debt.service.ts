import * as repo from "../repositories/debt.repo";

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export async function getAll() {
  return repo.getAllDebts();
}

export async function getById(id: string) {
  return repo.getDebtById(id);
}

export async function update(id: string, data: any) {
  return repo.updateDebt(id, data);
}

export async function remove(id: string) {
  return repo.deleteDebt(id);
}

export async function createSchedule(
  debtId: string,
  installments: number,
  firstDue: string,
  total: number
) {
  const amountPerInstallment = Math.round(total / installments);

  const schedule = [];

  for (let i = 0; i < installments; i++) {
    const due = addMonths(new Date(firstDue), i);

    schedule.push({
      due_date: due.toISOString().split("T")[0],
      amount: amountPerInstallment,
    });
  }

  await repo.createSchedule(debtId, schedule);
}

export async function getSchedule(debtId: string) {
  return repo.getSchedule(debtId);
}

export async function createDebt(data: any) {
  const debt = await repo.createDebt(data);

  const installmentAmount =
    Math.round(data.principal_amount / data.installments);

  const schedule = [];

  for (let i = 0; i < data.installments; i++) {
    const due = addMonths(new Date(data.first_due_date), i);

    schedule.push({
      due_date: due.toISOString().split("T")[0],
      amount: installmentAmount,
    });
  }

  await repo.createSchedule(debt.id, schedule);

  return debt;
}

export async function markPaid(
  scheduleId: string,
  accountId: string,
  paymentMethod: string
) {
  const schedule = await repo.getScheduleById(scheduleId);

  if (!schedule) {
    throw new Error("Schedule not found");
  }

  if (schedule.status === "PAID") {
    throw new Error("Schedule already paid");
  }

  const description = schedule.description
    ? `Pago deuda ${schedule.description}`
    : `Pago deuda ${schedule.counterparty_name ?? ""}`.trim();

  const transaction = await repo.createTransaction({
    date: new Date(),
    description,
    amount: schedule.amount,
    direction: "OUT",
    account_id: accountId,
    payment_method: paymentMethod,
  });

  return repo.markSchedulePaid(scheduleId, transaction.id);
}