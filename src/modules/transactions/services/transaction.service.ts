import * as repo from "../repositories/transaction.repo";

export async function create(input: any) {
  const period = await repo.findPeriodByDate(input.date);

  return repo.createTransaction({
    ...input,
    period_id: period?.id ?? null,
  });
}

export async function list(periodId?: string) {
  return repo.listTransactions(periodId);
}

export async function getById(id: string) {
  return repo.findTransactionById(id);
}

export async function update(id: string, data: any) {
  return repo.updateTransaction(id, data);
}

export async function remove(id: string) {
  return repo.deleteTransaction(id);
}