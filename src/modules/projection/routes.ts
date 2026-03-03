import { Router } from "express";
import * as ctrl from "./controllers/projection.controller";

export const projectionRouter = Router();

projectionRouter.get("/", ctrl.projection);