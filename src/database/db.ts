import { Pool } from "pg";

export const pool = new Pool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5433),
  user: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "1234",
  database: process.env.DB_NAME ?? "erp_finanzas",
  max: 10,
});