CREATE TABLE IF NOT EXISTS transaction (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  date date NOT NULL,
  description text,
  amount integer NOT NULL CHECK (amount > 0),

  direction text NOT NULL
  CHECK (direction IN ('IN','OUT')),

  account_id uuid NOT NULL
  REFERENCES account(id) ON DELETE RESTRICT,

  category_id uuid NOT NULL
  REFERENCES category(id) ON DELETE RESTRICT,

  period_id uuid
  REFERENCES period(id) ON DELETE SET NULL,

  payment_method text NOT NULL
  CHECK (payment_method IN ('CASH','DEBIT','CREDIT','TRANSFER')),

  merchant text,

  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tx_date
ON transaction(date);

CREATE INDEX IF NOT EXISTS idx_tx_period
ON transaction(period_id);

CREATE INDEX IF NOT EXISTS idx_tx_account
ON transaction(account_id);