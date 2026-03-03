import * as repo from "../repositories/installment.repo";

export async function list(filter?: { periodId?: string; status?: string }) {
  return repo.listInstallments(filter);
}

export async function markPaid(id: string, paid_transaction_id?: string) {
  return repo.markPaid(id, paid_transaction_id);
}

export async function summary(periodId: string) {
  return repo.getSummaryByPeriod(periodId);
}