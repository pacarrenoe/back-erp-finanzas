import * as repo from "../repositories/debt.repo";

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export async function createDebt(data: any) {
  return repo.createDebt(data);
}

export async function createSchedule(debtId: string, installments: number, firstDue: string, total: number) {
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

export async function getAll() {
  return repo.getAllDebts();
}

export async function markPaid(id: string) {
  return repo.markPaid(id);
}