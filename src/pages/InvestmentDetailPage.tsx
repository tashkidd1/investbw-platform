import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Star, ShoppingCart, DollarSign } from 'lucide-react';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { AreaChart } from '@/components/ui/Chart';
import { SectionHeader } from '@/components/ui/PageHeader';
import { demoData } from '@/data/demoData';
import { useDemo } from '@/hooks/useDemo';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/format';

export function InvestmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cash, holdings, buyInvestment, sellInvestment, watchlist, addToWatchlist, removeFromWatchlist } = useDemo();
  const [tradeModal, setTradeModal] = useState<'buy' | 'sell' | null>(null);
  const [shares, setShares] = useState('1');
  const [error, setError] = useState('');

  const investment = demoData.investments.find((i) => i.id === id);
  if (!investment) {
    return (
      <Card className="text-center py-12">
        <p className="text-neutral-500">Investment not found.</p>
        <Button className="mt-4" onClick={() => navigate('/app/markets')}>Back to Markets</Button>
      </Card>
    );
  }

  const isUp = investment.dailyChangePct >= 0;
  const chartData = investment.historicalPrices.map((p) => ({ date: p.date, value: p.price }));
  const inWatchlist = watchlist.some((w) => w.investmentId === investment.id);
  const userHolding = holdings.find((h) => h.investmentId === investment.id);
  const shareCount = parseFloat(shares) || 0;

  const buyCost = shareCount * investment.price;
  const buyFee = Math.max(10, buyCost * 0.005);
  const buyTotal = buyCost + buyFee;

  const sellProceeds = shareCount * investment.price;
  const sellFee = Math.max(10, sellProceeds * 0.005);
  const sellNet = sellProceeds - sellFee;

  const handleTrade = () => {
    setError('');
    if (shareCount <= 0) {
      setError('Enter a valid number of shares');
      return;
    }
    if (tradeModal === 'buy') {
      if (buyTotal > (cash?.balance ?? 0)) {
        setError('Insufficient cash for this purchase');
        return;
      }
      const success = buyInvestment(investment.id, investment.ticker, investment.name, shareCount, investment.price);
      if (success) {
        setTradeModal(null);
        setShares('1');
        navigate('/app/portfolio');
      } else {
        setError('Transaction failed');
      }
    } else if (tradeModal === 'sell') {
      if (!userHolding || shareCount > userHolding.shares) {
        setError(`You only have ${userHolding?.shares ?? 0} shares to sell`);
        return;
      }
      const success = sellInvestment(investment.id, investment.ticker, investment.name, shareCount, investment.price);
      if (success) {
        setTradeModal(null);
        setShares('1');
        navigate('/app/portfolio');
      } else {
        setError('Transaction failed');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={() => navigate('/app/markets')} className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 transition">
        <ArrowLeft size={16} /> Back to Markets
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card padding="lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-lg font-semibold" style={{ backgroundColor: investment.logoColor }}>
                  {investment.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-display font-bold text-neutral-900">{investment.ticker}</h1>
                    <Badge variant="neutral">{investment.category.toUpperCase()}</Badge>
                    <Badge variant={investment.market === 'botswana' ? 'brand' : 'accent'}>{investment.market === 'botswana' ? 'BSE' : 'Global'}</Badge>
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">{investment.name}</p>
                </div>
              </div>
              <button
                onClick={() => inWatchlist ? removeFromWatchlist(watchlist.find((w) => w.investmentId === investment.id)!.id) : addToWatchlist({ investmentId: investment.id, ticker: investment.ticker, name: investment.name, price: investment.price, dailyChangePct: investment.dailyChangePct })}
                className="p-2 rounded-xl hover:bg-neutral-100 transition"
              >
                <Star size={20} className={inWatchlist ? 'fill-accent-400 text-accent-400' : 'text-neutral-400'} />
              </button>
            </div>
            <div className="flex items-end gap-4">
              <p className="text-3xl font-bold text-neutral-900 tabular-nums">{formatCurrency(investment.price)}</p>
              <span className={`flex items-center gap-1 text-sm font-semibold tabular-nums ${isUp ? 'text-success-600' : 'text-error-600'}`}>
                {isUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {formatPercent(investment.dailyChangePct)} today
              </span>
            </div>
            {userHolding && (
              <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-4 text-sm">
                <span className="text-neutral-500">Your position:</span>
                <span className="font-medium text-neutral-900">{userHolding.shares} shares</span>
                <span className="text-neutral-300">|</span>
                <span className="font-medium text-neutral-900 tabular-nums">{formatCurrency(userHolding.marketValue)}</span>
                <span className={`text-xs tabular-nums ${userHolding.unrealizedGain >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                  ({userHolding.unrealizedGain >= 0 ? '+' : ''}{formatPercent(userHolding.unrealizedGainPct)})
                </span>
              </div>
            )}
          </Card>

          {/* Chart */}
          <Card padding="lg">
            <SectionHeader title="Price History" />
            <p className="text-xs text-neutral-400 -mt-2 mb-4">Demo data — simulated historical prices</p>
            <AreaChart data={chartData} height={240} color={investment.logoColor} />
          </Card>

          {/* About */}
          <Card padding="lg">
            <SectionHeader title={`About ${investment.name}`} />
            <p className="text-sm text-neutral-600 leading-relaxed">{investment.description}</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="text-xs text-neutral-500">Sector</p>
                <p className="text-sm font-medium text-neutral-900">{investment.sector}</p>
              </div>
              <div>
                <p className="text-xs text-neutral-500">Market</p>
                <p className="text-sm font-medium text-neutral-900">{investment.market === 'botswana' ? 'Botswana Stock Exchange' : 'Global Markets'}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card padding="lg">
            <SectionHeader title="Key Metrics" />
            <div className="space-y-3">
              {investment.marketCap !== undefined && (
                <div className="flex justify-between"><span className="text-sm text-neutral-500">Market Cap</span><span className="text-sm font-medium tabular-nums">{formatCurrency(investment.marketCap)}</span></div>
              )}
              {investment.peRatio !== undefined && (
                <div className="flex justify-between"><span className="text-sm text-neutral-500">P/E Ratio</span><span className="text-sm font-medium tabular-nums">{formatNumber(investment.peRatio)}</span></div>
              )}
              {investment.dividendYield !== undefined && investment.dividendYield > 0 && (
                <div className="flex justify-between"><span className="text-sm text-neutral-500">Dividend Yield</span><span className="text-sm font-medium tabular-nums">{formatPercent(investment.dividendYield * 100)}</span></div>
              )}
              <div className="flex justify-between"><span className="text-sm text-neutral-500">Category</span><span className="text-sm font-medium capitalize">{investment.category}</span></div>
            </div>
          </Card>

          <Card padding="lg">
            <p className="text-xs text-neutral-500 mb-1">Available Cash</p>
            <p className="text-xl font-bold text-neutral-900 tabular-nums mb-4">{formatCurrency(cash?.balance ?? 0)}</p>
            <div className="space-y-2">
              <Button fullWidth size="lg" leftIcon={<ShoppingCart size={18} />} onClick={() => { setTradeModal('buy'); setShares('1'); setError(''); }}>
                Buy {investment.ticker}
              </Button>
              {userHolding && (
                <Button fullWidth size="lg" variant="outline" leftIcon={<DollarSign size={18} />} onClick={() => { setTradeModal('sell'); setShares('1'); setError(''); }}>
                  Sell {investment.ticker}
                </Button>
              )}
            </div>
            {userHolding && (
              <p className="text-xs text-neutral-400 mt-3 text-center">You hold {userHolding.shares} shares</p>
            )}
          </Card>
        </div>
      </div>

      {/* Buy Modal */}
      <Modal
        open={tradeModal === 'buy'}
        onClose={() => setTradeModal(null)}
        title={`Buy ${investment.ticker}`}
        description="Simulated transaction — no real money involved"
        footer={
          <div className="space-y-3">
            {error && <p className="text-sm text-error-600">{error}</p>}
            <Button fullWidth size="lg" onClick={handleTrade}>
              Confirm Buy — {formatCurrency(buyTotal)}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Price per share</span>
            <span className="font-medium tabular-nums">{formatCurrency(investment.price)}</span>
          </div>
          <Input
            label="Number of shares"
            type="number"
            min="0.01"
            step="0.01"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            hint="Enter the number of shares you want to buy"
          />
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <div className="flex justify-between text-sm"><span className="text-neutral-500">Subtotal</span><span className="tabular-nums">{formatCurrency(buyCost)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-neutral-500">Fee</span><span className="tabular-nums">{formatCurrency(buyFee)}</span></div>
            <div className="flex justify-between font-semibold"><span>Total</span><span className="tabular-nums">{formatCurrency(buyTotal)}</span></div>
          </div>
        </div>
      </Modal>

      {/* Sell Modal */}
      <Modal
        open={tradeModal === 'sell'}
        onClose={() => setTradeModal(null)}
        title={`Sell ${investment.ticker}`}
        description="Simulated transaction — no real money involved"
        footer={
          <div className="space-y-3">
            {error && <p className="text-sm text-error-600">{error}</p>}
            <Button fullWidth size="lg" onClick={handleTrade}>
              Confirm Sell — {formatCurrency(sellNet)}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Price per share</span>
            <span className="font-medium tabular-nums">{formatCurrency(investment.price)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Your shares</span>
            <span className="font-medium tabular-nums">{userHolding?.shares ?? 0}</span>
          </div>
          <Input
            label="Number of shares to sell"
            type="number"
            min="0.01"
            step="0.01"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            hint={`You hold ${userHolding?.shares ?? 0} shares`}
          />
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <div className="flex justify-between text-sm"><span className="text-neutral-500">Proceeds</span><span className="tabular-nums">{formatCurrency(sellProceeds)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-neutral-500">Fee</span><span className="tabular-nums">{formatCurrency(sellFee)}</span></div>
            <div className="flex justify-between font-semibold"><span>You receive</span><span className="tabular-nums">{formatCurrency(sellNet)}</span></div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
