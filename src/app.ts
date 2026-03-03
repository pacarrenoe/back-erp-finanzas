import express from "express";
import cors from "cors";
import "dotenv/config";
import { accountsRouter } from "./modules/accounts/routes";
import { categoriesRouter } from "./modules/categories/routes";
import { periodsRouter } from "./modules/periods/routes";
import { transactionsRouter } from "./modules/transactions/routes";
import { errorHandler } from "./middlewares/errorHandler";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true, name: "erp-finanzas-api", time: new Date().toISOString() });
});

app.use("/accounts", accountsRouter);
app.use("/categories", categoriesRouter);
app.use("/periods", periodsRouter);
app.use("/transactions", transactionsRouter);
app.use(errorHandler);