-- 006_installments.sql

CREATE TABLE IF NOT EXISTS credit_card_purchase (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- transacción "madre" opcional: si quieres guardar el evento compra como movimiento
  transaction_id uuid,
  total_amount integer NOT NULL CHECK (total_amount > 0),
  installments integer NOT NULL CHECK (installments > 0),
  installment_amount integer NOT NULL CHECK (installment_amount > 0),
  first_installment_date date NOT NULL,
  card_account_id uuid NOT NULL REFERENCES account(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'ACTIVE', -- ACTIVE | FINISHED | CANCELLED
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ccp_card_account ON credit_card_purchase(card_account_id);
CREATE INDEX IF NOT EXISTS idx_ccp_status ON credit_card_purchase(status);

CREATE TABLE IF NOT EXISTS installment (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_id uuid NOT NULL REFERENCES credit_card_purchase(id) ON DELETE CASCADE,
  period_id uuid REFERENCES period(id) ON DELETE SET NULL,
  due_date date NOT NULL,
  amount integer NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'PENDING', -- PENDING | PAID
  paid_transaction_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inst_period ON installment(period_id);
CREATE INDEX IF NOT EXISTS idx_inst_due_date ON installment(due_date);
CREATE INDEX IF NOT EXISTS idx_inst_status ON installment(status);