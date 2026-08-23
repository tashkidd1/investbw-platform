import { type ReactNode } from 'react';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import type { Investment } from '@/types';
import { formatCurrency, formatPercent } from '@/lib/format';
import { Sparkline } from '@/components/ui/Chart';

interface InvestmentCardProps {
  investment: Investment;
  onClick?: () => void;
}

export function InvestmentCard({ investment, onClick }: InvestmentCardProps) {
  const isUp = investment.dailyChangePct >= 0;
  const sparkData = investment.historicalPrices.map((p) => p.price);
  const initials = investment.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');
  const sparkColor = isUp ? '#2d9568' : '#ef4444';
  const dailyChangeAbs = Math.abs(investment.price * (investment.dailyChangePct / 100));

  return (
    <div
      onClick={onClick}
      className="card-surface p-5 hover:shadow-elevated transition-all duration-200 cursor-pointer hover:border-neutral-300 group flex flex-col"
    >
      {/* TOP SECTION: Ticker + % movement */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-semibold shrink-0"
            style={{ backgroundColor: investment.logoColor ?? '#2d9568' }}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-base text-neutral-900 leading-tight">{investment.ticker}</p>
            <p className="text-xs text-neutral-500 truncate mt-0.5">{investment.name}</p>
          </div>
        </div>
        <span
          className={`flex items-center gap-1 text-sm font-semibold tabular-nums shrink-0 ml-2 ${
            isUp ? 'text-success-600' : 'text-error-600'
          }`}
        >
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {formatPercent(investment.dailyChangePct)}
        </span>
      </div>

      {/* PRICE SECTION */}
      <div className="mt-4 mb-3">
        <p className="text-2xl font-bold text-neutral-900 tabular-nums leading-none">
          {formatCurrency(investment.price)}
        </p>
        <p className={`text-xs mt-1.5 tabular-nums ${isUp ? 'text-success-600' : 'text-error-600'}`}>
          {isUp ? '+' : '-'}{formatCurrency(dailyChangeAbs)} today
        </p>
      </div>

      {/* CHART SECTION — dedicated space, minimum height */}
      <div className="h-14 -mx-1 mb-4">
        <Sparkline data={sparkData} width={240} height={56} color={sparkColor} fill={true} strokeWidth={2} />
      </div>

      {/* BOTTOM SECTION: Category + navigation indicator */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-100">
        <span className="text-xs font-medium text-neutral-500 capitalize">
          {investment.market === 'botswana' ? 'Botswana ' : 'Global '}
          {investment.category}
        </span>
        <ArrowRight
          size={16}
          className="text-neutral-300 group-hover:text-brand-600 group-hover:translate-x-0.5 transition-all"
        />
      </div>
    </div>
  );
}

interface HoldingCardProps {
  holding: {
    ticker: string;
    name: string;
    shares: number;
    marketValue: number;
    unrealizedGain: number;
    unrealizedGainPct: number;
    dayChangePct: number;
  };
  onClick?: () => void;
}

export function HoldingCard({ holding, onClick }: HoldingCardProps) {
  const isGain = holding.unrealizedGain >= 0;
  return (
    <div
      onClick={onClick}
      className="card-surface p-5 hover:shadow-elevated transition-all cursor-pointer hover:border-neutral-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-semibold text-base text-neutral-900">{holding.ticker}</p>
          <p className="text-xs text-neutral-500 mt-0.5">{holding.shares} shares</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-base text-neutral-900 tabular-nums">{formatCurrency(holding.marketValue)}</p>
          <p className={`text-xs tabular-nums mt-0.5 ${isGain ? 'text-success-600' : 'text-error-600'}`}>
            {isGain ? '+' : ''}{formatCurrency(holding.unrealizedGain)} ({isGain ? '+' : ''}{holding.unrealizedGainPct.toFixed(2)}%)
          </p>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
}

export function StatCard({ label, value, change, changeType = 'neutral', icon }: StatCardProps) {
  const changeColor =
    changeType === 'positive'
      ? 'text-success-600'
      : changeType === 'negative'
      ? 'text-error-600'
      : 'text-neutral-500';
  return (
    <div className="card-surface p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-neutral-500">{label}</span>
        {icon && <span className="text-neutral-400">{icon}</span>}
      </div>
      <p className="text-2xl font-bold text-neutral-900 tabular-nums leading-tight">{value}</p>
      {change && <p className={`text-xs mt-1.5 tabular-nums ${changeColor}`}>{change}</p>}
    </div>
  );
}
