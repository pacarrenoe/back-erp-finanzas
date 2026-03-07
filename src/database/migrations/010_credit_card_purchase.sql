CREATE TABLE IF NOT EXISTS credit_card_purchase (

  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  transaction_id uuid REFERENCES transaction(id) ON DELETE SET NULL,

  card_account_id uuid NOT NULL REFERENCES account(id) ON DELETE RESTRICT,

  total_amount integer NOT NULL CHECK (total_amount > 0),

  installments integer NOT NULL CHECK (installments > 0),

  installment_amount integer NOT NULL CHECK (installment_amount > 0),

  first_installment_date date NOT NULL,

  status text NOT NULL DEFAULT 'ACTIVE',

  created_at timestamptz NOT NULL DEFAULT now()

);

CREATE INDEX IF NOT EXISTS idx_ccp_card_account
ON credit_card_purchase(card_account_id);

CREATE INDEX IF NOT EXISTS idx_ccp_status
ON credit_card_purchase(status);