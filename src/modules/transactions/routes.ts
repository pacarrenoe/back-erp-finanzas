import { Router } from "express";
import * as ctrl from "./controllers/transaction.controller";

export const transactionsRouter = Router();

transactionsRouter.get("/", ctrl.list);
transactionsRouter.post("/", ctrl.create);