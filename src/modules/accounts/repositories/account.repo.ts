import { pool } from "../../../database/db";
import { CreateAccountInput, UpdateAccountInput } from "../dtos/account.schema";

export type AccountRow = {
  id: string;
  name: string;
  type: string;
  currency: string;
  bank: string | null;
  last4: string | null;
  credit_limit: number | null;
  billing_day: number | null;
  due_day: number | null;
  active: boolean;
  created_at: string;
};

export async function listAccounts(): Promise<AccountRow[]> {
  const { rows } = await pool.query(
    `SELECT * FROM account ORDER BY active DESC, created_at DESC`
  );
  return rows;
}

export async function getAccountById(id: string): Promise<AccountRow | null> {
  const { rows } = await pool.query(`SELECT * FROM account WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export async function createAccount(input: CreateAccountInput): Promise<AccountRow> {
  const { rows } = await pool.query(
    `
    INSERT INTO account (name, type, currency, bank, last4, credit_limit, billing_day, due_day, active)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *
    `,
    [
      input.name,
      input.type,
      input.currency ?? "CLP",
      input.bank ?? null,
      input.last4 ?? null,
      input.credit_limit ?? null,
      input.billing_day ?? null,
      input.due_day ?? null,
      input.active ?? true,
    ]
  );
  return rows[0];
}

export async function updateAccount(
  id: string,
  input: UpdateAccountInput
): Promise<AccountRow | null> {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  for (const [key, value] of Object.entries(input)) {
    fields.push(`${key} = $${idx++}`);
    values.push(value ?? null);
  }

  if (fields.length === 0) return getAccountById(id);

  values.push(id);

  const { rows } = await pool.query(
    `
    UPDATE account
    SET ${fields.join(", ")}
    WHERE id = $${idx}
    RETURNING *
    `,
    values
  );

  return rows[0] ?? null;
}

export async function deleteAccount(id: string): Promise<boolean> {
  const { rowCount } = await pool.query(`DELETE FROM account WHERE id = $1`, [id]);
  return rowCount === 1;
}