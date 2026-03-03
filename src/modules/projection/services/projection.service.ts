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
  if (income <= 0) return "CRITICO";

  const ratio = commitments / income;

  if (commitments > income) return "CRITICO";
  if (ratio > 0.6) return "ALTO";
  if (ratio > 0.4) return "MEDIO";
  return "BAJO";
}

export async function project(n = 6): Promise<ProjectionPeriod[]> {
  const last = await repo.getLastPeriod();
  if (!last) return [];

  const installments = await repo.getInstallmentsFuture(
    last.start_date
  );
  const recurrent = await repo.getRecurringAll();
  const debts = await repo.getDebtFuture(last.start_date);

  const salary = Number(last.base_salary_amount ?? 0);
  const pluxee = Number(last.pluxee_amount ?? 0);

  const results: ProjectionPeriod[] = [];

  for (let i = 0; i < n; i++) {
    const start = addMonths(new Date(last.start_date), i);
    const end = addMonths(new Date(last.start_date), i + 1);

    const installmentTotal = installments
      .filter(
        (ins) =>
          new Date(ins.due_date) >= start &&
          new Date(ins.due_date) < end
      )
      .reduce((sum, i) => sum + Number(i.amount), 0);

    const recurringTotal = recurrent.reduce(
      (sum, r) => sum + Number(r.amount),
      0
    );

    const debtForPeriod = debts.filter(
      (d) =>
        new Date(d.due_date) >= start &&
        new Date(d.due_date) < end
    );

    let debtIncome = 0;
    let debtCommitments = 0;

    for (const d of debtForPeriod) {
      if (d.direction === "OWE_ME")
        debtIncome += Number(d.amount);
      if (d.direction === "I_OWE")
        debtCommitments += Number(d.amount);
    }

    const incomeExpected =
      salary + pluxee + debtIncome;

    const commitmentsExpected =
      installmentTotal +
      recurringTotal +
      debtCommitments;

    const projectedAvailable =
      incomeExpected - commitmentsExpected;

    const riskLevel = calculateRisk(
      incomeExpected,
      commitmentsExpected
    );

    results.push({
      index: i + 1,
      start_date: start.toISOString().split("T")[0],
      end_date: end.toISOString().split("T")[0],
      income_expected: incomeExpected,
      commitments_expected: commitmentsExpected,
      projected_available: projectedAvailable,
      risk_level: riskLevel,
    });
  }

  return results;
}