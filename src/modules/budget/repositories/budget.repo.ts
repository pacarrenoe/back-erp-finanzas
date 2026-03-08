import { pool } from "../../../database/db";

type CreateBudgetRuleInput = {
  category_id: string;
  limit_amount: number;
  alert_threshold_pct?: number;
  period_type?: "PERIOD";
  active?: boolean;
};

type UpdateBudgetRuleInput = {
  category_id?: string;
  limit_amount?: number;
  alert_threshold_pct?: number;
  period_type?: "PERIOD";
  active?: boolean;
};

export async function existsActiveRuleByCategory(
  categoryId: string,
  periodType: string,
  excludeId?: string
) {
  const params: any[] = [categoryId, periodType];
  let sql = `
    SELECT 1
    FROM budget_rule
    WHERE category_id = $1
      AND period_type = $2
      AND active = true
  `;

  if (excludeId) {
    params.push(excludeId);
    sql += ` AND id <> $3`;
  }

  sql += ` LIMIT 1`;

  const { rows } = await pool.query(sql, params);
  return rows.length > 0;
}

export async function createRule(data: CreateBudgetRuleInput) {
  const { rows } = await pool.query(
    `
    INSERT INTO budget_rule (
      category_id,
      limit_amount,
      alert_threshold_pct,
      period_type,
      active
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [
      data.category_id,
      data.limit_amount,
      data.alert_threshold_pct ?? 80,
      data.period_type ?? "PERIOD",
      data.active ?? true,
    ]
  );

  return rows[0];
}

export async function getRuleById(id: string) {
  const { rows } = await pool.query(
    `
    SELECT
      br.*,
      c.name AS category_name
    FROM budget_rule br
    JOIN category c ON c.id = br.category_id
    WHERE br.id = $1
    `,
    [id]
  );

  return rows[0] ?? null;
}

export async function getRules(active?: boolean) {
  const params: any[] = [];
  let sql = `
    SELECT
      br.*,
      c.name AS category_name
    FROM budget_rule br
    JOIN category c ON c.id = br.category_id
  `;

  if (typeof active === "boolean") {
    params.push(active);
    sql += ` WHERE br.active = $1`;
  }

  sql += ` ORDER BY c.name ASC`;

  const { rows } = await pool.query(sql, params);
  return rows;
}

export async function updateRule(id: string, data: UpdateBudgetRuleInput) {
  const fields: string[] = [];
  const values: any[] = [];
  let index = 1;

  if (data.category_id !== undefined) {
    fields.push(`category_id = $${index++}`);
    values.push(data.category_id);
  }

  if (data.limit_amount !== undefined) {
    fields.push(`limit_amount = $${index++}`);
    values.push(data.limit_amount);
  }

  if (data.alert_threshold_pct !== undefined) {
    fields.push(`alert_threshold_pct = $${index++}`);
    values.push(data.alert_threshold_pct);
  }

  if (data.period_type !== undefined) {
    fields.push(`period_type = $${index++}`);
    values.push(data.period_type);
  }

  if (data.active !== undefined) {
    fields.push(`active = $${index++}`);
    values.push(data.active);
  }

  if (fields.length === 0) {
    return getRuleById(id);
  }

  values.push(id);

  const { rows } = await pool.query(
    `
    UPDATE budget_rule
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *
    `,
    values
  );

  return rows[0] ?? null;
}

export async function softDeleteRule(id: string) {
  const { rows } = await pool.query(
    `
    UPDATE budget_rule
    SET active = false
    WHERE id = $1
    RETURNING *
    `,
    [id]
  );

  return rows[0] ?? null;
}

export async function getBudgetStatus(periodId: string) {
  const { rows } = await pool.query(
    `
    SELECT
      br.id,
      br.category_id,
      c.name AS category_name,
      br.limit_amount,
      br.alert_threshold_pct,
      br.period_type,
      br.active,
      br.created_at,

      COALESCE(SUM(
        CASE
          WHEN t.direction = 'OUT' THEN t.amount
          ELSE 0
        END
      ), 0) AS spent_amount,

      (br.limit_amount - COALESCE(SUM(
        CASE
          WHEN t.direction = 'OUT' THEN t.amount
          ELSE 0
        END
      ), 0)) AS remaining_amount,

      CASE
        WHEN br.limit_amount <= 0 THEN 0
        ELSE ROUND(
          (
            COALESCE(SUM(
              CASE
                WHEN t.direction = 'OUT' THEN t.amount
                ELSE 0
              END
            ), 0)::numeric / br.limit_amount::numeric
          ) * 100,
          2
        )
      END AS percent_used

    FROM budget_rule br
    JOIN category c
      ON c.id = br.category_id

    LEFT JOIN "transaction" t
      ON t.category_id = br.category_id
      AND t.period_id = $1

    WHERE br.active = true

    GROUP BY
      br.id,
      br.category_id,
      c.name,
      br.limit_amount,
      br.alert_threshold_pct,
      br.period_type,
      br.active,
      br.created_at

    ORDER BY c.name ASC
    `,
    [periodId]
  );

  return rows.map((row) => ({
    ...row,
    spent_amount: Number(row.spent_amount ?? 0),
    remaining_amount: Number(row.remaining_amount ?? 0),
    percent_used: Number(row.percent_used ?? 0),
    alert: Number(row.percent_used ?? 0) >= Number(row.alert_threshold_pct ?? 80),
  }));
}