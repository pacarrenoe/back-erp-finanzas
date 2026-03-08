import { pool } from "../../../database/db";

export async function findByEmail(email: string) {

  const { rows } = await pool.query(
    `SELECT * FROM auth_user WHERE email = $1`,
    [email]
  );

  return rows[0] ?? null;

}

export async function createUser(
  email: string,
  passwordHash: string,
  name: string,
  phone?: string
) {

  const { rows } = await pool.query(
    `
    INSERT INTO auth_user (email, password_hash, name, phone)
    VALUES ($1,$2,$3,$4)
    RETURNING id,email,name,phone,created_at
    `,
    [email, passwordHash, name, phone]
  );

  return rows[0];

}

export async function findById(id: string) {

  const { rows } = await pool.query(
    `
    SELECT id,email,name,phone,created_at
    FROM auth_user
    WHERE id = $1
    `,
    [id]
  );

  return rows[0] ?? null;

}