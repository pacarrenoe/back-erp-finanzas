import { pool } from "../../../database/db";
import { CreateCategoryInput } from "../dtos/category.schema";

export type CategoryRow = {
  id: string;
  name: string;
  kind: "INCOME" | "EXPENSE" | "TRANSFER";
  parent_id: string | null;
  active: boolean;
  created_at: string;
};

export async function listCategories(filter?: {
  kind?: string;
  active?: boolean;
}): Promise<CategoryRow[]> {
  const where: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (filter?.kind) {
    where.push(`kind = $${idx++}`);
    values.push(filter.kind);
  }
  if (typeof filter?.active === "boolean") {
    where.push(`active = $${idx++}`);
    values.push(filter.active);
  }

  const sql = `
    SELECT * FROM category
    ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
    ORDER BY kind ASC, name ASC
  `;

  const { rows } = await pool.query(sql, values);
  return rows;
}

export async function createCategory(input: CreateCategoryInput): Promise<CategoryRow> {
  const { rows } = await pool.query(
    `
    INSERT INTO category (name, kind, parent_id, active)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [input.name, input.kind, input.parent_id ?? null, input.active ?? true]
  );
  return rows[0];
}