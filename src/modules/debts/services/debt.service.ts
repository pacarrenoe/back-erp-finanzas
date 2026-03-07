import * as repo from "../repositories/debt.repo";

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export async function createDebt(data: any) {
  return repo.createDebt(data);
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

export async function markPaid(id: string) {
  return repo.markPaid(id);
}