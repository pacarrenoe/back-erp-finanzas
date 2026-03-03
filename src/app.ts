import express from "express";
import cors from "cors";
import "dotenv/config";

import { authRouter } from "./modules/auth/routes";
import { accountsRouter } from "./modules/accounts/routes";
import { categoriesRouter } from "./modules/categories/routes";
import { periodsRouter } from "./modules/periods/routes";
import { transactionsRouter } from "./modules/transactions/routes";
import { dashboardRouter } from "./modules/dashboard/routes";
import { recurringRouter } from "./modules/recurring/routes";
import { creditCardPurchasesRouter } from "./modules/credit-card-purchases/routes";
import { installmentsRouter } from "./modules/installments/routes";
import { projectionRouter } from "./modules/projection/routes";
import { debtsRouter } from "./modules/debts/routes";
import { authMiddleware } from "./middlewares/authMiddleware";
import { errorHandler } from "./middlewares/errorHandler";

export const app = express();

/* =============================
   GLOBAL MIDDLEWARES
============================= */

app.use(cors());
app.use(express.json());

/* =============================
   HEALTH CHECK (PÚBLICO)
============================= */

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    name: "erp-finanzas-api",
    time: new Date().toISOString(),
  });
});

/* =============================
   AUTH (PÚBLICO)
============================= */

app.use("/auth", authRouter);

/* =============================
   PROTEGER TODO LO DEMÁS
============================= */

app.use(authMiddleware);

/* =============================
   RUTAS PROTEGIDAS
============================= */

app.use("/accounts", accountsRouter);
app.use("/categories", categoriesRouter);
app.use("/periods", periodsRouter);
app.use("/transactions", transactionsRouter);
app.use("/dashboard", dashboardRouter);
app.use("/recurring", recurringRouter);
app.use("/credit-card-purchases", creditCardPurchasesRouter);
app.use("/installments", installmentsRouter);
app.use("/projection", projectionRouter);
app.use("/debts", debtsRouter);

/* =============================
   ERROR HANDLER (SIEMPRE AL FINAL)
============================= */

app.use(errorHandler);