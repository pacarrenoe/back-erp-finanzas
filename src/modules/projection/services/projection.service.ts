import * as repo from "../repositories/projection.repo";

type ProjectionPeriod = {
  index: number;
  start_date: string;
  end_date: string;
  income_expected: number;
  commitments_expected: number;
  projected_available: number;
  risk_level: string;
};

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function calculateRisk(income: number, commitments: number) {
  const ratio = commitments / income;

  if (income <= 0) return "CRITICO";
  if (commitments > income) return "CRITICO";
  if (ratio > 0.6) return "ALTO";
  if (ratio > 0.4) return "MEDIO";
  return "BAJO";
}

export async function project(n = 6): Promise<ProjectionPeriod[]> {
  const last = await repo.getLastPeriod();
  if (!last) return [];

  const installments = await repo.getInstallmentsFuture(last.start_date);
  const recurrent = await repo.getRecurringAll();

  const salary = Number(last.base_salary_amount);
  const pluxee = Number(last.pluxee_amount ?? 0);

  const baseIncome = salary + pluxee;

  const results: ProjectionPeriod[] = [];

  for (let i = 0; i < n; i++) {
    const start = addMonths(new Date(last.start_date), i);
    const end = addMonths(new Date(last.start_date), i + 1);

    // Cuotas que caen en este rango
    const installmentTotal = installments
      .filter(
        (ins) =>
          new Date(ins.due_date) >= start &&
          new Date(ins.due_date) < end
      )
      .reduce((sum, i) => sum + Number(i.amount), 0);

    // Recurrentes simples (MVP)
    const recurringTotal = recurrent.reduce(
      (sum, r) => sum + Number(r.amount),
      0
    );

    const commitments = installmentTotal + recurringTotal;
    const projected = baseIncome - commitments;

    results.push({
      index: i + 1,
      start_date: start.toISOString().split("T")[0],
      end_date: end.toISOString().split("T")[0],
      income_expected: baseIncome,
      commitments_expected: commitments,
      projected_available: projected,
      risk_level: calculateRisk(baseIncome, commitments),
    });
  }

  return results;
}