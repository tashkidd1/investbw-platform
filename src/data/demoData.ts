import type {
  Investment,
  Holding,
  Transaction,
  Goal,
  Notification,
  Dividend,
  RecurringInvestment,
  PortfolioSnapshot,
  CashAccount,
  UserProfile,
  WatchlistItem,
} from '@/types';

// ============================================================================
// DEMO DATA — All values are fictional and for demonstration only.
// No real securities, real money, or real market data are involved.
// ============================================================================

const DEMO_INVESTMENTS: Investment[] = [
  {
    id: 'demo-fnbb',
    ticker: 'FNBB',
    name: 'First National Bank Botswana',
    category: 'equity',
    sector: 'Banking',
    market: 'botswana',
    price: 1520.00,
    dailyChangePct: 0.65,
    marketCap: 15200000000,
    peRatio: 8.5,
    dividendYield: 0.0385,
    description: 'First National Bank Botswana is one of the largest commercial banks in Botswana, providing retail, corporate, and investment banking services across the country.',
    logoColor: '#1B4F8C',
    isFeatured: true,
    historicalPrices: [
      { date: '2026-05-01', price: 1450 }, { date: '2026-05-15', price: 1465 },
      { date: '2026-06-01', price: 1470 }, { date: '2026-06-15', price: 1485 },
      { date: '2026-07-01', price: 1490 }, { date: '2026-07-15', price: 1505 },
      { date: '2026-07-27', price: 1520 },
    ],
  },
  {
    id: 'demo-chop',
    ticker: 'CHOP',
    name: 'Choppies Enterprises',
    category: 'equity',
    sector: 'Retail',
    market: 'botswana',
    price: 0.52,
    dailyChangePct: -1.20,
    marketCap: 650000000,
    peRatio: 12.3,
    dividendYield: 0.0200,
    description: 'Choppies Enterprises is a leading supermarket chain in Botswana with operations across Southern Africa, serving everyday consumer needs.',
    logoColor: '#D32F2F',
    isFeatured: true,
    historicalPrices: [
      { date: '2026-05-01', price: 0.58 }, { date: '2026-05-15', price: 0.56 },
      { date: '2026-06-01', price: 0.55 }, { date: '2026-06-15', price: 0.54 },
      { date: '2026-07-01', price: 0.53 }, { date: '2026-07-15', price: 0.53 },
      { date: '2026-07-27', price: 0.52 },
    ],
  },
  {
    id: 'demo-lets',
    ticker: 'LETS',
    name: 'Letshego Holdings',
    category: 'equity',
    sector: 'Financial Services',
    market: 'botswana',
    price: 1.85,
    dailyChangePct: 0.80,
    marketCap: 4200000000,
    peRatio: 10.2,
    dividendYield: 0.0450,
    description: 'Letshego Holdings is a pan-African financial services group specializing in microfinance and consumer lending across multiple African markets.',
    logoColor: '#2E7D32',
    isFeatured: true,
    historicalPrices: [
      { date: '2026-05-01', price: 1.65 }, { date: '2026-05-15', price: 1.70 },
      { date: '2026-06-01', price: 1.72 }, { date: '2026-06-15', price: 1.75 },
      { date: '2026-07-01', price: 1.78 }, { date: '2026-07-15', price: 1.82 },
      { date: '2026-07-27', price: 1.85 },
    ],
  },
  {
    id: 'demo-sech',
    ticker: 'SECH',
    name: 'Sechaba Brewery',
    category: 'equity',
    sector: 'Consumer Goods',
    market: 'botswana',
    price: 9.20,
    dailyChangePct: 0.30,
    marketCap: 2100000000,
    peRatio: 15.1,
    dividendYield: 0.0300,
    description: 'Sechaba Brewery Holdings produces and distributes beverages in Botswana, known for popular local beer brands.',
    logoColor: '#FF6F00',
    historicalPrices: [
      { date: '2026-05-01', price: 8.80 }, { date: '2026-05-15', price: 8.90 },
      { date: '2026-06-01', price: 8.95 }, { date: '2026-06-15', price: 9.00 },
      { date: '2026-07-01', price: 9.05 }, { date: '2026-07-15', price: 9.12 },
      { date: '2026-07-27', price: 9.20 },
    ],
  },
  {
    id: 'demo-bse',
    ticker: 'BSE',
    name: 'Botswana Stock Exchange',
    category: 'equity',
    sector: 'Financial Services',
    market: 'botswana',
    price: 4.75,
    dailyChangePct: 1.10,
    marketCap: 950000000,
    peRatio: 18.5,
    dividendYield: 0.0250,
    description: 'Botswana Stock Exchange is the national stock exchange of Botswana, facilitating trading of equities, bonds, and other securities.',
    logoColor: '#00695C',
    historicalPrices: [
      { date: '2026-05-01', price: 4.30 }, { date: '2026-05-15', price: 4.40 },
      { date: '2026-06-01', price: 4.50 }, { date: '2026-06-15', price: 4.55 },
      { date: '2026-07-01', price: 4.60 }, { date: '2026-07-15', price: 4.68 },
      { date: '2026-07-27', price: 4.75 },
    ],
  },
  {
    id: 'demo-btc',
    ticker: 'BTC',
    name: 'Botswana Telecommunications Corp',
    category: 'equity',
    sector: 'Telecommunications',
    market: 'botswana',
    price: 3.40,
    dailyChangePct: -0.50,
    marketCap: 3400000000,
    peRatio: 11.8,
    dividendYield: 0.0400,
    description: 'Botswana Telecommunications Corporation provides fixed and mobile telecommunications services nationwide.',
    logoColor: '#1565C0',
    historicalPrices: [
      { date: '2026-05-01', price: 3.50 }, { date: '2026-05-15', price: 3.48 },
      { date: '2026-06-01', price: 3.45 }, { date: '2026-06-15', price: 3.44 },
      { date: '2026-07-01', price: 3.43 }, { date: '2026-07-15', price: 3.42 },
      { date: '2026-07-27', price: 3.40 },
    ],
  },
  {
    id: 'demo-betf',
    ticker: 'BETF',
    name: 'Botswana Diversified ETF',
    category: 'etf',
    sector: 'Diversified',
    market: 'botswana',
    price: 28.50,
    dailyChangePct: 0.45,
    marketCap: 500000000,
    dividendYield: 0.0300,
    description: 'A diversified exchange-traded fund tracking a basket of BSE-listed companies, providing broad exposure to the Botswana equity market.',
    logoColor: '#5E35B1',
    isFeatured: true,
    historicalPrices: [
      { date: '2026-05-01', price: 27.00 }, { date: '2026-05-15', price: 27.30 },
      { date: '2026-06-01', price: 27.60 }, { date: '2026-06-15', price: 27.90 },
      { date: '2026-07-01', price: 28.10 }, { date: '2026-07-15', price: 28.30 },
      { date: '2026-07-27', price: 28.50 },
    ],
  },
  {
    id: 'demo-afreit',
    ticker: 'AFREIT',
    name: 'African Real Estate REIT',
    category: 'reit',
    sector: 'Real Estate',
    market: 'botswana',
    price: 12.80,
    dailyChangePct: 0.20,
    marketCap: 800000000,
    dividendYield: 0.0650,
    description: 'A real estate investment trust focusing on commercial properties across Botswana and Southern Africa, offering regular income through rental yields.',
    logoColor: '#6D4C41',
    historicalPrices: [
      { date: '2026-05-01', price: 12.20 }, { date: '2026-05-15', price: 12.35 },
      { date: '2026-06-01', price: 12.45 }, { date: '2026-06-15', price: 12.55 },
      { date: '2026-07-01', price: 12.65 }, { date: '2026-07-15', price: 12.72 },
      { date: '2026-07-27', price: 12.80 },
    ],
  },
  {
    id: 'demo-bwgb',
    ticker: 'BWGB',
    name: 'Botswana Government Bond 5yr',
    category: 'bond',
    sector: 'Government',
    market: 'botswana',
    price: 100.00,
    dailyChangePct: 0.05,
    dividendYield: 0.0850,
    description: 'A 5-year Botswana government bond offering fixed interest payments, considered one of the safest investment options in the country.',
    logoColor: '#455A64',
    historicalPrices: [
      { date: '2026-05-01', price: 99.80 }, { date: '2026-05-15', price: 99.85 },
      { date: '2026-06-01', price: 99.90 }, { date: '2026-06-15', price: 99.92 },
      { date: '2026-07-01', price: 99.95 }, { date: '2026-07-15', price: 99.98 },
      { date: '2026-07-27', price: 100.00 },
    ],
  },
  {
    id: 'demo-gspx',
    ticker: 'GSPX',
    name: 'Global S&P 500 Index ETF',
    category: 'etf',
    sector: 'Diversified',
    market: 'global',
    price: 485.00,
    dailyChangePct: 0.90,
    dividendYield: 0.0150,
    description: 'An ETF tracking the S&P 500 index, providing exposure to 500 large-cap US companies across all sectors of the global economy.',
    logoColor: '#1976D2',
    isFeatured: true,
    historicalPrices: [
      { date: '2026-05-01', price: 455 }, { date: '2026-05-15', price: 462 },
      { date: '2026-06-01', price: 468 }, { date: '2026-06-15', price: 472 },
      { date: '2026-07-01', price: 478 }, { date: '2026-07-15', price: 482 },
      { date: '2026-07-27', price: 485 },
    ],
  },
  {
    id: 'demo-gtech',
    ticker: 'GTECH',
    name: 'Global Tech Giants ETF',
    category: 'etf',
    sector: 'Technology',
    market: 'global',
    price: 210.00,
    dailyChangePct: 1.25,
    dividendYield: 0.0080,
    description: 'An ETF focusing on major technology companies worldwide, offering growth potential through exposure to the global tech sector.',
    logoColor: '#7B1FA2',
    isFeatured: true,
    historicalPrices: [
      { date: '2026-05-01', price: 185 }, { date: '2026-05-15', price: 192 },
      { date: '2026-06-01', price: 198 }, { date: '2026-06-15', price: 202 },
      { date: '2026-07-01', price: 205 }, { date: '2026-07-15', price: 208 },
      { date: '2026-07-27', price: 210 },
    ],
  },
  {
    id: 'demo-gold',
    ticker: 'GOLD',
    name: 'Global Gold Commodity ETF',
    category: 'etf',
    sector: 'Commodities',
    market: 'global',
    price: 95.50,
    dailyChangePct: -0.40,
    dividendYield: 0,
    description: 'An ETF tracking the price of gold, offering a hedge against inflation and currency fluctuations through exposure to precious metals.',
    logoColor: '#F9A825',
    historicalPrices: [
      { date: '2026-05-01', price: 98.00 }, { date: '2026-05-15', price: 97.50 },
      { date: '2026-06-01', price: 97.00 }, { date: '2026-06-15', price: 96.50 },
      { date: '2026-07-01', price: 96.20 }, { date: '2026-07-15', price: 95.80 },
      { date: '2026-07-27', price: 95.50 },
    ],
  },
];

// --- Demo Holdings (pre-populated portfolio) ---

const DEMO_HOLDINGS: Holding[] = [
  {
    id: 'h-1', investmentId: 'demo-fnbb', ticker: 'FNBB', name: 'First National Bank Botswana',
    shares: 3, avgCostPerShare: 1480, currentPrice: 1520,
    totalCost: 4440, marketValue: 4560, unrealizedGain: 120, unrealizedGainPct: 2.70,
    dayChange: 9.75, dayChangePct: 0.65,
  },
  {
    id: 'h-2', investmentId: 'demo-lets', ticker: 'LETS', name: 'Letshego Holdings',
    shares: 800, avgCostPerShare: 1.70, currentPrice: 1.85,
    totalCost: 1360, marketValue: 1480, unrealizedGain: 120, unrealizedGainPct: 8.82,
    dayChange: 11.84, dayChangePct: 0.80,
  },
  {
    id: 'h-3', investmentId: 'demo-betf', ticker: 'BETF', name: 'Botswana Diversified ETF',
    shares: 50, avgCostPerShare: 27.50, currentPrice: 28.50,
    totalCost: 1375, marketValue: 1425, unrealizedGain: 50, unrealizedGainPct: 3.64,
    dayChange: 6.41, dayChangePct: 0.45,
  },
  {
    id: 'h-4', investmentId: 'demo-gspx', ticker: 'GSPX', name: 'Global S&P 500 Index ETF',
    shares: 4, avgCostPerShare: 470, currentPrice: 485,
    totalCost: 1880, marketValue: 1940, unrealizedGain: 60, unrealizedGainPct: 3.19,
    dayChange: 17.46, dayChangePct: 0.90,
  },
  {
    id: 'h-5', investmentId: 'demo-afreit', ticker: 'AFREIT', name: 'African Real Estate REIT',
    shares: 80, avgCostPerShare: 12.50, currentPrice: 12.80,
    totalCost: 1000, marketValue: 1024, unrealizedGain: 24, unrealizedGainPct: 2.40,
    dayChange: 2.05, dayChangePct: 0.20,
  },
];

// --- Demo Cash Account ---

const DEMO_CASH: CashAccount = {
  id: 'cash-demo',
  // 10000 deposit - 4455 (FNBB+fee) - 1370 (LETS+fee) - 1385 (BETF+fee) - 1892 (GSPX+fee) - 1010 (AFREIT+fee) + 305.96 (dividends) = 193.96
  // Rounded to 5000 to give demo users room to test buying
  balance: 5000,
  currency: 'BWP',
  pendingDeposits: 0,
};

// --- Demo Transactions ---

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const DEMO_TRANSACTIONS: Transaction[] = [
  { id: 't-1', type: 'deposit', status: 'completed', totalAmount: 10000, fee: 0, date: daysAgo(30), description: 'Initial demo deposit' },
  { id: 't-2', type: 'buy', status: 'completed', ticker: 'FNBB', investmentName: 'First National Bank Botswana', shares: 3, pricePerShare: 1480, totalAmount: 4440, fee: 15, date: daysAgo(28), description: 'Bought 3 shares of FNBB' },
  { id: 't-3', type: 'buy', status: 'completed', ticker: 'LETS', investmentName: 'Letshego Holdings', shares: 800, pricePerShare: 1.70, totalAmount: 1360, fee: 10, date: daysAgo(25), description: 'Bought 800 shares of LETS' },
  { id: 't-4', type: 'buy', status: 'completed', ticker: 'BETF', investmentName: 'Botswana Diversified ETF', shares: 50, pricePerShare: 27.50, totalAmount: 1375, fee: 10, date: daysAgo(20), description: 'Bought 50 shares of BETF' },
  { id: 't-5', type: 'buy', status: 'completed', ticker: 'GSPX', investmentName: 'Global S&P 500 Index ETF', shares: 4, pricePerShare: 470, totalAmount: 1880, fee: 12, date: daysAgo(18), description: 'Bought 4 shares of GSPX' },
  { id: 't-6', type: 'buy', status: 'completed', ticker: 'AFREIT', investmentName: 'African Real Estate REIT', shares: 80, pricePerShare: 12.50, totalAmount: 1000, fee: 10, date: daysAgo(15), description: 'Bought 80 shares of AFREIT' },
  { id: 't-7', type: 'dividend', status: 'completed', ticker: 'FNBB', investmentName: 'First National Bank Botswana', shares: 3, pricePerShare: 58.52, totalAmount: 175.56, fee: 0, date: daysAgo(10), description: 'Dividend payment from FNBB' },
  { id: 't-8', type: 'dividend', status: 'completed', ticker: 'AFREIT', investmentName: 'African Real Estate REIT', shares: 80, pricePerShare: 0.83, totalAmount: 66.40, fee: 0, date: daysAgo(7), description: 'Dividend payment from AFREIT' },
  { id: 't-9', type: 'dividend', status: 'completed', ticker: 'LETS', investmentName: 'Letshego Holdings', shares: 800, pricePerShare: 0.08, totalAmount: 64.00, fee: 0, date: daysAgo(5), description: 'Dividend payment from LETS' },
];

// --- Demo Goals ---

const DEMO_GOALS: Goal[] = [
  {
    id: 'g-1', name: 'Home Deposit', description: 'Saving for a down payment on a house',
    targetAmount: 150000, currentAmount: 42500, targetDate: '2028-06-01',
    status: 'active', icon: 'Home', color: '#2d9568', monthlyContribution: 2000, completedAt: null,
    contributions: [
      { id: 'gc-1', goalId: 'g-1', amount: 5000, date: daysAgo(90), note: 'Initial contribution' },
      { id: 'gc-2', goalId: 'g-1', amount: 2000, date: daysAgo(60) },
      { id: 'gc-3', goalId: 'g-1', amount: 2000, date: daysAgo(30) },
      { id: 'gc-4', goalId: 'g-1', amount: 2000, date: daysAgo(1) },
    ],
  },
  {
    id: 'g-2', name: 'Children Education', description: 'University fund for my children',
    targetAmount: 200000, currentAmount: 18000, targetDate: '2032-01-01',
    status: 'active', icon: 'GraduationCap', color: '#1B4F8C', monthlyContribution: 1500, completedAt: null,
    contributions: [
      { id: 'gc-5', goalId: 'g-2', amount: 3000, date: daysAgo(60), note: 'Initial contribution' },
      { id: 'gc-6', goalId: 'g-2', amount: 1500, date: daysAgo(30) },
    ],
  },
  {
    id: 'g-3', name: 'Retirement Fund', description: 'Long-term retirement savings',
    targetAmount: 1000000, currentAmount: 75000, targetDate: '2046-01-01',
    status: 'active', icon: 'PiggyBank', color: '#FF6F00', monthlyContribution: 3000, completedAt: null,
    contributions: [
      { id: 'gc-7', goalId: 'g-3', amount: 10000, date: daysAgo(120), note: 'Initial contribution' },
      { id: 'gc-8', goalId: 'g-3', amount: 3000, date: daysAgo(90) },
      { id: 'gc-9', goalId: 'g-3', amount: 3000, date: daysAgo(60) },
      { id: 'gc-10', goalId: 'g-3', amount: 3000, date: daysAgo(30) },
    ],
  },
  {
    id: 'g-4', name: 'Emergency Fund', description: '6 months of living expenses saved',
    targetAmount: 30000, currentAmount: 30000, targetDate: daysAgo(5).split('T')[0],
    status: 'completed', icon: 'ShieldCheck', color: '#1565C0', monthlyContribution: 1000, completedAt: daysAgo(5),
    contributions: [
      { id: 'gc-11', goalId: 'g-4', amount: 5000, date: daysAgo(120), note: 'Initial contribution' },
      { id: 'gc-12', goalId: 'g-4', amount: 5000, date: daysAgo(90) },
      { id: 'gc-13', goalId: 'g-4', amount: 5000, date: daysAgo(60) },
      { id: 'gc-14', goalId: 'g-4', amount: 5000, date: daysAgo(30) },
      { id: 'gc-15', goalId: 'g-4', amount: 5000, date: daysAgo(5) },
      { id: 'gc-16', goalId: 'g-4', amount: 10000, date: daysAgo(5) },
    ],
  },
];

// --- Demo Notifications ---

const DEMO_NOTIFICATIONS: Notification[] = [
  { id: 'n-1', type: 'dividend', title: 'Dividend Received', message: 'You received P175.56 in dividends from FNBB.', read: false, date: daysAgo(10), actionLabel: 'View', actionUrl: '/transactions' },
  { id: 'n-2', type: 'price_alert', title: 'Price Alert', message: 'GSPX has risen above your target of P480.', read: false, date: daysAgo(3), actionLabel: 'View', actionUrl: '/markets' },
  { id: 'n-3', type: 'goal_update', title: 'Goal Milestone', message: 'Your Home Deposit goal has reached 28% of target.', read: false, date: daysAgo(2), actionLabel: 'View', actionUrl: '/goals' },
  { id: 'n-4', type: 'education', title: 'New Article Available', message: 'Learn about Goal-Based Investing in the Learn section.', read: true, date: daysAgo(4), actionLabel: 'Read', actionUrl: '/learn' },
  { id: 'n-5', type: 'system', title: 'Welcome to InvestBW', message: 'Your demo account is ready with P10,000 virtual cash. Explore freely!', read: true, date: daysAgo(30) },
];

// --- Demo Dividends ---

const DEMO_DIVIDENDS: Dividend[] = [
  { id: 'd-1', investmentId: 'demo-fnbb', ticker: 'FNBB', name: 'First National Bank Botswana', shares: 3, amountPerShare: 58.52, totalAmount: 175.56, payDate: daysAgo(10).split('T')[0], status: 'paid' },
  { id: 'd-2', investmentId: 'demo-afreit', ticker: 'AFREIT', name: 'African Real Estate REIT', shares: 80, amountPerShare: 0.83, totalAmount: 66.40, payDate: daysAgo(7).split('T')[0], status: 'paid' },
  { id: 'd-3', investmentId: 'demo-lets', ticker: 'LETS', name: 'Letshego Holdings', shares: 800, amountPerShare: 0.08, totalAmount: 64.00, payDate: daysAgo(5).split('T')[0], status: 'paid' },
  { id: 'd-4', investmentId: 'demo-fnbb', ticker: 'FNBB', name: 'First National Bank Botswana', shares: 3, amountPerShare: 58.52, totalAmount: 175.56, payDate: daysAgo(-60).split('T')[0], status: 'upcoming' },
];

// --- Demo Recurring Investments ---

const DEMO_RECURRING: RecurringInvestment[] = [
  { id: 'r-1', investmentId: 'demo-betf', ticker: 'BETF', name: 'Botswana Diversified ETF', amount: 500, frequency: 'monthly', nextRunDate: daysAgo(-3).split('T')[0], isActive: true, createdAt: daysAgo(20), demoIntervalMinutes: null, lastRunAt: null },
  { id: 'r-2', investmentId: 'demo-gspx', ticker: 'GSPX', name: 'Global S&P 500 Index ETF', amount: 1000, frequency: 'monthly', nextRunDate: daysAgo(-10).split('T')[0], isActive: true, createdAt: daysAgo(15), demoIntervalMinutes: null, lastRunAt: null },
];

// --- Demo Watchlist ---

const DEMO_WATCHLIST: WatchlistItem[] = [
  { id: 'w-1', investmentId: 'demo-sech', ticker: 'SECH', name: 'Sechaba Brewery', price: 9.20, dailyChangePct: 0.30, addedAt: daysAgo(12) },
  { id: 'w-2', investmentId: 'demo-bse', ticker: 'BSE', name: 'Botswana Stock Exchange', price: 4.75, dailyChangePct: 1.10, addedAt: daysAgo(8) },
  { id: 'w-3', investmentId: 'demo-gtech', ticker: 'GTECH', name: 'Global Tech Giants ETF', price: 210.00, dailyChangePct: 1.25, addedAt: daysAgo(5) },
  { id: 'w-4', investmentId: 'demo-gold', ticker: 'GOLD', name: 'Global Gold Commodity ETF', price: 95.50, dailyChangePct: -0.40, addedAt: daysAgo(2) },
];

// --- Demo Portfolio Snapshots (for chart) ---

function generateSnapshots(): PortfolioSnapshot[] {
  const snapshots: PortfolioSnapshot[] = [];
  let value = 9000;
  const cashStart = 945;
  for (let i = 30; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const invested = value - cashStart;
    const gain = invested - 10055;
    const gainPct = (gain / 10055) * 100;
    const dayChange = (Math.random() - 0.45) * 80;
    const dayChangePct = (dayChange / value) * 100;
    snapshots.push({
      id: `s-${i}`,
      date: d.toISOString().split('T')[0],
      totalValue: Math.round(value * 100) / 100,
      cashBalance: cashStart,
      investedValue: Math.round(invested * 100) / 100,
      totalGain: Math.round(gain * 100) / 100,
      totalGainPct: Math.round(gainPct * 100) / 100,
      dayChange: Math.round(dayChange * 100) / 100,
      dayChangePct: Math.round(dayChangePct * 100) / 100,
    });
    value += dayChange;
  }
  // Ensure last snapshot matches actual portfolio value
  const investedValue = DEMO_HOLDINGS.reduce((sum, h) => sum + h.marketValue, 0);
  const totalValue = investedValue + DEMO_CASH.balance;
  const totalCost = DEMO_HOLDINGS.reduce((sum, h) => sum + h.totalCost, 0);
  const totalGain = investedValue - totalCost;
  const totalGainPct = (totalGain / totalCost) * 100;
  if (snapshots.length > 0) {
    const last = snapshots[snapshots.length - 1];
    last.totalValue = Math.round(totalValue * 100) / 100;
    last.investedValue = Math.round(investedValue * 100) / 100;
    last.cashBalance = DEMO_CASH.balance;
    last.totalGain = Math.round(totalGain * 100) / 100;
    last.totalGainPct = Math.round(totalGainPct * 100) / 100;
  }
  return snapshots;
}

const DEMO_SNAPSHOTS = generateSnapshots();

// --- Demo User Profile ---

const DEMO_PROFILE: UserProfile = {
  id: 'demo-user',
  displayName: 'Demo Investor',
  email: 'demo@investbw.app',
  avatarColor: '#2d9568',
  joinedDate: daysAgo(30),
  isDemo: true,
};

export const demoData = {
  profile: DEMO_PROFILE,
  investments: DEMO_INVESTMENTS,
  holdings: DEMO_HOLDINGS,
  cash: DEMO_CASH,
  transactions: DEMO_TRANSACTIONS,
  goals: DEMO_GOALS,
  notifications: DEMO_NOTIFICATIONS,
  dividends: DEMO_DIVIDENDS,
  recurring: DEMO_RECURRING,
  watchlist: DEMO_WATCHLIST,
  snapshots: DEMO_SNAPSHOTS,
};
