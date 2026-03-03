import { Router } from "express";
import * as ctrl from "./controllers/recurring.controller";

export const recurringRouter = Router();

recurringRouter.get("/", ctrl.list);
recurringRouter.post("/", ctrl.create);