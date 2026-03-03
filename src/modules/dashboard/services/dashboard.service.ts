import * as repo from "../repositories/dashboard.repo";

function calcRisk(income: number, totalOut: number, available: number) {
  const ratio = income > 0 ? totalOut / income : 1;

  let level: "BAJO" | "MEDIO" | "ALTO" | "CRITICO" = "BAJO";
  if (available < 0) level = "CRITICO";
  else if (ratio > 0.6) level = "ALTO";
  else if (ratio >= 0.4) level = "MEDIO";

  return { ratio, level };
}

export async function getDashboardByPeriod(periodId: string) {
  const period = await repo.getPeriodById(periodId);
  if (!period) return null;

  const kpis = await repo.getPeriodKpis(periodId);
  const commitmentsTotal = await repo.getRecurringCommitmentsTotal(periodId);

  const byCategory = await repo.getBreakdownByCategory(periodId);
  const byAccount = await repo.getBreakdownByAccount(periodId);

  const baseIncome =
    Number(period.base_salary_amount ?? 0) + Number(period.pluxee_amount ?? 0);

  const txIncome = Number(kpis.tx_income_total ?? 0);
  const txExpense = Number(kpis.tx_expense_total ?? 0);

  const incomeTotal = baseIncome + txIncome;
  const expenseTotal = txExpense;

  const totalOut = expenseTotal + commitmentsTotal;
  const availableTotal = incomeTotal - totalOut;

  const risk = calcRisk(incomeTotal, totalOut, availableTotal);

  return {
    period: {
      id: period.id,
      start_date: period.start_date,
      end_date: period.end_date,
      salary_pay_date: period.salary_pay_date,
      base_salary_amount: Number(period.base_salary_amount ?? 0),
      pluxee_amount: Number(period.pluxee_amount ?? 0),
    },
    kpis: {
      income_total: incomeTotal,
      expense_total: expenseTotal,
      commitments_total: commitmentsTotal,
      total_out: totalOut,
      available_total: availableTotal,
      commitment_ratio: Number(risk.ratio.toFixed(4)),
      risk_level: risk.level,
    },
    breakdown: {
      by_category: byCategory,
      by_account: byAccount,
    },
  };
}

export async function getTrend(n = 6) {
  return repo.getPeriodsTrend(n);
}