import * as repo from "../repositories/period.repo"

function addDays(date: string, days: number) {

  const d = new Date(`${date}T00:00:00`)

  d.setDate(d.getDate() + days)

  return d.toISOString().slice(0, 10)

}

function countBusinessDaysOfMonth(year: number, month: number) {

  const date = new Date(year, month, 1)

  let count = 0

  while (date.getMonth() === month) {

    const day = date.getDay()

    if (day !== 0 && day !== 6) {
      count++
    }

    date.setDate(date.getDate() + 1)

  }

  return count

}

function calculatePluxee(startDate: string, daysWorked: number | undefined, pluxeePerDay: number) {

  const d = new Date(`${startDate}T00:00:00`)

  // pluxee corresponde al mes siguiente al sueldo

  let month = d.getMonth() + 1
  let year = d.getFullYear()

  if (month > 11) {
    month = 0
    year++
  }

  const businessDays = countBusinessDaysOfMonth(year, month)

  const days = daysWorked ?? businessDays

  const amount = days * pluxeePerDay

  return {
    days,
    businessDays,
    amount
  }

}

export async function create(input: any) {

  const startDate = input.salary_pay_date

  const endDate = addDays(startDate, 30)

  await repo.closePreviousPeriod(addDays(startDate, -1))

  const pluxeePerDay = input.pluxee_per_day ?? 5000

  const pluxee = calculatePluxee(
    startDate,
    input.days_worked,
    pluxeePerDay
  )

  return repo.createPeriod({

    start_date: startDate,
    end_date: endDate,
    salary_pay_date: startDate,
    base_salary_amount: input.base_salary_amount,

    days_worked: pluxee.days,
    pluxee_per_day: pluxeePerDay,
    pluxee_amount: pluxee.amount,

    notes: input.notes

  })

}

export async function list() {

  return repo.listPeriods()

}

export async function current() {

  return repo.getCurrentPeriod()

}

export async function update(id: string, input: any) {

  const period = await repo.getPeriodById(id)

  const pluxeePerDay = input.pluxee_per_day ?? period.pluxee_per_day ?? 5000

  const daysWorked = input.days_worked ?? period.days_worked

  const pluxee = calculatePluxee(
    period.start_date,
    daysWorked,
    pluxeePerDay
  )

  return repo.updatePeriod(id, {

    days_worked: pluxee.days,
    pluxee_per_day: pluxeePerDay,
    pluxee_amount: pluxee.amount,
    notes: input.notes ?? period.notes

  })

}

export async function remove(id: string) {

  return repo.deletePeriod(id)

}