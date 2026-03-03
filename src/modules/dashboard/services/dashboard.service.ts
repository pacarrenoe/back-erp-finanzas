import * as repo from "../repositories/dashboard.repo";

function calculateRisk(income: number, commitments: number) {
  if (income <= 0) return "CRITICO";

  const ratio = commitments / income;

  if (commitments > income) return "CRITICO";
  if (ratio > 0.6) return "ALTO";
  if (ratio > 0.4) return "MEDIO";
  return "BAJO";
}

export async function getCurrentDashboard() {
  const period = await repo.getCurrentPeriod();
  if (!period) return null;

  return getDashboardByPeriod(period.id);
}

export async function getDashboardByPeriod(periodId: string) {
  const period = await repo.getPeriodById(periodId);
  if (!period) return null;

  const kpis = await repo.getPeriodKpis(periodId);
  const recurringTotal = await repo.getRecurringCommitmentsTotal(periodId);
  const installmentsTotal = await repo.getInstallmentsPendingTotal(periodId);

  const breakdownCategory = await repo.getBreakdownByCategory(periodId);
  const breakdownAccount = await repo.getBreakdownByAccount(periodId);

  // 🔥 DEUDAS INTEGRADAS
  const periodStart = period.start_date;
  const periodEnd =
    period.end_date ??
    new Date(
      new Date(period.start_date).setMonth(
        new Date(period.start_date).getMonth() + 1
      )
    )
      .toISOString()
      .split("T")[0];

  const debtRows = await repo.getDebtScheduleByPeriod(
    periodStart,
    periodEnd
  );

  let debtIncome = 0;
  let debtCommitments = 0;

  for (const row of debtRows) {
    if (row.direction === "OWE_ME")
      debtIncome += Number(row.total);
    if (row.direction === "I_OWE")
      debtCommitments += Number(row.total);
  }

  const txIncome = Number(kpis?.tx_income_total ?? 0);
  const txExpense = Number(kpis?.tx_expense_total ?? 0);

  const baseSalary = Number(period.base_salary_amount ?? 0);
  const pluxee = Number(period.pluxee_amount ?? 0);

  const incomeTotal =
    baseSalary + pluxee + txIncome + debtIncome;

  const commitmentsTotal =
    recurringTotal +
    installmentsTotal +
    debtCommitments;

  const realExpenseTotal = txExpense;

  const projectedAvailable =
    incomeTotal - commitmentsTotal - realExpenseTotal;

  const riskLevel = calculateRisk(
    incomeTotal,
    commitmentsTotal
  );

  return {
    period,
    income_total: incomeTotal,
    commitments_total: commitmentsTotal,
    expense_total: realExpenseTotal,
    projected_available: projectedAvailable,
    risk_level: riskLevel,
    breakdown_category: breakdownCategory,
    breakdown_account: breakdownAccount,
  };
}

export async function getTrend(n = 6) {
  return repo.getPeriodsTrend(n);
}