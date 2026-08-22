/*
# InvestBW — Core Database Schema (V0)

## Overview
Creates the full data model for the InvestBW simulated investment platform.
All financial data is DEMO ONLY — no real securities are traded.

## New Tables

### Reference / Shared Data (readable by anon + authenticated)
1. **investments** — Catalogue of simulated securities (BSE + global). Read-only reference data.
2. **educational_content** — Learn library articles. Read-only reference data.

### User-Scoped Data (authenticated, owner-checked via auth.uid())
3. **profiles** — Extended user info linked to auth.users.
4. **cash_accounts** — Simulated cash balance per user (Pula).
5. **holdings** — Current positions per user.
6. **transactions** — Transaction history (buy/sell/dividend/deposit/withdrawal/fee).
7. **watchlists** — Watched securities per user.
8. **goals** — Goal-based investing targets.
9. **goal_contributions** — Contributions toward goals (child of goals).
10. **recurring_investments** — Auto-invest schedules.
11. **notifications** — In-app notifications.
12. **portfolio_snapshots** — Historical portfolio value snapshots.
13. **dividends** — Dividend records per user.

## Security
- RLS enabled on ALL tables.
- Reference tables (investments, educational_content): anon+authenticated SELECT only; writes restricted to service role (no anon/authenticated write policies).
- User-scoped tables: 4 policies each (SELECT/INSERT/UPDATE/DELETE) scoped TO authenticated with auth.uid() = user_id ownership checks.
- Owner columns default to auth.uid() so inserts that omit user_id still satisfy WITH CHECK.
- goal_contributions scoped through parent goals table via EXISTS subquery.

## Notes
- All monetary values use numeric(14,2) for precision.
- Timestamps default to now().
- FK constraints with ON DELETE CASCADE for child tables.
- Indexes on user_id and frequently-queried columns.
*/

-- ============================================================================
-- REFERENCE DATA TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticker text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'equity' CHECK (category IN ('equity', 'etf', 'reit', 'bond')),
  sector text NOT NULL DEFAULT 'General',
  market text NOT NULL DEFAULT 'botswana' CHECK (market IN ('botswana', 'global')),
  price numeric(14,2) NOT NULL DEFAULT 0,
  daily_change_pct numeric(8,4) NOT NULL DEFAULT 0,
  market_cap numeric(18,2),
  pe_ratio numeric(10,2),
  dividend_yield numeric(6,4),
  description text NOT NULL DEFAULT '',
  logo_color text DEFAULT '#2d9568',
  historical_prices jsonb NOT NULL DEFAULT '[]',
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE investments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_investments" ON investments;
CREATE POLICY "anon_read_investments" ON investments FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_investments_market ON investments(market);
CREATE INDEX IF NOT EXISTS idx_investments_category ON investments(category);
CREATE INDEX IF NOT EXISTS idx_investments_featured ON investments(is_featured) WHERE is_featured = true;

-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS educational_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  read_time_minutes integer NOT NULL DEFAULT 5,
  difficulty text NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  content text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_educational_content" ON educational_content;
CREATE POLICY "anon_read_educational_content" ON educational_content FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_educational_content_category ON educational_content(category);
CREATE INDEX IF NOT EXISTS idx_educational_content_difficulty ON educational_content(difficulty);

-- ============================================================================
-- USER-SCOPED TABLES
-- ============================================================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT 'Investor',
  avatar_color text NOT NULL DEFAULT '#2d9568',
  is_demo boolean NOT NULL DEFAULT false,
  joined_date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS cash_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  balance numeric(14,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'BWP',
  pending_deposits numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE cash_accounts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_cash" ON cash_accounts;
CREATE POLICY "select_own_cash" ON cash_accounts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_cash" ON cash_accounts;
CREATE POLICY "insert_own_cash" ON cash_accounts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_cash" ON cash_accounts;
CREATE POLICY "update_own_cash" ON cash_accounts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_cash" ON cash_accounts;
CREATE POLICY "delete_own_cash" ON cash_accounts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_cash_accounts_user_id ON cash_accounts(user_id);

-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS holdings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  investment_id uuid REFERENCES investments(id) ON DELETE SET NULL,
  ticker text NOT NULL,
  name text NOT NULL,
  shares numeric(14,4) NOT NULL DEFAULT 0,
  avg_cost_per_share numeric(14,4) NOT NULL DEFAULT 0,
  current_price numeric(14,4) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE holdings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_holdings" ON holdings;
CREATE POLICY "select_own_holdings" ON holdings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_holdings" ON holdings;
CREATE POLICY "insert_own_holdings" ON holdings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_holdings" ON holdings;
CREATE POLICY "update_own_holdings" ON holdings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_holdings" ON holdings;
CREATE POLICY "delete_own_holdings" ON holdings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_holdings_user_id ON holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_holdings_ticker ON holdings(ticker);

-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('buy', 'sell', 'dividend', 'deposit', 'withdrawal', 'fee')),
  status text NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'failed')),
  ticker text,
  investment_name text,
  shares numeric(14,4),
  price_per_share numeric(14,4),
  total_amount numeric(14,2) NOT NULL DEFAULT 0,
  fee numeric(14,2) NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_transactions" ON transactions;
CREATE POLICY "select_own_transactions" ON transactions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_transactions" ON transactions;
CREATE POLICY "insert_own_transactions" ON transactions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_transactions" ON transactions;
CREATE POLICY "update_own_transactions" ON transactions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_transactions" ON transactions;
CREATE POLICY "delete_own_transactions" ON transactions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  investment_id uuid REFERENCES investments(id) ON DELETE SET NULL,
  ticker text NOT NULL,
  name text NOT NULL,
  price numeric(14,4) NOT NULL DEFAULT 0,
  daily_change_pct numeric(8,4) NOT NULL DEFAULT 0,
  added_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_watchlists" ON watchlists;
CREATE POLICY "select_own_watchlists" ON watchlists FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_watchlists" ON watchlists;
CREATE POLICY "insert_own_watchlists" ON watchlists FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_watchlists" ON watchlists;
CREATE POLICY "update_own_watchlists" ON watchlists FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_watchlists" ON watchlists;
CREATE POLICY "delete_own_watchlists" ON watchlists FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON watchlists(user_id);

-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  target_amount numeric(14,2) NOT NULL DEFAULT 0,
  current_amount numeric(14,2) NOT NULL DEFAULT 0,
  target_date date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  icon text NOT NULL DEFAULT 'Target',
  color text NOT NULL DEFAULT '#2d9568',
  monthly_contribution numeric(14,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_goals" ON goals;
CREATE POLICY "select_own_goals" ON goals FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_goals" ON goals;
CREATE POLICY "insert_own_goals" ON goals FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_goals" ON goals;
CREATE POLICY "update_own_goals" ON goals FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_goals" ON goals;
CREATE POLICY "delete_own_goals" ON goals FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);

-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS goal_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id uuid NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  note text,
  date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE goal_contributions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_goal_contributions" ON goal_contributions;
CREATE POLICY "select_own_goal_contributions" ON goal_contributions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_goal_contributions" ON goal_contributions;
CREATE POLICY "insert_own_goal_contributions" ON goal_contributions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_goal_contributions" ON goal_contributions;
CREATE POLICY "update_own_goal_contributions" ON goal_contributions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_goal_contributions" ON goal_contributions;
CREATE POLICY "delete_own_goal_contributions" ON goal_contributions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_goal_contributions_goal_id ON goal_contributions(goal_id);
CREATE INDEX IF NOT EXISTS idx_goal_contributions_user_id ON goal_contributions(user_id);

-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS recurring_investments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  investment_id uuid REFERENCES investments(id) ON DELETE SET NULL,
  ticker text NOT NULL,
  name text NOT NULL,
  amount numeric(14,2) NOT NULL DEFAULT 0,
  frequency text NOT NULL DEFAULT 'monthly' CHECK (frequency IN ('weekly', 'biweekly', 'monthly')),
  next_run_date date NOT NULL DEFAULT (now()::date + interval '30 days'),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE recurring_investments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_recurring" ON recurring_investments;
CREATE POLICY "select_own_recurring" ON recurring_investments FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_recurring" ON recurring_investments;
CREATE POLICY "insert_own_recurring" ON recurring_investments FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_recurring" ON recurring_investments;
CREATE POLICY "update_own_recurring" ON recurring_investments FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_recurring" ON recurring_investments;
CREATE POLICY "delete_own_recurring" ON recurring_investments FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_recurring_user_id ON recurring_investments(user_id);
CREATE INDEX IF NOT EXISTS idx_recurring_active ON recurring_investments(is_active) WHERE is_active = true;

-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'system' CHECK (type IN ('price_alert', 'goal_update', 'dividend', 'education', 'system')),
  title text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  action_label text,
  action_url text,
  date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_notifications" ON notifications;
CREATE POLICY "delete_own_notifications" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, read) WHERE read = false;

-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS portfolio_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT (now()::date),
  total_value numeric(14,2) NOT NULL DEFAULT 0,
  cash_balance numeric(14,2) NOT NULL DEFAULT 0,
  invested_value numeric(14,2) NOT NULL DEFAULT 0,
  total_gain numeric(14,2) NOT NULL DEFAULT 0,
  total_gain_pct numeric(8,4) NOT NULL DEFAULT 0,
  day_change numeric(14,2) NOT NULL DEFAULT 0,
  day_change_pct numeric(8,4) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE portfolio_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_snapshots" ON portfolio_snapshots;
CREATE POLICY "select_own_snapshots" ON portfolio_snapshots FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_snapshots" ON portfolio_snapshots;
CREATE POLICY "insert_own_snapshots" ON portfolio_snapshots FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_snapshots" ON portfolio_snapshots;
CREATE POLICY "update_own_snapshots" ON portfolio_snapshots FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_snapshots" ON portfolio_snapshots;
CREATE POLICY "delete_own_snapshots" ON portfolio_snapshots FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_snapshots_user_id ON portfolio_snapshots(user_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_date ON portfolio_snapshots(date DESC);

-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS dividends (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  investment_id uuid REFERENCES investments(id) ON DELETE SET NULL,
  ticker text NOT NULL,
  name text NOT NULL,
  shares numeric(14,4) NOT NULL DEFAULT 0,
  amount_per_share numeric(14,4) NOT NULL DEFAULT 0,
  total_amount numeric(14,2) NOT NULL DEFAULT 0,
  pay_date date NOT NULL,
  status text NOT NULL DEFAULT 'paid' CHECK (status IN ('paid', 'upcoming')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE dividends ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_dividends" ON dividends;
CREATE POLICY "select_own_dividends" ON dividends FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_dividends" ON dividends;
CREATE POLICY "insert_own_dividends" ON dividends FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_dividends" ON dividends;
CREATE POLICY "update_own_dividends" ON dividends FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_dividends" ON dividends;
CREATE POLICY "delete_own_dividends" ON dividends FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_dividends_user_id ON dividends(user_id);
CREATE INDEX IF NOT EXISTS idx_dividends_pay_date ON dividends(pay_date DESC);

-- ============================================================================
-- UPDATED_AT TRIGGER (shared)
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY['profiles', 'cash_accounts', 'holdings', 'goals', 'recurring_investments', 'investments'])
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_updated_at ON %I', t);
    EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t);
  END LOOP;
END $$;
