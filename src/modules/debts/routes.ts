import { Router } from "express";
import * as ctrl from "./controllers/debt.controller";

export const debtsRouter = Router();

debtsRouter.post("/", ctrl.create);
debtsRouter.get("/", ctrl.list);
debtsRouter.post("/:id/schedule", ctrl.schedule);
debtsRouter.patch("/schedule/:id/mark-paid", ctrl.markPaid);