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