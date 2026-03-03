import * as repo from "../repositories/dashboard.repo";

function calcRisk(income: number, expense: number, net: number) {
  // por ahora "compromisos" = expense_total
  const ratio = income > 0 ? expense / income : 1;

  let level: "BAJO" | "MEDIO" | "ALTO" | "CRITICO" = "BAJO";

  if (net < 0) level = "CRITICO";
  else if (ratio > 0.6) level = "ALTO";
  else if (ratio >= 0.4) level = "MEDIO";

  return { ratio, level };
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
  const byCategory = await repo.getBreakdownByCategory(periodId);
  const byAccount = await repo.getBreakdownByAccount(periodId);

  const income = Number(kpis.income_total ?? 0);
  const expense = Number(kpis.expense_total ?? 0);
  const net = Number(kpis.net_total ?? 0);

  const risk = calcRisk(income, expense, net);

  return {
    period: {
      id: period.id,
      start_date: period.start_date,
      end_date: period.end_date,
      salary_pay_date: period.salary_pay_date,
      base_salary_amount: period.base_salary_amount,
      pluxee_amount: period.pluxee_amount ?? 0,
    },
    kpis: {
      income_total: income,
      expense_total: expense,
      net_total: net,
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