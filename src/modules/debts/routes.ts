import { Router } from "express";
import * as ctrl from "./controllers/debt.controller";

export const debtsRouter = Router();

debtsRouter.post("/", ctrl.create);

debtsRouter.get("/", ctrl.list);
debtsRouter.get("/:id", ctrl.getById);

debtsRouter.patch("/:id", ctrl.update);
debtsRouter.delete("/:id", ctrl.remove);

debtsRouter.post("/:id/schedule", ctrl.schedule);
debtsRouter.get("/:id/schedule", ctrl.getSchedule);

debtsRouter.patch("/schedule/:id/mark-paid", ctrl.markPaid);