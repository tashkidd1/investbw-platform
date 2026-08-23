import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, ShoppingCart, Banknote, Receipt, Coins, Target } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { useDemo } from '@/hooks/useDemo';
import { formatCurrency, formatDate } from '@/lib/format';
import type { TransactionType } from '@/types';

const typeConfig: Record<TransactionType, { icon: typeof ArrowDownLeft; color: string; bg: string }> = {
  buy: { icon: ShoppingCart, color: 'text-brand-600', bg: 'bg-brand-50' },
  sell: { icon: ArrowUpRight, color: 'text-accent-600', bg: 'bg-accent-50' },
  dividend: { icon: Coins, color: 'text-success-600', bg: 'bg-success-50' },
  deposit: { icon: Banknote, color: 'text-success-600', bg: 'bg-success-50' },
  withdrawal: { icon: ArrowDownLeft, color: 'text-error-600', bg: 'bg-error-50' },
  fee: { icon: Receipt, color: 'text-neutral-500', bg: 'bg-neutral-100' },
  goal_contribution: { icon: Target, color: 'text-accent-600', bg: 'bg-accent-50' },
};

const filters: { label: string; value: 'all' | TransactionType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Buy', value: 'buy' },
  { label: 'Sell', value: 'sell' },
  { label: 'Dividends', value: 'dividend' },
  { label: 'Deposits', value: 'deposit' },
  { label: 'Goals', value: 'goal_contribution' },
];

export function TransactionsPage() {
  const { transactions } = useDemo();
  const [filter, setFilter] = useState<'all' | TransactionType>('all');

  const filtered = filter === 'all' ? transactions : transactions.filter((t) => t.type === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Transactions" subtitle="Your complete simulated transaction history" />

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
              filter === f.value
                ? 'bg-brand-600 text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <Card padding="none" className="hidden lg:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-neutral-500 border-b border-neutral-100 bg-neutral-50/50">
                <th className="px-5 py-3.5 font-medium">Type</th>
                <th className="px-5 py-3.5 font-medium">Description</th>
                <th className="px-5 py-3.5 font-medium text-right">Shares</th>
                <th className="px-5 py-3.5 font-medium text-right">Price</th>
                <th className="px-5 py-3.5 font-medium text-right">Amount</th>
                <th className="px-5 py-3.5 font-medium text-right">Fee</th>
                <th className="px-5 py-3.5 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filtered.map((t) => {
                const cfg = typeConfig[t.type];
                const isPositive = t.type === 'sell' || t.type === 'dividend' || t.type === 'deposit';
                return (
                  <tr key={t.id} className="hover:bg-neutral-50 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.bg} ${cfg.color}`}>
                          <cfg.icon size={16} />
                        </div>
                        <Badge variant="neutral">{t.type === 'goal_contribution' ? 'Goal' : t.type}</Badge>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-neutral-700">{t.description}</td>
                    <td className="px-5 py-3.5 text-right text-sm tabular-nums text-neutral-600">{t.shares ?? '—'}</td>
                    <td className="px-5 py-3.5 text-right text-sm tabular-nums text-neutral-600">{t.pricePerShare ? formatCurrency(t.pricePerShare) : '—'}</td>
                    <td className={`px-5 py-3.5 text-right text-sm font-semibold tabular-nums ${isPositive ? 'text-success-600' : 'text-neutral-900'}`}>
                      {isPositive ? '+' : '-'}{formatCurrency(t.totalAmount)}
                    </td>
                    <td className="px-5 py-3.5 text-right text-sm tabular-nums text-neutral-400">{t.fee ? formatCurrency(t.fee) : '—'}</td>
                    <td className="px-5 py-3.5 text-right text-xs text-neutral-400">{formatDate(t.date)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile cards */}
      <div className="lg:hidden space-y-3">
        {filtered.map((t) => {
          const cfg = typeConfig[t.type];
          const isPositive = t.type === 'sell' || t.type === 'dividend' || t.type === 'deposit';
          return (
            <Card key={t.id} padding="md">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cfg.bg} ${cfg.color} shrink-0`}>
                    <cfg.icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{t.description}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{formatDate(t.date)}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold tabular-nums ${isPositive ? 'text-success-600' : 'text-neutral-900'}`}>
                  {isPositive ? '+' : '-'}{formatCurrency(t.totalAmount)}
                </span>
              </div>
              <div className="flex items-center gap-3 pt-2 border-t border-neutral-100 text-xs text-neutral-500">
                <Badge variant="neutral">{t.type === 'goal_contribution' ? 'Goal' : t.type}</Badge>
                {t.shares && <span>{t.shares} shares</span>}
                {t.pricePerShare && <span>@ {formatCurrency(t.pricePerShare)}</span>}
                {t.fee && <span>Fee: {formatCurrency(t.fee)}</span>}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
