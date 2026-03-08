import { Router } from "express"

import * as ctrl from "./controllers/period.controller"

export const periodsRouter = Router()

periodsRouter.get("/",ctrl.list)

periodsRouter.get("/current",ctrl.current)

periodsRouter.post("/",ctrl.create)