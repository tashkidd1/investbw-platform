-- Extend transactions type to include goal_contribution
ALTER TABLE transactions
  DROP CONSTRAINT IF EXISTS transactions_type_check;
ALTER TABLE transactions
  ADD CONSTRAINT transactions_type_check
  CHECK (type IN ('buy', 'sell', 'dividend', 'deposit', 'withdrawal', 'fee', 'goal_contribution'));

-- Add completed_at to goals for tracking completion date
ALTER TABLE goals
  ADD COLUMN IF NOT EXISTS completed_at timestamptz;

-- Add demo interval and last run tracking to recurring_investments
ALTER TABLE recurring_investments
  ADD COLUMN IF NOT EXISTS demo_interval_minutes integer;
ALTER TABLE recurring_investments
  ADD COLUMN IF NOT EXISTS last_run_at timestamptz;

-- Index for finding due demo-interval plans
CREATE INDEX IF NOT EXISTS idx_recurring_demo_active
  ON recurring_investments(is_active)
  WHERE is_active = true AND demo_interval_minutes IS NOT NULL;
