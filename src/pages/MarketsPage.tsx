import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { InvestmentCard } from '@/components/investments/InvestmentCard';
import { PageHeader, EmptyState } from '@/components/ui/PageHeader';
import { demoData } from '@/data/demoData';
import type { InvestmentCategory } from '@/types';

type FilterType = 'all' | InvestmentCategory | 'botswana' | 'global';

export function MarketsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filters: { label: string; value: FilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Botswana', value: 'botswana' },
    { label: 'Global', value: 'global' },
    { label: 'Equities', value: 'equity' },
    { label: 'ETFs', value: 'etf' },
    { label: 'REITs', value: 'reit' },
    { label: 'Bonds', value: 'bond' },
  ];

  const filtered = demoData.investments.filter((inv) => {
    const matchesQuery =
      inv.ticker.toLowerCase().includes(query.toLowerCase()) ||
      inv.name.toLowerCase().includes(query.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'botswana' || filter === 'global' ? inv.market === filter : inv.category === filter);
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Markets"
        subtitle="Demo market data — Simulated prices, no real market connection."
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search by ticker or name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-white border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <SlidersHorizontal size={16} className="text-neutral-400 shrink-0" />
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

      {/* Grid — responsive: 1 col mobile, 2 col tablet, 3 col desktop */}
      {filtered.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((inv) => (
            <InvestmentCard key={inv.id} investment={inv} onClick={() => navigate(`/app/markets/${inv.id}`)} />
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={<Search size={28} />}
            title="No investments found"
            description="Try adjusting your search or filters to find what you're looking for."
          />
        </Card>
      )}
    </div>
  );
}
