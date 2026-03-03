import { Router } from "express";
import * as ctrl from "./controllers/auth.controller";
import { authMiddleware } from "../../middlewares/authMiddleware";

export const authRouter = Router();

authRouter.post("/register", ctrl.register);
authRouter.post("/login", ctrl.login);
authRouter.get("/me", authMiddleware, ctrl.me);