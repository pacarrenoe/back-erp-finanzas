import * as repo from "../repositories/period.repo"

function addDays(date:string,days:number){

const d = new Date(date)

d.setDate(d.getDate()+days)

return d.toISOString().slice(0,10)

}

export async function create(input:any){

const startDate = input.salary_pay_date

const endDate = addDays(startDate,30)

await repo.closePreviousPeriod(addDays(startDate,-1))

let pluxeeAmount = null

if(input.days_worked && input.pluxee_per_day){

pluxeeAmount = input.days_worked * input.pluxee_per_day

}

return repo.createPeriod({

start_date:startDate,
end_date:endDate,
salary_pay_date:startDate,
base_salary_amount:input.base_salary_amount,
days_worked:input.days_worked,
pluxee_per_day:input.pluxee_per_day,
pluxee_amount:pluxeeAmount,
notes:input.notes

})

}

export async function list(){

return repo.listPeriods()

}

export async function current(){

return repo.getCurrentPeriod()

}