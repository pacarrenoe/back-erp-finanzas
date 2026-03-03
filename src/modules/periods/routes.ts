import { Router } from "express";
import * as ctrl from "./controllers/period.controller";

export const periodsRouter = Router();

periodsRouter.get("/", ctrl.list);
periodsRouter.post("/", ctrl.create);