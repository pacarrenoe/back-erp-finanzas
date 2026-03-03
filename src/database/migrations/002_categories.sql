-- 002_categories.sql

CREATE TABLE IF NOT EXISTS category (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  kind text NOT NULL, -- INCOME | EXPENSE | TRANSFER
  parent_id uuid REFERENCES category(id) ON DELETE SET NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (name, kind)
);

CREATE INDEX IF NOT EXISTS idx_category_kind ON category(kind);
CREATE INDEX IF NOT EXISTS idx_category_active ON category(active);

-- Seed mínimo (puedes ajustar nombres después)
INSERT INTO category (name, kind) VALUES
  ('Sueldo', 'INCOME'),
  ('Bono', 'INCOME'),
  ('Devolución / Reembolso', 'INCOME'),
  ('Cobro de deuda', 'INCOME'),

  ('Arriendo', 'EXPENSE'),
  ('Agua', 'EXPENSE'),
  ('Luz', 'EXPENSE'),
  ('Gas', 'EXPENSE'),
  ('Internet', 'EXPENSE'),
  ('Planes móviles', 'EXPENSE'),
  ('Supermercado', 'EXPENSE'),
  ('Comida', 'EXPENSE'),
  ('Mascotas', 'EXPENSE'),
  ('Transporte', 'EXPENSE'),
  ('Salud', 'EXPENSE'),
  ('Entretenimiento', 'EXPENSE'),
  ('Pago tarjeta de crédito', 'EXPENSE'),
  ('Cuota crédito consumo', 'EXPENSE'),

  ('Transferencia interna', 'TRANSFER')
ON CONFLICT (name, kind) DO NOTHING;