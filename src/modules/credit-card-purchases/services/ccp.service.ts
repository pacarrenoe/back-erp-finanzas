import { CreatePurchaseInput } from "../dtos/ccp.schema";
import * as repo from "../repositories/ccp.repo";
import * as instRepo from "../../installments/repositories/installment.repo";
import { findPeriodByDate } from "../../../shared/periodFinder";

function addMonths(isoDate:string,months:number){

const d = new Date(isoDate + "T00:00:00")

d.setMonth(d.getMonth()+months)

return d.toISOString().slice(0,10)

}

export async function create(input:CreatePurchaseInput){

const base = Math.floor(input.total_amount / input.installments)

const remainder = input.total_amount - base * input.installments

const purchase = await repo.createPurchaseRow({

...input,
installment_amount:base

})

const installmentsToCreate=[]

for(let i=0;i<input.installments;i++){

const due = addMonths(input.first_installment_date,i)

const periodId = await findPeriodByDate(due)

const amount = i===0 ? base+remainder : base

installmentsToCreate.push({

due_date:due,
amount,
period_id:periodId

})

}

const createdInstallments = await instRepo.bulkCreateInstallments(

purchase.id,
installmentsToCreate

)

return{

purchase,
installments:createdInstallments

}

}

export async function list(){

return repo.listPurchases()

}

export async function remove(id:string){

await repo.deletePurchase(id)

}