import { pool } from "../../../database/db"

export async function listCategories() {
  const { rows } = await pool.query(`
    SELECT
      c.id,
      c.name,
      c.kind,
      c.parent_id,
      p.name AS parent_name
    FROM category c
    LEFT JOIN category p ON p.id = c.parent_id
    ORDER BY c.kind, c.name
  `)

  return rows
}

export async function createCategory(data: any) {
  const { rows } = await pool.query(
    `
    INSERT INTO category (name, kind, parent_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [
      data.name,
      data.kind,
      data.parent_id ?? null
    ]
  )

  return rows[0]
}

export async function updateCategory(id: string, data: any) {
  const { rows } = await pool.query(
    `
    UPDATE category
    SET
      name = COALESCE($1, name),
      kind = COALESCE($2, kind),
      parent_id = $3
    WHERE id = $4
    RETURNING *
    `,
    [
      data.name ?? null,
      data.kind ?? null,
      data.parent_id ?? null,
      id
    ]
  )

  return rows[0]
}

export async function deleteCategory(id: string) {
  await pool.query(
    `
    DELETE FROM category
    WHERE id = $1
    `,
    [id]
  )
}