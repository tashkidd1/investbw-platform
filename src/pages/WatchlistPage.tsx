import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { InvestmentCard } from '@/components/investments/InvestmentCard';
import { PageHeader, EmptyState } from '@/components/ui/PageHeader';
import { useDemo } from '@/hooks/useDemo';
import { demoData } from '@/data/demoData';

export function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useDemo();
  const navigate = useNavigate();

  // Map watchlist items to full Investment objects for InvestmentCard
  const watchlistInvestments = watchlist
    .map((w) => demoData.investments.find((inv) => inv.id === w.investmentId))
    .filter((inv): inv is NonNullable<typeof inv> => inv !== undefined);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Watchlist" subtitle="Investments you're tracking" />

      {watchlistInvestments.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Star size={28} />}
            title="Your watchlist is empty"
            description="Browse markets and add investments to your watchlist to track them here."
            action={<Button onClick={() => navigate('/app/markets')}>Browse Markets</Button>}
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {watchlistInvestments.map((inv) => (
            <div key={inv.id} className="relative group">
              <InvestmentCard investment={inv} onClick={() => navigate(`/app/markets/${inv.id}`)} />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const wlItem = watchlist.find((w) => w.investmentId === inv.id);
                  if (wlItem) removeFromWatchlist(wlItem.id);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/80 backdrop-blur-sm hover:bg-error-50 transition opacity-0 group-hover:opacity-100"
                title="Remove from watchlist"
              >
                <Star size={16} className="text-accent-400 fill-accent-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
