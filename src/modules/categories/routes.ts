import { Router } from "express";
import * as ctrl from "./controllers/category.controller";

export const categoriesRouter = Router();

categoriesRouter.get("/", ctrl.list);
categoriesRouter.post("/", ctrl.create);