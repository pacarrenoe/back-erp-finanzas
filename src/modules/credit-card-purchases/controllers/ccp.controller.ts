import { Request, Response } from "express";
import { createPurchaseSchema } from "../dtos/ccp.schema";
import * as service from "../services/ccp.service";
import { success } from "../../../shared/response";

export async function create(req:Request,res:Response){

const input = createPurchaseSchema.parse(req.body)

const created = await service.create(input)

return success(res,created,201,"Compra creada")

}

export async function list(_req:Request,res:Response){

const data = await service.list()

return success(res,data)

}

export async function remove(
req:Request<{id:string}>,
res:Response
){

await service.remove(req.params.id)

return success(res,true)

}