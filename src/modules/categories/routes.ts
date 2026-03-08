import { Router } from "express"
import * as ctrl from "./controllers/category.controller"

export const categoriesRouter = Router()

categoriesRouter.get("/", ctrl.list)
categoriesRouter.post("/", ctrl.create)
categoriesRouter.patch("/:id", ctrl.update)
categoriesRouter.delete("/:id", ctrl.remove)