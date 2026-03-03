import { Router } from "express";
import * as ctrl from "./controllers/budget.controller";

export const budgetRouter = Router();

budgetRouter.post("/", ctrl.create);
budgetRouter.get("/", ctrl.list);