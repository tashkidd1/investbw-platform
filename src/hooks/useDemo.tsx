import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import type {
  Holding,
  Transaction,
  CashAccount,
  Goal,
  Notification,
  WatchlistItem,
  Dividend,
  RecurringInvestment,
  PortfolioSnapshot,
  UserProfile,
  RecurringFrequency,
} from '@/types';
import { demoData } from '@/data/demoData';

interface DemoContextValue {
  isDemoMode: boolean;
  enterDemo: () => void;
  exitDemo: () => void;
  profile: UserProfile | null;
  holdings: Holding[];
  cash: CashAccount | null;
  transactions: Transaction[];
  goals: Goal[];
  notifications: Notification[];
  dividends: Dividend[];
  recurring: RecurringInvestment[];
  watchlist: WatchlistItem[];
  snapshots: PortfolioSnapshot[];
  buyInvestment: (investmentId: string, ticker: string, name: string, shares: number, pricePerShare: number) => boolean;
  sellInvestment: (investmentId: string, ticker: string, name: string, shares: number, pricePerShare: number) => boolean;
  addCash: (amount: number) => void;
  withdrawCash: (amount: number) => boolean;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addToWatchlist: (item: Omit<WatchlistItem, 'id' | 'addedAt'>) => void;
  removeFromWatchlist: (id: string) => void;
  createGoal: (goal: Omit<Goal, 'id' | 'contributions' | 'completedAt'>) => void;
  contributeToGoal: (goalId: string, amount: number, note?: string) => boolean;
  toggleRecurring: (id: string) => void;
  createRecurring: (plan: Omit<RecurringInvestment, 'id' | 'createdAt' | 'lastRunAt' | 'isActive'>) => void;
  runRecurringNow: (id: string) => { success: boolean; message: string };
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [cash, setCash] = useState<CashAccount | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dividends, setDividends] = useState<Dividend[]>([]);
  const [recurring, setRecurring] = useState<RecurringInvestment[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [snapshots, setSnapshots] = useState<PortfolioSnapshot[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Refs for use inside interval callbacks without re-creating callbacks
  const cashRef = useRef<CashAccount | null>(null);
  const holdingsRef = useRef<Holding[]>([]);
  const recurringRef = useRef<RecurringInvestment[]>([]);
  cashRef.current = cash;
  holdingsRef.current = holdings;
  recurringRef.current = recurring;

  const enterDemo = useCallback(() => {
    setIsDemoMode(true);
    setProfile(demoData.profile);
    setHoldings(demoData.holdings);
    setCash(demoData.cash);
    setTransactions(demoData.transactions);
    setGoals(demoData.goals);
    setNotifications(demoData.notifications);
    setDividends(demoData.dividends);
    setRecurring(demoData.recurring);
    setWatchlist(demoData.watchlist);
    setSnapshots(demoData.snapshots);
  }, []);

  const exitDemo = useCallback(() => {
    setIsDemoMode(false);
    setProfile(null);
    setHoldings([]);
    setCash(null);
    setTransactions([]);
    setGoals([]);
    setNotifications([]);
    setDividends([]);
    setRecurring([]);
    setWatchlist([]);
    setSnapshots([]);
  }, []);

  const buyInvestment = useCallback(
    (investmentId: string, ticker: string, name: string, shares: number, pricePerShare: number): boolean => {
      const totalCost = shares * pricePerShare;
      const fee = Math.max(10, totalCost * 0.005);
      const totalWithFee = totalCost + fee;

      if (!cash || totalWithFee > cash.balance) return false;

      setCash((prev) => prev ? { ...prev, balance: prev.balance - totalWithFee } : prev);

      setHoldings((prev) => {
        const existing = prev.find((h) => h.investmentId === investmentId);
        if (existing) {
          const newShares = existing.shares + shares;
          const newAvgCost = (existing.totalCost + totalCost) / newShares;
          const newTotalCost = existing.totalCost + totalCost;
          const newMarketValue = newShares * pricePerShare;
          return prev.map((h) =>
            h.investmentId === investmentId
              ? {
                  ...h,
                  shares: newShares,
                  avgCostPerShare: newAvgCost,
                  totalCost: newTotalCost,
                  currentPrice: pricePerShare,
                  marketValue: newMarketValue,
                  unrealizedGain: newMarketValue - newTotalCost,
                  unrealizedGainPct: ((newMarketValue - newTotalCost) / newTotalCost) * 100,
                }
              : h
          );
        }
        const newHolding: Holding = {
          id: `h-${Date.now()}`,
          investmentId,
          ticker,
          name,
          shares,
          avgCostPerShare: pricePerShare,
          currentPrice: pricePerShare,
          totalCost,
          marketValue: totalCost,
          unrealizedGain: 0,
          unrealizedGainPct: 0,
          dayChange: 0,
          dayChangePct: 0,
        };
        return [...prev, newHolding];
      });

      setTransactions((prev) => [
        {
          id: `t-${Date.now()}`,
          type: 'buy',
          status: 'completed',
          ticker,
          investmentName: name,
          shares,
          pricePerShare,
          totalAmount: totalCost,
          fee,
          date: new Date().toISOString(),
          description: `Bought ${shares} share${shares !== 1 ? 's' : ''} of ${ticker}`,
        },
        ...prev,
      ]);

      return true;
    },
    [cash]
  );

  const sellInvestment = useCallback(
    (investmentId: string, ticker: string, name: string, shares: number, pricePerShare: number): boolean => {
      const holding = holdings.find((h) => h.investmentId === investmentId);
      if (!holding || shares > holding.shares) return false;

      const totalProceeds = shares * pricePerShare;
      const fee = Math.max(10, totalProceeds * 0.005);
      const netProceeds = totalProceeds - fee;

      setCash((prev) => prev ? { ...prev, balance: prev.balance + netProceeds } : prev);

      setHoldings((prev) => {
        return prev
          .map((h) => {
            if (h.investmentId !== investmentId) return h;
            const remaining = h.shares - shares;
            if (remaining <= 0.0001) return null;
            const remainingCost = h.avgCostPerShare * remaining;
            const remainingValue = remaining * pricePerShare;
            return {
              ...h,
              shares: remaining,
              totalCost: remainingCost,
              currentPrice: pricePerShare,
              marketValue: remainingValue,
              unrealizedGain: remainingValue - remainingCost,
              unrealizedGainPct: remainingCost > 0 ? ((remainingValue - remainingCost) / remainingCost) * 100 : 0,
            };
          })
          .filter((h): h is Holding => h !== null);
      });

      setTransactions((prev) => [
        {
          id: `t-${Date.now()}`,
          type: 'sell',
          status: 'completed',
          ticker,
          investmentName: name,
          shares,
          pricePerShare,
          totalAmount: totalProceeds,
          fee,
          date: new Date().toISOString(),
          description: `Sold ${shares} share${shares !== 1 ? 's' : ''} of ${ticker}`,
        },
        ...prev,
      ]);

      return true;
    },
    [holdings]
  );

  const addCash = useCallback((amount: number) => {
    if (amount <= 0) return;
    setCash((prev) => prev ? { ...prev, balance: prev.balance + amount } : prev);
    setTransactions((prev) => [
      {
        id: `t-${Date.now()}`,
        type: 'deposit',
        status: 'completed',
        totalAmount: amount,
        fee: 0,
        date: new Date().toISOString(),
        description: `Cash deposit`,
      },
      ...prev,
    ]);
  }, []);

  const withdrawCash = useCallback((amount: number): boolean => {
    if (!cash || amount <= 0 || amount > cash.balance) return false;
    setCash((prev) => prev ? { ...prev, balance: prev.balance - amount } : prev);
    setTransactions((prev) => [
      {
        id: `t-${Date.now()}`,
        type: 'withdrawal',
        status: 'completed',
        totalAmount: amount,
        fee: 0,
        date: new Date().toISOString(),
        description: `Cash withdrawal`,
      },
      ...prev,
    ]);
    return true;
  }, [cash]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addToWatchlist = useCallback((item: Omit<WatchlistItem, 'id' | 'addedAt'>) => {
    setWatchlist((prev) => {
      if (prev.some((w) => w.investmentId === item.investmentId)) return prev;
      return [...prev, { ...item, id: `w-${Date.now()}`, addedAt: new Date().toISOString() }];
    });
  }, []);

  const removeFromWatchlist = useCallback((id: string) => {
    setWatchlist((prev) => prev.filter((w) => w.id !== id));
  }, []);

  const createGoal = useCallback((goal: Omit<Goal, 'id' | 'contributions' | 'completedAt'>) => {
    setGoals((prev) => [...prev, { ...goal, id: `g-${Date.now()}`, contributions: [], completedAt: null }]);
  }, []);

  const contributeToGoal = useCallback((goalId: string, amount: number, note?: string): boolean => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return false;
    if (goal.status === 'completed') return false;
    if (amount <= 0) return false;
    if (!cash || amount > cash.balance) return false;

    const remaining = goal.targetAmount - goal.currentAmount;
    if (amount > remaining) return false;

    const willComplete = goal.currentAmount + amount >= goal.targetAmount - 0.01;

    // Deduct cash
    setCash((prev) => prev ? { ...prev, balance: prev.balance - amount } : prev);

    // Update goal
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? {
              ...g,
              currentAmount: g.currentAmount + amount,
              status: willComplete ? 'completed' : g.status,
              completedAt: willComplete ? new Date().toISOString() : null,
              contributions: [
                ...g.contributions,
                { id: `gc-${Date.now()}`, goalId, amount, date: new Date().toISOString(), note },
              ],
            }
          : g
      )
    );

    // Create transaction
    setTransactions((prev) => [
      {
        id: `t-${Date.now()}`,
        type: 'goal_contribution',
        status: 'completed',
        goalName: goal.name,
        totalAmount: amount,
        fee: 0,
        date: new Date().toISOString(),
        description: `Goal Contribution — ${goal.name}`,
      },
      ...prev,
    ]);

    // Create notification
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        type: 'goal_update',
        title: willComplete ? 'Goal Completed!' : 'Goal Contribution',
        message: willComplete
          ? `Congratulations! You've completed your goal: ${goal.name}`
          : `You contributed ${amount.toLocaleString()} BWP to ${goal.name}`,
        read: false,
        date: new Date().toISOString(),
        actionLabel: 'View',
        actionUrl: '/app/goals',
      },
      ...prev,
    ]);

    return true;
  }, [goals, cash]);

  const toggleRecurring = useCallback((id: string) => {
    setRecurring((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r))
    );
  }, []);

  const createRecurring = useCallback((plan: Omit<RecurringInvestment, 'id' | 'createdAt' | 'lastRunAt' | 'isActive'>) => {
    setRecurring((prev) => [
      ...prev,
      { ...plan, id: `r-${Date.now()}`, isActive: true, createdAt: new Date().toISOString(), lastRunAt: null },
    ]);
  }, []);

  const runRecurringNow = useCallback((id: string): { success: boolean; message: string } => {
    const plan = recurring.find((r) => r.id === id);
    if (!plan) return { success: false, message: 'Auto-invest plan not found.' };
    if (!plan.isActive) return { success: false, message: 'This plan is paused. Resume it to run investments.' };

    const currentCash = cashRef.current;
    if (!currentCash || plan.amount > currentCash.balance) {
      return { success: false, message: 'Insufficient available cash for this auto-invest purchase.' };
    }

    const investment = demoData.investments.find((i) => i.id === plan.investmentId);
    if (!investment) return { success: false, message: 'Investment not found.' };

    const pricePerShare = investment.price;
    const shares = plan.amount / pricePerShare;
    const fee = Math.max(10, plan.amount * 0.005);
    const totalWithFee = plan.amount + fee;

    if (totalWithFee > currentCash.balance) {
      return { success: false, message: 'Insufficient available cash for this auto-invest purchase (including fee).' };
    }

    // Deduct cash
    setCash((prev) => prev ? { ...prev, balance: prev.balance - totalWithFee } : prev);

    // Update or create holding
    setHoldings((prev) => {
      const existing = prev.find((h) => h.investmentId === plan.investmentId);
      if (existing) {
        const newShares = existing.shares + shares;
        const newTotalCost = existing.totalCost + plan.amount;
        const newMarketValue = newShares * pricePerShare;
        return prev.map((h) =>
          h.investmentId === plan.investmentId
            ? {
                ...h,
                shares: newShares,
                avgCostPerShare: newTotalCost / newShares,
                totalCost: newTotalCost,
                currentPrice: pricePerShare,
                marketValue: newMarketValue,
                unrealizedGain: newMarketValue - newTotalCost,
                unrealizedGainPct: ((newMarketValue - newTotalCost) / newTotalCost) * 100,
              }
            : h
        );
      }
      const newHolding: Holding = {
        id: `h-${Date.now()}`,
        investmentId: plan.investmentId,
        ticker: plan.ticker,
        name: plan.name,
        shares,
        avgCostPerShare: pricePerShare,
        currentPrice: pricePerShare,
        totalCost: plan.amount,
        marketValue: plan.amount,
        unrealizedGain: 0,
        unrealizedGainPct: 0,
        dayChange: 0,
        dayChangePct: 0,
      };
      return [...prev, newHolding];
    });

    // Create transaction
    setTransactions((prev) => [
      {
        id: `t-${Date.now()}`,
        type: 'buy',
        status: 'completed',
        ticker: plan.ticker,
        investmentName: plan.name,
        shares: parseFloat(shares.toFixed(4)),
        pricePerShare,
        totalAmount: plan.amount,
        fee,
        date: new Date().toISOString(),
        description: `Auto-Invest: Bought ${shares.toFixed(2)} shares of ${plan.ticker}`,
      },
      ...prev,
    ]);

    // Update plan lastRunAt and nextRunDate
    setRecurring((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const now = new Date();
        let next = new Date(now);
        if (r.demoIntervalMinutes && r.demoIntervalMinutes > 0) {
          next.setMinutes(next.getMinutes() + r.demoIntervalMinutes);
        } else if (r.frequency === 'weekly') {
          next.setDate(next.getDate() + 7);
        } else if (r.frequency === 'biweekly') {
          next.setDate(next.getDate() + 14);
        } else {
          next.setMonth(next.getMonth() + 1);
        }
        return { ...r, lastRunAt: now.toISOString(), nextRunDate: next.toISOString().split('T')[0] };
      })
    );

    // Notification
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        type: 'system',
        title: 'Auto-Invest Executed',
        message: `Auto-invest purchased ${shares.toFixed(2)} shares of ${plan.ticker} for ${plan.amount.toLocaleString()} BWP.`,
        read: false,
        date: new Date().toISOString(),
        actionLabel: 'View',
        actionUrl: '/app/portfolio',
      },
      ...prev,
    ]);

    return { success: true, message: `Successfully invested ${plan.amount.toLocaleString()} BWP in ${plan.ticker}.` };
  }, [recurring]);

  return (
    <DemoContext.Provider
      value={{
        isDemoMode,
        enterDemo,
        exitDemo,
        profile,
        holdings,
        cash,
        transactions,
        goals,
        notifications,
        dividends,
        recurring,
        watchlist,
        snapshots,
        buyInvestment,
        sellInvestment,
        addCash,
        withdrawCash,
        markNotificationRead,
        markAllNotificationsRead,
        addToWatchlist,
        removeFromWatchlist,
        createGoal,
        contributeToGoal,
        toggleRecurring,
        createRecurring,
        runRecurringNow,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}
