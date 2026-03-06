import { Router } from "express";
import * as ctrl from "./controllers/category.controller";


export const categoriesRouter = Router();

categoriesRouter.get("/", ctrl.list);
categoriesRouter.get("/:id", ctrl.getById);

categoriesRouter.post("/", ctrl.create);

categoriesRouter.put("/:id", ctrl.update);

categoriesRouter.delete("/:id", ctrl.remove);