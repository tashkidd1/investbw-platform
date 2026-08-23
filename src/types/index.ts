// ============================================================================
// InvestBW — Core Type Definitions
// All financial values are simulated/demo. No real securities are traded.
// ============================================================================

// --- Enums & Unions --------------------------------------------------------

export type InvestmentCategory = 'equity' | 'etf' | 'reit' | 'bond';
export type MarketRegion = 'botswana' | 'global';
export type TransactionType = 'buy' | 'sell' | 'dividend' | 'deposit' | 'withdrawal' | 'fee' | 'goal_contribution';
export type TransactionStatus = 'completed' | 'pending' | 'failed';
export type GoalStatus = 'active' | 'completed' | 'paused';
export type NotificationType = 'price_alert' | 'goal_update' | 'dividend' | 'education' | 'system';
export type RecurringFrequency = 'weekly' | 'biweekly' | 'monthly';

// --- Core Entities ---------------------------------------------------------

export interface Investment {
  id: string;
  ticker: string;
  name: string;
  category: InvestmentCategory;
  sector: string;
  market: MarketRegion;
  price: number;
  dailyChangePct: number;
  marketCap?: number;
  peRatio?: number;
  dividendYield?: number;
  description: string;
  logoColor?: string;
  historicalPrices: HistoricalPrice[];
  isFeatured?: boolean;
}

export interface HistoricalPrice {
  date: string; // ISO date
  price: number;
}

export interface Holding {
  id: string;
  investmentId: string;
  ticker: string;
  name: string;
  shares: number;
  avgCostPerShare: number;
  currentPrice: number;
  totalCost: number;
  marketValue: number;
  unrealizedGain: number;
  unrealizedGainPct: number;
  dayChange: number;
  dayChangePct: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  ticker?: string;
  investmentName?: string;
  goalName?: string;
  shares?: number;
  pricePerShare?: number;
  totalAmount: number;
  fee?: number;
  date: string; // ISO timestamp
  description: string;
}

export interface CashAccount {
  id: string;
  balance: number;
  currency: string;
  pendingDeposits: number;
}

export interface WatchlistItem {
  id: string;
  investmentId: string;
  ticker: string;
  name: string;
  price: number;
  dailyChangePct: number;
  addedAt: string;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: GoalStatus;
  icon: string;
  color: string;
  monthlyContribution: number;
  contributions: GoalContribution[];
  completedAt?: string | null;
}

export interface GoalContribution {
  id: string;
  goalId: string;
  amount: number;
  date: string;
  note?: string;
}

export interface RecurringInvestment {
  id: string;
  investmentId: string;
  ticker: string;
  name: string;
  amount: number;
  frequency: RecurringFrequency;
  nextRunDate: string;
  isActive: boolean;
  createdAt: string;
  demoIntervalMinutes?: number | null;
  lastRunAt?: string | null;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  date: string;
  actionLabel?: string;
  actionUrl?: string;
}

export interface EducationalContent {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTimeMinutes: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  content: string;
  tags: string[];
  publishedAt: string;
}

export interface PortfolioSnapshot {
  id: string;
  date: string;
  totalValue: number;
  cashBalance: number;
  investedValue: number;
  totalGain: number;
  totalGainPct: number;
  dayChange: number;
  dayChangePct: number;
}

export interface Dividend {
  id: string;
  investmentId: string;
  ticker: string;
  name: string;
  shares: number;
  amountPerShare: number;
  totalAmount: number;
  payDate: string;
  status: 'paid' | 'upcoming';
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  avatarColor: string;
  joinedDate: string;
  isDemo: boolean;
}

// --- Aggregate / Computed Types --------------------------------------------

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPct: number;
  dayChange: number;
  dayChangePct: number;
  cashBalance: number;
  investedValue: number;
  allocation: PortfolioAllocation[];
}

export interface PortfolioAllocation {
  category: InvestmentCategory | 'cash';
  label: string;
  value: number;
  pct: number;
  color: string;
}

// --- Chat / AI Assistant ---------------------------------------------------

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isDisclaimer?: boolean;
}
