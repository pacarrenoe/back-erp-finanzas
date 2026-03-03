CREATE TABLE IF NOT EXISTS recurring_commitment (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  amount integer NOT NULL CHECK (amount > 0),
  category_id uuid NOT NULL REFERENCES category(id) ON DELETE RESTRICT,
  account_id uuid NOT NULL REFERENCES account(id) ON DELETE RESTRICT,
  frequency text NOT NULL, -- MONTHLY | WEEKLY | YEARLY
  start_date date NOT NULL,
  end_date date,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_recurring_active ON recurring_commitment(active);
CREATE INDEX IF NOT EXISTS idx_recurring_category ON recurring_commitment(category_id);