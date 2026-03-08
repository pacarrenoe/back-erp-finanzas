import * as repo from "../repositories/projection.repo";

type ProjectionPeriod = {
  index: number;
  period_id: string | null;
  period_label: string;
  start_date: string;
  end_date: string;
  expected_income: number;
  expected_commitments: number;
  projected_balance: number;
  commitment_ratio: number;
  debt_ratio: number;
  risk_level: "BAJO" | "MEDIO" | "ALTO" | "CRITICO";
};

type BasePeriod = {
  id: string | null;
  start_date: string;
  end_date: string;
  base_salary_amount: number;
  pluxee_amount: number;
};

function toDateOnly(value: string | Date) {
  return new Date(value).toISOString().split("T")[0];
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function diffDaysInclusive(start: Date, end: Date) {
  const ms = end.getTime() - start.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24)) + 1;
}

function calculateRisk(
  income: number,
  commitments: number,
  projectedBalance: number
): "BAJO" | "MEDIO" | "ALTO" | "CRITICO" {
  if (income <= 0) return "CRITICO";
  if (projectedBalance < 0) return "CRITICO";

  const ratio = commitments / income;

  if (ratio > 0.6) return "ALTO";
  if (ratio > 0.4) return "MEDIO";
  return "BAJO";
}

function buildPeriodLabel(startDate: string, endDate: string) {
  return `${startDate} → ${endDate}`;
}

async function resolveBasePeriod(startPeriodId?: string): Promise<BasePeriod | null> {
  if (startPeriodId) {
    const period = await repo.getPeriodById(startPeriodId);
    if (!period) return null;

    return {
      id: period.id,
      start_date: toDateOnly(period.start_date),
      end_date: toDateOnly(period.end_date),
      base_salary_amount: Number(period.base_salary_amount ?? 0),
      pluxee_amount: Number(period.pluxee_amount ?? 0),
    };
  }

  const last = await repo.getLastPeriod();
  if (!last) return null;

  return {
    id: last.id,
    start_date: toDateOnly(last.start_date),
    end_date: toDateOnly(last.end_date),
    base_salary_amount: Number(last.base_salary_amount ?? 0),
    pluxee_amount: Number(last.pluxee_amount ?? 0),
  };
}

function buildVirtualPeriods(base: BasePeriod, count: number) {
  const baseStart = new Date(base.start_date);
  const baseEnd = new Date(base.end_date);
  const durationDays = diffDaysInclusive(baseStart, baseEnd);

  const periods = [];

  for (let i = 0; i < count; i++) {
    const start = addDays(baseStart, i * durationDays);
    const end = addDays(start, durationDays - 1);

    periods.push({
      id: null as string | null,
      start_date: toDateOnly(start),
      end_date: toDateOnly(end),
      base_salary_amount: base.base_salary_amount,
      pluxee_amount: base.pluxee_amount,
    });
  }

  return periods;
}

export async function project(
  periodsCount = 6,
  startPeriodId?: string
): Promise<ProjectionPeriod[]> {
  const basePeriod = await resolveBasePeriod(startPeriodId);
  if (!basePeriod) return [];

  const existingPeriods = await repo.getFuturePeriodsFrom(
    basePeriod.start_date,
    periodsCount
  );

  let periods = existingPeriods.map((p) => ({
    id: p.id as string,
    start_date: toDateOnly(p.start_date),
    end_date: toDateOnly(p.end_date),
    base_salary_amount: Number(p.base_salary_amount ?? basePeriod.base_salary_amount ?? 0),
    pluxee_amount: Number(p.pluxee_amount ?? basePeriod.pluxee_amount ?? 0),
  }));

  if (periods.length < periodsCount) {
    const virtualPeriods = buildVirtualPeriods(basePeriod, periodsCount);

    periods = virtualPeriods.map((vp, index) => {
      const real = periods[index];
      return real ?? vp;
    });
  }

  periods = periods.slice(0, periodsCount);

  const firstStartDate = periods[0].start_date;

  const installments = await repo.getInstallmentsFuture(firstStartDate);
  const recurring = await repo.getRecurringAll();
  const debts = await repo.getDebtFuture(firstStartDate);

  const recurringTotalPerPeriod = recurring.reduce(
    (sum, item) => sum + Number(item.amount ?? 0),
    0
  );

  const results: ProjectionPeriod[] = periods.map((period, index) => {
    const start = new Date(period.start_date);
    const end = new Date(period.end_date);

    const installmentTotal = installments
      .filter((item) => {
        const due = new Date(item.due_date);
        return due >= start && due <= end;
      })
      .reduce((sum, item) => sum + Number(item.amount ?? 0), 0);

    const debtsInRange = debts.filter((item) => {
      const due = new Date(item.due_date);
      return due >= start && due <= end;
    });

    let debtIncome = 0;
    let debtCommitments = 0;

    for (const debt of debtsInRange) {
      const amount = Number(debt.amount ?? 0);
      if (debt.direction === "OWE_ME") debtIncome += amount;
      if (debt.direction === "I_OWE") debtCommitments += amount;
    }

    const expectedIncome =
      Number(period.base_salary_amount ?? 0) +
      Number(period.pluxee_amount ?? 0) +
      debtIncome;

    const expectedCommitments =
      installmentTotal +
      recurringTotalPerPeriod +
      debtCommitments;

    const projectedBalance = expectedIncome - expectedCommitments;

    const commitmentRatio =
      expectedIncome > 0
        ? Number((expectedCommitments / expectedIncome).toFixed(4))
        : 0;

    const debtRatio =
      expectedIncome > 0
        ? Number(((installmentTotal + debtCommitments) / expectedIncome).toFixed(4))
        : 0;

    const riskLevel = calculateRisk(
      expectedIncome,
      expectedCommitments,
      projectedBalance
    );

    return {
      index: index + 1,
      period_id: period.id,
      period_label: buildPeriodLabel(period.start_date, period.end_date),
      start_date: period.start_date,
      end_date: period.end_date,
      expected_income: expectedIncome,
      expected_commitments: expectedCommitments,
      projected_balance: projectedBalance,
      commitment_ratio: commitmentRatio,
      debt_ratio: debtRatio,
      risk_level: riskLevel,
    };
  });

  return results;
}