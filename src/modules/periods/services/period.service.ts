import * as repo from "../repositories/period.repo";

export async function create(input: any) {
  const startDate = new Date(input.salary_pay_date);

  // provisional end date: +30 días
  const provisionalEnd = new Date(startDate);
  provisionalEnd.setDate(provisionalEnd.getDate() + 30);

  let pluxeeAmount = null;

  if (input.days_worked && input.pluxee_per_day) {
    pluxeeAmount = input.days_worked * input.pluxee_per_day;
  }

  return repo.createPeriod({
    start_date: input.salary_pay_date,
    end_date: provisionalEnd.toISOString().slice(0, 10),
    salary_pay_date: input.salary_pay_date,
    base_salary_amount: input.base_salary_amount,
    days_worked: input.days_worked,
    pluxee_per_day: input.pluxee_per_day,
    pluxee_amount: pluxeeAmount,
    notes: input.notes,
  });
}

export async function list() {
  return repo.listPeriods();
}