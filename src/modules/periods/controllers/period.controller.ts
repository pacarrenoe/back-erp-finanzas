import { Request,Response } from "express"

import { createPeriodSchema } from "../dtos/period.schema"

import * as service from "../services/period.service"

import { success } from "../../../shared/response"

export async function create(req:Request,res:Response){

const input = createPeriodSchema.parse(req.body)

const created = await service.create(input)

return success(res,created,201,"Período creado")

}

export async function list(_req:Request,res:Response){

const data = await service.list()

return success(res,data)

}

export async function current(_req:Request,res:Response){

const data = await service.current()

return success(res,data)

}