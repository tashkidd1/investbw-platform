import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DonutChart, AreaChart } from '@/components/ui/Chart';
import { PageHeader, SectionHeader } from '@/components/ui/PageHeader';
import { useDemo } from '@/hooks/useDemo';
import { formatCurrency, formatPercent } from '@/lib/format';

export function PortfolioPage() {
  const { holdings, cash, snapshots } = useDemo();
  const navigate = useNavigate();

  const investedValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);
  const totalCost = holdings.reduce((sum, h) => sum + h.totalCost, 0);
  const totalGain = investedValue - totalCost;
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
  const totalValue = investedValue + (cash?.balance ?? 0);
  const dayChange = holdings.reduce((sum, h) => sum + h.dayChange, 0);
  const dayChangePct = investedValue > 0 ? (dayChange / (investedValue - dayChange)) * 100 : 0;

  const chartData = snapshots.slice(-30).map((s) => ({ date: s.date, value: s.totalValue }));

  const allocationSegments = holdings.map((h, i) => ({
    label: h.ticker,
    value: h.marketValue,
    color: ['#2d9568', '#1B4F8C', '#FF6F00', '#7B1FA2', '#D32F2F'][i % 5],
  }));
  allocationSegments.push({ label: 'Cash', value: cash?.balance ?? 0, color: '#94a3b8' });

  const bestPerformer = [...holdings].sort((a, b) => b.unrealizedGainPct - a.unrealizedGainPct)[0];
  const worstPerformer = [...holdings].sort((a, b) => a.unrealizedGainPct - b.unrealizedGainPct)[0];

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Portfolio"
        subtitle="Your simulated investment holdings"
        action={<Button size="sm" leftIcon={<Plus size={16} />} onClick={() => navigate('/app/markets')}>Add Investment</Button>}
      />

      {/* Summary */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2" padding="lg">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
            <div>
              <p className="text-sm text-neutral-500">Total Value</p>
              <p className="text-3xl sm:text-4xl font-bold text-neutral-900 tabular-nums mt-1.5 leading-none">{formatCurrency(totalValue)}</p>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-neutral-500">Today</span>
                  <span className={`flex items-center gap-1 text-sm font-semibold tabular-nums ${dayChange >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                    {dayChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {formatCurrency(Math.abs(dayChange))} ({formatPercent(dayChangePct)})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-neutral-500">All time</span>
                  <span className={`text-sm font-semibold tabular-nums ${totalGain >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                    {totalGain >= 0 ? '+' : ''}{formatCurrency(totalGain)} ({formatPercent(totalGainPct)})
                  </span>
                </div>
              </div>
            </div>
          </div>
          <AreaChart data={chartData} height={240} />
        </Card>

        <Card padding="lg">
          <SectionHeader title="Allocation" />
          <div className="flex items-center justify-center mb-6">
            <DonutChart segments={allocationSegments} size={150} thickness={22} />
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

      {/* Analytics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md">
          <p className="text-xs text-neutral-500 mb-2">Invested</p>
          <p className="text-xl font-bold text-neutral-900 tabular-nums">{formatCurrency(investedValue)}</p>
        </Card>
        <Card padding="md">
          <p className="text-xs text-neutral-500 mb-2">Cash</p>
          <p className="text-xl font-bold text-neutral-900 tabular-nums">{formatCurrency(cash?.balance ?? 0)}</p>
        </Card>
        <Card padding="md">
          <p className="text-xs text-neutral-500 mb-2">Best Performer</p>
          <p className="text-xl font-bold text-neutral-900">{bestPerformer?.ticker ?? '—'}</p>
          <p className="text-xs text-success-600 tabular-nums mt-1">+{formatPercent(bestPerformer?.unrealizedGainPct ?? 0)}</p>
        </Card>
        <Card padding="md">
          <p className="text-xs text-neutral-500 mb-2">Worst Performer</p>
          <p className="text-xl font-bold text-neutral-900">{worstPerformer?.ticker ?? '—'}</p>
          <p className="text-xs text-error-600 tabular-nums mt-1">{formatPercent(worstPerformer?.unrealizedGainPct ?? 0)}</p>
        </Card>
      </div>

      {/* Holdings — table on desktop, cards on mobile */}
      <div>
        <SectionHeader title="All Holdings" />
        {/* Desktop table */}
        <Card padding="none" className="hidden lg:block overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-neutral-500 border-b border-neutral-100 bg-neutral-50/50">
                  <th className="px-5 py-3.5 font-medium">Investment</th>
                  <th className="px-5 py-3.5 font-medium text-right">Shares</th>
                  <th className="px-5 py-3.5 font-medium text-right">Avg Cost</th>
                  <th className="px-5 py-3.5 font-medium text-right">Price</th>
                  <th className="px-5 py-3.5 font-medium text-right">Value</th>
                  <th className="px-5 py-3.5 font-medium text-right">Gain/Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {holdings.map((h) => {
                  const isGain = h.unrealizedGain >= 0;
                  return (
                    <tr key={h.id} className="hover:bg-neutral-50 transition cursor-pointer" onClick={() => navigate(`/app/markets/${h.investmentId}`)}>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-sm text-neutral-900">{h.ticker}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">{h.name}</p>
                      </td>
                      <td className="px-5 py-4 text-right text-sm tabular-nums text-neutral-600">{h.shares}</td>
                      <td className="px-5 py-4 text-right text-sm tabular-nums text-neutral-600">{formatCurrency(h.avgCostPerShare)}</td>
                      <td className="px-5 py-4 text-right text-sm tabular-nums text-neutral-600">{formatCurrency(h.currentPrice)}</td>
                      <td className="px-5 py-4 text-right text-sm font-semibold tabular-nums text-neutral-900">{formatCurrency(h.marketValue)}</td>
                      <td className="px-5 py-4 text-right">
                        <p className={`text-sm font-medium tabular-nums ${isGain ? 'text-success-600' : 'text-error-600'}`}>
                          {isGain ? '+' : ''}{formatCurrency(h.unrealizedGain)}
                        </p>
                        <p className={`text-xs tabular-nums ${isGain ? 'text-success-600' : 'text-error-600'}`}>
                          ({isGain ? '+' : ''}{formatPercent(h.unrealizedGainPct)})
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Mobile cards */}
        <div className="lg:hidden space-y-3">
          {holdings.map((h) => {
            const isGain = h.unrealizedGain >= 0;
            return (
              <Card key={h.id} hover padding="md" onClick={() => navigate(`/app/markets/${h.investmentId}`)}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-base text-neutral-900">{h.ticker}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{h.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-base tabular-nums text-neutral-900">{formatCurrency(h.marketValue)}</p>
                    <p className={`text-xs tabular-nums mt-0.5 ${isGain ? 'text-success-600' : 'text-error-600'}`}>
                      {isGain ? '+' : ''}{formatCurrency(h.unrealizedGain)} ({isGain ? '+' : ''}{formatPercent(h.unrealizedGainPct)})
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-500 pt-3 border-t border-neutral-100">
                  <span>{h.shares} shares @ {formatCurrency(h.avgCostPerShare)} avg</span>
                  <span>Now {formatCurrency(h.currentPrice)}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
