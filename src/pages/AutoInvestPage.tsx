import { useState, useEffect, useRef } from 'react';
import { Repeat, Plus, Pause, Play, Zap, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { PageHeader } from '@/components/ui/PageHeader';
import { useDemo } from '@/hooks/useDemo';
import { demoData } from '@/data/demoData';
import { formatCurrency, formatDate } from '@/lib/format';
import type { RecurringFrequency } from '@/types';

const FREQUENCIES: { label: string; value: RecurringFrequency }[] = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Bi-weekly', value: 'biweekly' },
  { label: 'Monthly', value: 'monthly' },
];

const DEMO_INTERVALS = [1, 2, 5, 10];

export function AutoInvestPage() {
  const { recurring, cash, toggleRecurring, createRecurring, runRecurringNow, isDemoMode } = useDemo();
  const [newPlanModal, setNewPlanModal] = useState(false);
  const [error, setError] = useState('');
  const [resultMsg, setResultMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // New plan form state
  const [planInvestment, setPlanInvestment] = useState('');
  const [planAmount, setPlanAmount] = useState('');
  const [planFrequency, setPlanFrequency] = useState<RecurringFrequency>('monthly');
  const [useDemoInterval, setUseDemoInterval] = useState(true);
  const [demoInterval, setDemoInterval] = useState(2);

  // Demo interval auto-execution timer
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);

    if (!isDemoMode) return;

    // Check every 10 seconds for due demo-interval plans
    timerRef.current = setInterval(() => {
      const now = new Date();
      recurring.forEach((r) => {
        if (!r.isActive || !r.demoIntervalMinutes || r.demoIntervalMinutes <= 0) return;
        const lastRun = r.lastRunAt ? new Date(r.lastRunAt) : new Date(r.createdAt);
        const elapsedMin = (now.getTime() - lastRun.getTime()) / 60000;
        if (elapsedMin >= r.demoIntervalMinutes) {
          runRecurringNow(r.id);
        }
      });
    }, 10000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isDemoMode, recurring, runRecurringNow]);

  const handleCreatePlan = () => {
    setError('');
    if (!planInvestment) {
      setError('Select an investment');
      return;
    }
    const amount = parseFloat(planAmount);
    if (!amount || amount <= 0) {
      setError('Enter a valid amount');
      return;
    }

    const inv = demoData.investments.find((i) => i.id === planInvestment);
    if (!inv) {
      setError('Investment not found');
      return;
    }

    const now = new Date();
    let nextRun = new Date(now);
    if (useDemoInterval && demoInterval > 0) {
      nextRun.setMinutes(nextRun.getMinutes() + demoInterval);
    } else if (planFrequency === 'weekly') {
      nextRun.setDate(nextRun.getDate() + 7);
    } else if (planFrequency === 'biweekly') {
      nextRun.setDate(nextRun.getDate() + 14);
    } else {
      nextRun.setMonth(nextRun.getMonth() + 1);
    }

    createRecurring({
      investmentId: inv.id,
      ticker: inv.ticker,
      name: inv.name,
      amount,
      frequency: planFrequency,
      nextRunDate: nextRun.toISOString().split('T')[0],
      demoIntervalMinutes: useDemoInterval ? demoInterval : null,
    });

    setNewPlanModal(false);
    setPlanInvestment('');
    setPlanAmount('');
    setPlanFrequency('monthly');
    setUseDemoInterval(true);
    setDemoInterval(2);
  };

  const handleRunNow = (id: string) => {
    const result = runRecurringNow(id);
    setResultMsg({ type: result.success ? 'success' : 'error', text: result.message });
    setTimeout(() => setResultMsg(null), 5000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Auto-Invest"
        subtitle="Automate your simulated investments on a schedule"
        action={<Button size="sm" leftIcon={<Plus size={16} />} onClick={() => { setNewPlanModal(true); setError(''); }}>New Plan</Button>}
      />

      {resultMsg && (
        <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${resultMsg.type === 'success' ? 'bg-success-50 text-success-700' : 'bg-error-50 text-error-700'}`}>
          {resultMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {resultMsg.text}
        </div>
      )}

      <Card className="bg-gradient-to-r from-brand-50 to-accent-50 border-brand-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-brand-600 shrink-0">
            <Repeat size={24} />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900">How Auto-Invest Works</h3>
            <p className="text-sm text-neutral-600 mt-1">
              Set up recurring purchases of your favorite investments. In demo mode, these run
              automatically on schedule using your virtual cash balance. Use demo test intervals
              to see results quickly without waiting weeks.
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {recurring.map((r) => (
          <Card key={r.id} padding="lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                  <Repeat size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-neutral-900">{r.ticker}</h3>
                    <Badge variant={r.isActive ? 'success' : 'neutral'} dot>
                      {r.isActive ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                  <p className="text-xs text-neutral-500">{r.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-neutral-900 tabular-nums">{formatCurrency(r.amount)}</p>
                <p className="text-xs text-neutral-500 capitalize">{r.frequency}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500">Next run</p>
                  <p className="text-sm font-medium">{formatDate(r.nextRunDate)}</p>
                </div>
              </div>
              {r.demoIntervalMinutes && r.demoIntervalMinutes > 0 && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent-50 text-accent-700 text-xs font-medium">
                  <Zap size={12} /> Demo: Every {r.demoIntervalMinutes} min
                </div>
              )}
              {r.lastRunAt && (
                <p className="text-xs text-neutral-400">Last run: {formatDate(r.lastRunAt)}</p>
              )}
            </div>

            <div className="flex items-center gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                leftIcon={r.isActive ? <Pause size={14} /> : <Play size={14} />}
                onClick={() => toggleRecurring(r.id)}
              >
                {r.isActive ? 'Pause' : 'Resume'}
              </Button>
              {r.isActive && isDemoMode && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Zap size={14} />}
                  onClick={() => handleRunNow(r.id)}
                >
                  Run Test Investment Now
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {recurring.length === 0 && (
        <Card>
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
              <Repeat size={28} />
            </div>
            <p className="text-base font-medium text-neutral-900">No auto-invest plans yet</p>
            <p className="text-sm text-neutral-500 mt-1.5 max-w-sm">Create a plan to automate recurring investments on a schedule.</p>
            <div className="mt-5">
              <Button size="sm" leftIcon={<Plus size={16} />} onClick={() => { setNewPlanModal(true); setError(''); }}>Create Plan</Button>
            </div>
          </div>
        </Card>
      )}

      {/* New Plan Modal */}
      <Modal
        open={newPlanModal}
        onClose={() => setNewPlanModal(false)}
        title="Create Auto-Invest Plan"
        description="Set up a recurring investment plan"
        footer={
          <div className="space-y-3">
            {error && <p className="text-sm text-error-600">{error}</p>}
            <Button fullWidth size="lg" onClick={handleCreatePlan}>Create Plan</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Investment</label>
            <select value={planInvestment} onChange={(e) => setPlanInvestment(e.target.value)} className="input-base">
              <option value="">Select an investment...</option>
              {demoData.investments.map((inv) => (
                <option key={inv.id} value={inv.id}>{inv.ticker} — {inv.name}</option>
              ))}
            </select>
          </div>
          <Input
            label="Amount per purchase (BWP)"
            type="number"
            min="1"
            step="1"
            placeholder="500"
            value={planAmount}
            onChange={(e) => setPlanAmount(e.target.value)}
          />

          {/* Realistic Schedule */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1.5">Schedule</label>
            <div className="flex gap-2">
              {FREQUENCIES.map((f) => (
                <button
                  key={f.value}
                  onClick={() => { setPlanFrequency(f.value); setUseDemoInterval(false); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    planFrequency === f.value && !useDemoInterval
                      ? 'bg-brand-600 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Demo/Test Schedule */}
          <div className="rounded-xl border border-accent-200 bg-accent-50/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={16} className="text-accent-600" />
              <p className="text-sm font-medium text-neutral-700">Demo/Test Schedule</p>
            </div>
            <p className="text-xs text-neutral-500 mb-3">
              For testing only — runs the investment automatically every few minutes while the app is open.
              This is not a real-world investment frequency.
            </p>
            <div className="flex gap-2">
              {DEMO_INTERVALS.map((m) => (
                <button
                  key={m}
                  onClick={() => { setDemoInterval(m); setUseDemoInterval(true); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    useDemoInterval && demoInterval === m
                      ? 'bg-accent-600 text-white'
                      : 'bg-white text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  Every {m} min
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-neutral-50 p-3 flex items-center justify-between">
            <span className="text-xs text-neutral-500">Available Cash</span>
            <span className="text-sm font-semibold text-neutral-900 tabular-nums">{formatCurrency(cash?.balance ?? 0)}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
