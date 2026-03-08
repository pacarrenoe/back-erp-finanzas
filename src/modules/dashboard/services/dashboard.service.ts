import * as repo from "../repositories/dashboard.repo";
import * as budgetRepo from "../../budget/repositories/budget.repo";

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

  const debtRows = await repo.getDebtScheduleByPeriod(periodStart, periodEnd);

  let debtIncome = 0;
  let debtCommitments = 0;

  for (const row of debtRows) {

    if (row.direction === "OWE_ME") {
      debtIncome += Number(row.total);
    }

    if (row.direction === "I_OWE") {
      debtCommitments += Number(row.total);
    }

  }

  const txIncome = Number(kpis?.tx_income_total ?? 0);
  const txExpense = Number(kpis?.tx_expense_total ?? 0);

  const baseSalary = Number(period.base_salary_amount ?? 0);
  const pluxee = Number(period.pluxee_amount ?? 0);

  const recurring = recurringTotal;
  const installments = installmentsTotal;

  const commitmentsTotal =
    recurring +
    installments +
    debtCommitments;

  const realExpenseTotal = txExpense;

  const incomeTotal =
    baseSalary +
    pluxee +
    txIncome +
    debtIncome;

  const projectedAvailable =
    incomeTotal -
    commitmentsTotal -
    realExpenseTotal;

  const commitmentRatio =
    incomeTotal > 0
      ? Number((commitmentsTotal / incomeTotal * 100).toFixed(2))
      : 0;

  const debtServiceRatio =
    incomeTotal > 0
      ? Number((installments / incomeTotal * 100).toFixed(2))
      : 0;

  const riskLevel = calculateRisk(
    incomeTotal,
    commitmentsTotal
  );

  /* =====================================================
     NUEVAS MÉTRICAS FINTECH
  ===================================================== */

  const cashIncome =
    baseSalary +
    txIncome +
    debtIncome;

  const restrictedIncome =
    pluxee;

  const cashAvailable =
    cashIncome -
    commitmentsTotal -
    realExpenseTotal;

  const foodCash =
    breakdownCategory
      .filter((c: any) => c.name === "Comida")
      .reduce((sum: number, c: any) => sum + Number(c.total), 0);

  const foodFund =
    foodCash +
    restrictedIncome;

  const today = new Date();

  const nextSalary = new Date(period.salary_pay_date);

  const diffDays =
    Math.ceil(
      (nextSalary.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );

  const daysUntilSalary =
    diffDays > 0 ? diffDays : 0;

  const dailyBudget =
    daysUntilSalary > 0
      ? Math.floor(cashAvailable / daysUntilSalary)
      : 0;

  /* =====================================================
     ALERTAS EXISTENTES
  ===================================================== */

  const rules = await budgetRepo.getActiveRules();

  const alerts: any[] = [];

  for (const rule of rules) {

    const categoryTotal = breakdownCategory.find(
      (c: any) =>
        c.name === rule.category_name &&
        c.kind === "EXPENSE"
    );

    const spent = Number(categoryTotal?.total ?? 0);

    if (spent >= rule.limit_amount) {

      alerts.push({
        type: "LIMIT_EXCEEDED",
        category: rule.category_name,
        spent,
        limit: rule.limit_amount
      });

    } else if (
      spent >=
      (rule.limit_amount * rule.alert_threshold_pct) / 100
    ) {

      alerts.push({
        type: "NEAR_LIMIT",
        category: rule.category_name,
        spent,
        limit: rule.limit_amount
      });

    }

  }

  if (commitmentRatio > 60) {

    alerts.push({
      type: "OVERCOMMITMENT",
      message: "Compromisos superan 60% del ingreso"
    });

  }

  if (projectedAvailable < 0) {

    alerts.push({
      type: "NEGATIVE_PROJECTION",
      message: "Saldo proyectado negativo al cierre"
    });

  }

  /* =====================================================
     RESPONSE FINAL
  ===================================================== */

  return {

    period,

    income_total: incomeTotal,

    commitments_total: commitmentsTotal,

    expense_total: realExpenseTotal,

    projected_available: projectedAvailable,

    commitment_ratio_pct: commitmentRatio,

    debt_service_ratio_pct: debtServiceRatio,

    risk_level: riskLevel,

    income_breakdown: {
      salary: baseSalary,
      pluxee,
      extra_income: txIncome,
      debt_collections: debtIncome
    },

    commitments_breakdown: {
      recurring,
      installments,
      debt_payments: debtCommitments
    },

    financial_health: {

      cash_income: cashIncome,

      restricted_income: restrictedIncome,

      cash_available: cashAvailable,

      food_fund: foodFund,

      days_until_salary: daysUntilSalary,

      daily_budget: dailyBudget

    },

    breakdown_category: breakdownCategory,

    breakdown_account: breakdownAccount,

    alerts

  };

}

export async function getTrend(n = 6) {
  return repo.getPeriodsTrend(n);
}