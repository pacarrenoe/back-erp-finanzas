CREATE TABLE IF NOT EXISTS debt (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  direction text NOT NULL CHECK (direction IN ('I_OWE','OWE_ME')),
  counterparty_name text NOT NULL,
  description text,
  principal_amount integer NOT NULL CHECK (principal_amount > 0),
  status text NOT NULL DEFAULT 'OPEN',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS debt_payment_schedule (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  debt_id uuid NOT NULL REFERENCES debt(id) ON DELETE CASCADE,
  due_date date NOT NULL,
  amount integer NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'PENDING',
  paid_transaction_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_debt_status ON debt(status);
CREATE INDEX idx_debt_schedule_due ON debt_payment_schedule(due_date);