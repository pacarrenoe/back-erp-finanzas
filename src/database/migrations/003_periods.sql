CREATE TABLE IF NOT EXISTS period (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_date date NOT NULL,
  end_date date,
  salary_pay_date date NOT NULL,
  base_salary_amount integer NOT NULL,
  days_worked integer,
  pluxee_per_day integer,
  pluxee_amount integer,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_period_start ON period(start_date);
CREATE INDEX IF NOT EXISTS idx_period_salary ON period(salary_pay_date);