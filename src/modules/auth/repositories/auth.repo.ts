import { pool } from "../../../database/db";

export async function findByEmail(email: string) {
  const { rows } = await pool.query(
    `SELECT * FROM auth_user WHERE email = $1`,
    [email]
  );
  return rows[0] ?? null;
}

export async function createUser(email: string, passwordHash: string) {
  const { rows } = await pool.query(
    `
    INSERT INTO auth_user (email, password_hash)
    VALUES ($1, $2)
    RETURNING id, email, created_at
    `,
    [email, passwordHash]
  );
  return rows[0];
}

export async function findById(id: string) {
  const { rows } = await pool.query(
    `SELECT id, email, created_at FROM auth_user WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}