import fs from "node:fs";
import path from "node:path";
import { pool } from "./db";

async function run() {
  const dir = path.join(__dirname, "migrations");
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort((a, b) => a.localeCompare(b));

  for (const f of files) {
    const full = path.join(dir, f);
    const sql = fs.readFileSync(full, "utf8");
    await pool.query(sql);
    console.log(`✅ Migration aplicada: ${f}`);
  }

  await pool.end();
  console.log("✅ Todas las migraciones aplicadas");
}

run().catch((e) => {
  console.error("❌ Error aplicando migraciones:", e);
  process.exit(1);
});