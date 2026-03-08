import { Router } from "express";
import * as ctrl from "./controllers/installment.controller";

export const installmentsRouter = Router();

installmentsRouter.get("/", ctrl.list);
installmentsRouter.get("/current", ctrl.listCurrent);
installmentsRouter.get("/summary", ctrl.summary);
installmentsRouter.patch("/:id/mark-paid", ctrl.markPaid);