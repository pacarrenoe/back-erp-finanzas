import { Router } from "express";
import * as ctrl from "./controllers/ccp.controller";

export const creditCardPurchasesRouter = Router();


creditCardPurchasesRouter.get("/", ctrl.list);
creditCardPurchasesRouter.post("/", ctrl.create);
creditCardPurchasesRouter.delete("/:id", ctrl.remove);
creditCardPurchasesRouter.get("/current", ctrl.current)
creditCardPurchasesRouter.get("/summary",ctrl.summary)