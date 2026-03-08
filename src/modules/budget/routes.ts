import { Router } from "express";
import * as ctrl from "./controllers/budget.controller";

export const budgetRouter = Router();

budgetRouter.post("/", ctrl.create);
budgetRouter.get("/", ctrl.list);
budgetRouter.get("/:id", ctrl.getById);
budgetRouter.patch("/:id", ctrl.update);
budgetRouter.delete("/:id", ctrl.remove);