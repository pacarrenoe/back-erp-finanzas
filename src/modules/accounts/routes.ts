import { Router } from "express";
import * as ctrl from "./controllers/account.controller";

export const accountsRouter = Router();

accountsRouter.get("/", ctrl.list);
accountsRouter.get("/:id", ctrl.getById);
accountsRouter.post("/", ctrl.create);
accountsRouter.patch("/:id", ctrl.update);
accountsRouter.delete("/:id", ctrl.remove);