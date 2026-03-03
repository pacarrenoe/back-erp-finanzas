import { Router } from "express";
import * as ctrl from "./controllers/dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.get("/current", ctrl.current);
dashboardRouter.get("/period/:id", ctrl.byPeriod);
dashboardRouter.get("/trend", ctrl.trend); // ?n=6