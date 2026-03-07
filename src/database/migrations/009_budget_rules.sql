CREATE TABLE IF NOT EXISTS budget_rule (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid NOT NULL REFERENCES category(id) ON DELETE CASCADE,
  limit_amount integer NOT NULL CHECK (limit_amount > 0),
  alert_threshold_pct integer NOT NULL DEFAULT 80,
  period_type text NOT NULL DEFAULT 'PERIOD',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_budget_rule_category
ON budget_rule(category_id);