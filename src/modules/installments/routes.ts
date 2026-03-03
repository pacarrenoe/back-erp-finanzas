import { Router } from "express";
import * as ctrl from "./controllers/installment.controller";

export const installmentsRouter = Router();

installmentsRouter.get("/", ctrl.list);
installmentsRouter.patch("/:id/mark-paid", ctrl.markPaid);