import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, ArrowRight, Plus, Target, GraduationCap,
  Wallet, BarChart3,
} from 'lucide-react';
import { useDemo } from '@/hooks/useDemo';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/investments/InvestmentCard';
import { AreaChart, DonutChart } from '@/components/ui/Chart';
import { PageHeader, SectionHeader } from '@/components/ui/PageHeader';
import { formatCurrency, formatPercent, timeAgo } from '@/lib/format';
import { demoData } from '@/data/demoData';

export function HomePage() {
  const { holdings, cash, snapshots, notifications, goals, profile } = useDemo();
  const navigate = useNavigate();

  const investedValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);
  const totalCost = holdings.reduce((sum, h) => sum + h.totalCost, 0);
  const totalGain = investedValue - totalCost;
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
  const totalValue = investedValue + (cash?.balance ?? 0);
  const dayChange = holdings.reduce((sum, h) => sum + h.dayChange, 0);
  const dayChangePct = investedValue > 0 ? (dayChange / (investedValue - dayChange)) * 100 : 0;

  const chartData = snapshots.slice(-30).map((s) => ({ date: s.date, value: s.totalValue }));

  const allocationSegments = [
    { label: 'Equities', value: holdings.filter((h) => !h.ticker.includes('ETF') && !h.ticker.includes('REIT')).reduce((s, h) => s + h.marketValue, 0), color: '#2d9568' },
    { label: 'ETFs', value: holdings.filter((h) => h.ticker.includes('ETF') || ['BETF', 'GSPX', 'GTECH', 'GOLD'].includes(h.ticker)).reduce((s, h) => s + h.marketValue, 0), color: '#1B4F8C' },
    { label: 'REITs', value: holdings.filter((h) => h.ticker.includes('REIT') || h.ticker === 'AFREIT').reduce((s, h) => s + h.marketValue, 0), color: '#FF6F00' },
    { label: 'Cash', value: cash?.balance ?? 0, color: '#94a3b8' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Invest', to: '/app/markets', color: 'bg-brand-50 text-brand-600' },
    { icon: Wallet, label: 'Add Cash', to: '/app/cash', color: 'bg-success-50 text-success-600' },
    { icon: Target, label: 'Create Goal', to: '/app/goals', color: 'bg-accent-50 text-accent-600' },
    { icon: BarChart3, label: 'Markets', to: '/app/markets', color: 'bg-neutral-100 text-neutral-600' },
  ];

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 tracking-tight">
          {greeting}, {profile?.displayName?.split(' ')[0] ?? 'there'}
        </h1>
        <p className="text-sm text-neutral-500 mt-1.5">Here's how your portfolio is doing today.</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.to)}
            className="card-surface p-4 flex flex-col items-center gap-2 hover:shadow-elevated hover:border-neutral-300 transition-all group"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
              <action.icon size={20} />
            </div>
            <span className="text-sm font-medium text-neutral-700">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Portfolio Value + Chart */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" padding="lg">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
            <div>
              <p className="text-sm text-neutral-500">Total Portfolio Value</p>
              <p className="text-3xl sm:text-4xl font-bold text-neutral-900 tabular-nums mt-1.5 leading-none">
                {formatCurrency(totalValue)}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className={`flex items-center gap-1 text-sm font-semibold tabular-nums ${dayChange >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                  {dayChange >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {formatCurrency(Math.abs(dayChange))} ({formatPercent(dayChangePct)})
                </span>
                <span className="text-xs text-neutral-400">today</span>
              </div>
            </div>
            <Button size="sm" leftIcon={<Plus size={16} />} onClick={() => navigate('/app/markets')} className="shrink-0">
              Invest
            </Button>
          </div>
          <AreaChart data={chartData} height={220} />
        </Card>

        {/* Allocation */}
        <Card padding="lg">
          <SectionHeader title="Allocation" />
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <DonutChart segments={allocationSegments} size={150} thickness={22} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xs text-neutral-500">Total</p>
                <p className="text-sm font-bold text-neutral-900 tabular-nums">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </div>
          <div className="space-y-2.5">
            {allocationSegments.map((s) => (
              <div key={s.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-neutral-600">{s.label}</span>
                </div>
                <span className="font-medium text-neutral-900 tabular-nums">{formatCurrency(s.value)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Invested" value={formatCurrency(investedValue)} change={`${formatPercent(totalGainPct)} all time`} changeType={totalGain >= 0 ? 'positive' : 'negative'} />
        <StatCard label="Total Return" value={formatCurrency(totalGain)} change={formatPercent(totalGainPct)} changeType={totalGain >= 0 ? 'positive' : 'negative'} />
        <StatCard label="Cash Available" value={formatCurrency(cash?.balance ?? 0)} />
        <StatCard label="Active Goals" value={String(goals.filter((g) => g.status === 'active').length)} />
      </div>

      {/* Holdings + Goals */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <SectionHeader
            title="Your Holdings"
            action={
              <button onClick={() => navigate('/app/portfolio')} className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
                View all <ArrowRight size={14} />
              </button>
            }
          />
          <div className="space-y-2">
            {holdings.slice(0, 5).map((h) => {
              const isGain = h.unrealizedGain >= 0;
              return (
                <div key={h.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-neutral-50 transition cursor-pointer" onClick={() => navigate('/app/portfolio')}>
                  <div>
                    <p className="font-semibold text-sm text-neutral-900">{h.ticker}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{h.shares} shares</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm tabular-nums text-neutral-900">{formatCurrency(h.marketValue)}</p>
                    <p className={`text-xs tabular-nums mt-0.5 ${isGain ? 'text-success-600' : 'text-error-600'}`}>
                      {isGain ? '+' : ''}{formatPercent(h.unrealizedGainPct)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card padding="lg">
          <SectionHeader
            title="Goals Progress"
            action={
              <button onClick={() => navigate('/app/goals')} className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
                View all <ArrowRight size={14} />
              </button>
            }
          />
          <div className="space-y-5">
            {goals.slice(0, 3).map((g) => {
              const pct = (g.currentAmount / g.targetAmount) * 100;
              return (
                <div key={g.id} onClick={() => navigate('/app/goals')} className="cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Target size={16} className="text-neutral-400" />
                      <span className="text-sm font-medium text-neutral-900">{g.name}</span>
                    </div>
                    <span className="text-xs text-neutral-500 tabular-nums">{pct.toFixed(0)}%</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-neutral-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: g.color }} />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs text-neutral-500 tabular-nums">{formatCurrency(g.currentAmount)}</span>
                    <span className="text-xs text-neutral-400 tabular-nums">{formatCurrency(g.targetAmount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card padding="lg">
        <SectionHeader
          title="Recent Activity"
          action={
            <button onClick={() => navigate('/app/notifications')} className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </button>
          }
        />
        <div className="space-y-2">
          {notifications.slice(0, 4).map((n) => (
            <div key={n.id} className="flex items-start gap-3 p-2 rounded-xl hover:bg-neutral-50 transition">
              {!n.read && <span className="w-2 h-2 rounded-full bg-brand-500 mt-1.5 shrink-0" />}
              {n.read && <span className="w-2 h-2 rounded-full bg-transparent mt-1.5 shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900">{n.title}</p>
                <p className="text-xs text-neutral-500 truncate mt-0.5">{n.message}</p>
                <p className="text-2xs text-neutral-400 mt-0.5">{timeAgo(n.date)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Learn teaser */}
      <Card hover onClick={() => navigate('/app/learn')} className="bg-gradient-to-r from-brand-50 to-accent-50 border-brand-100" padding="lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-brand-600 shrink-0">
            <GraduationCap size={24} />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-neutral-900">New to investing?</p>
            <p className="text-sm text-neutral-600 mt-0.5">Explore our learning library and build your knowledge.</p>
          </div>
          <ArrowRight className="text-neutral-400" size={20} />
        </div>
      </Card>
    </div>
  );
}
