import { Router } from "express";
import * as ctrl from "./controllers/transaction.controller";

export const transactionsRouter = Router();

transactionsRouter.get("/", ctrl.list);
transactionsRouter.get("/:id", ctrl.getById);

transactionsRouter.post("/", ctrl.create);

transactionsRouter.put("/:id", ctrl.update);

transactionsRouter.delete("/:id", ctrl.remove);