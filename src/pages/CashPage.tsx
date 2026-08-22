import { useState } from 'react';
import { Wallet, ArrowDownLeft, ArrowUpRight, Plus, Minus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { PageHeader, SectionHeader } from '@/components/ui/PageHeader';
import { useDemo } from '@/hooks/useDemo';
import { formatCurrency, formatDate } from '@/lib/format';

export function CashPage() {
  const { cash, transactions, holdings, addCash, withdrawCash } = useDemo();
  const [modal, setModal] = useState<'deposit' | 'withdraw' | null>(null);
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const cashTransactions = transactions.filter((t) => t.type === 'deposit' || t.type === 'withdrawal' || t.type === 'dividend' || t.type === 'fee');
  const investedValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);
  const totalValue = investedValue + (cash?.balance ?? 0);
  const amountNum = parseFloat(amount) || 0;

  const handleConfirm = () => {
    setError('');
    if (amountNum <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (modal === 'deposit') {
      addCash(amountNum);
      setModal(null);
      setAmount('');
    } else if (modal === 'withdraw') {
      const success = withdrawCash(amountNum);
      if (!success) {
        setError('Insufficient cash for this withdrawal');
        return;
      }
      setModal(null);
      setAmount('');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Cash"
        subtitle="Your simulated cash balance and history"
      />

      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card padding="lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
              <Wallet size={22} />
            </div>
            <div>
              <p className="text-xs text-neutral-500">Available Cash</p>
              <p className="text-2xl font-bold text-neutral-900 tabular-nums">{formatCurrency(cash?.balance ?? 0)}</p>
            </div>
          </div>
          <p className="text-xs text-neutral-400">Simulated funds — not real money</p>
        </Card>

        <Card padding="lg">
          <p className="text-xs text-neutral-500 mb-2">Invested</p>
          <p className="text-2xl font-bold text-neutral-900 tabular-nums">{formatCurrency(investedValue)}</p>
          <p className="text-xs text-neutral-400 mt-2">Across {holdings.length} holdings</p>
        </Card>

        <Card padding="lg">
          <p className="text-xs text-neutral-500 mb-2">Total Portfolio</p>
          <p className="text-2xl font-bold text-neutral-900 tabular-nums">{formatCurrency(totalValue)}</p>
          <p className="text-xs text-neutral-400 mt-2">Cash + investments</p>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        <Button variant="outline" leftIcon={<Plus size={16} />} onClick={() => { setModal('deposit'); setAmount(''); setError(''); }}>
          Add Cash
        </Button>
        <Button variant="outline" leftIcon={<Minus size={16} />} onClick={() => { setModal('withdraw'); setAmount(''); setError(''); }}>
          Withdraw
        </Button>
      </div>

      {/* Cash activity */}
      <div>
        <SectionHeader title="Cash Activity" />
        <Card padding="none" className="overflow-hidden">
          <div className="divide-y divide-neutral-50">
            {cashTransactions.map((t) => {
              const isPositive = t.type === 'deposit' || t.type === 'dividend';
              return (
                <div key={t.id} className="flex items-center justify-between p-4 hover:bg-neutral-50 transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isPositive ? 'bg-success-50 text-success-600' : 'bg-error-50 text-error-600'}`}>
                      {isPositive ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{t.description}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{formatDate(t.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="neutral">{t.type}</Badge>
                    <span className={`text-sm font-semibold tabular-nums ${isPositive ? 'text-success-600' : 'text-error-600'}`}>
                      {isPositive ? '+' : '-'}{formatCurrency(t.totalAmount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Deposit Modal */}
      <Modal
        open={modal === 'deposit'}
        onClose={() => setModal(null)}
        title="Add Cash"
        description="Add simulated funds to your demo account"
        footer={
          <div className="space-y-3">
            {error && <p className="text-sm text-error-600">{error}</p>}
            <Button fullWidth size="lg" onClick={handleConfirm}>
              Add {amountNum > 0 ? formatCurrency(amountNum) : 'Cash'}
            </Button>
          </div>
        }
      >
        <Input
          label="Amount (BWP)"
          type="number"
          min="1"
          step="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          hint="Enter the amount of simulated cash to add"
        />
      </Modal>

      {/* Withdraw Modal */}
      <Modal
        open={modal === 'withdraw'}
        onClose={() => setModal(null)}
        title="Withdraw Cash"
        description="Withdraw simulated funds from your demo account"
        footer={
          <div className="space-y-3">
            {error && <p className="text-sm text-error-600">{error}</p>}
            <Button fullWidth size="lg" onClick={handleConfirm}>
              Withdraw {amountNum > 0 ? formatCurrency(amountNum) : 'Cash'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-500">Available: <span className="font-semibold text-neutral-900 tabular-nums">{formatCurrency(cash?.balance ?? 0)}</span></p>
          <Input
            label="Amount (BWP)"
            type="number"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            hint="Enter the amount to withdraw"
          />
        </div>
      </Modal>
    </div>
  );
}
