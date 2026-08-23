import { useState } from 'react';
import { Plus, Target, Calendar, TrendingUp, CheckCircle2, Trophy, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { PageHeader, SectionHeader } from '@/components/ui/PageHeader';
import { useDemo } from '@/hooks/useDemo';
import { formatCurrency, formatDate } from '@/lib/format';
import type { Goal } from '@/types';

const GOAL_COLORS = ['#2d9568', '#1B4F8C', '#FF6F00', '#7B1FA2', '#D32F2F', '#1565C0'];

export function GoalsPage() {
  const { goals, cash, createGoal, contributeToGoal } = useDemo();
  const [newGoalModal, setNewGoalModal] = useState(false);
  const [contributeModal, setContributeModal] = useState<Goal | null>(null);
  const [completedGoal, setCompletedGoal] = useState<Goal | null>(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // New goal form state
  const [goalName, setGoalName] = useState('');
  const [goalDesc, setGoalDesc] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [goalMonthly, setGoalMonthly] = useState('');
  const [goalColor, setGoalColor] = useState(GOAL_COLORS[0]);

  // Contribute state
  const [contributeAmount, setContributeAmount] = useState('');

  const activeGoals = goals.filter((g) => g.status !== 'completed');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  const handleCreateGoal = () => {
    setError('');
    if (!goalName.trim()) {
      setError('Please enter a goal name');
      return;
    }
    const target = parseFloat(goalTarget);
    if (!target || target <= 0) {
      setError('Please enter a valid target amount');
      return;
    }
    const monthly = parseFloat(goalMonthly) || 0;
    createGoal({
      name: goalName.trim(),
      description: goalDesc.trim() || 'Custom savings goal',
      targetAmount: target,
      currentAmount: 0,
      targetDate: goalDate || '2028-01-01',
      status: 'active',
      icon: 'Target',
      color: goalColor,
      monthlyContribution: monthly,
    });
    setNewGoalModal(false);
    setGoalName('');
    setGoalDesc('');
    setGoalTarget('');
    setGoalDate('');
    setGoalMonthly('');
    setGoalColor(GOAL_COLORS[0]);
  };

  const handleContribute = () => {
    setError('');
    if (!contributeModal) return;
    const amount = parseFloat(contributeAmount);
    if (!amount || amount <= 0) {
      setError('Enter a valid amount');
      return;
    }

    const remaining = contributeModal.targetAmount - contributeModal.currentAmount;
    const availableCash = cash?.balance ?? 0;

    if (amount > availableCash) {
      setError(`Insufficient available cash. You have ${formatCurrency(availableCash)}.`);
      return;
    }
    if (amount > remaining) {
      setError(`You only need ${formatCurrency(remaining)} to complete this goal.`);
      return;
    }

    const success = contributeToGoal(contributeModal.id, amount);
    if (!success) {
      setError('Contribution failed. Please check your available cash and goal status.');
      return;
    }

    // Check if this completes the goal
    const willComplete = contributeModal.currentAmount + amount >= contributeModal.targetAmount - 0.01;
    if (willComplete) {
      const completed = { ...contributeModal, currentAmount: contributeModal.currentAmount + amount, status: 'completed' as const, completedAt: new Date().toISOString() };
      setCompletedGoal(completed);
    } else {
      setSuccessMsg(`Contributed ${formatCurrency(amount)} to ${contributeModal.name}.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
    setContributeModal(null);
    setContributeAmount('');
  };

  const maxContribution = contributeModal
    ? Math.min(cash?.balance ?? 0, contributeModal.targetAmount - contributeModal.currentAmount)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Goals"
        subtitle="Track your investment goals and progress"
        action={<Button size="sm" leftIcon={<Plus size={16} />} onClick={() => { setNewGoalModal(true); setError(''); }}>New Goal</Button>}
      />

      {successMsg && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-success-50 text-success-700 text-sm">
          <CheckCircle2 size={16} /> {successMsg}
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div>
          <SectionHeader title="Active Goals" />
          <div className="grid lg:grid-cols-2 gap-6">
            {activeGoals.map((g) => {
              const pct = (g.currentAmount / g.targetAmount) * 100;
              const remaining = g.targetAmount - g.currentAmount;
              return (
                <Card key={g.id} hover padding="lg">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: g.color }}>
                        <Target size={22} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-base text-neutral-900">{g.name}</h3>
                        <p className="text-xs text-neutral-500 mt-0.5">{g.description}</p>
                      </div>
                    </div>
                    <Badge variant={g.status === 'active' ? 'success' : 'warning'}>
                      {g.status}
                    </Badge>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-end justify-between mb-2">
                      <div>
                        <p className="text-2xl font-bold text-neutral-900 tabular-nums">{formatCurrency(g.currentAmount)}</p>
                        <p className="text-xs text-neutral-500 mt-0.5">of {formatCurrency(g.targetAmount)}</p>
                      </div>
                      <span className="text-lg font-semibold text-neutral-900 tabular-nums">{pct.toFixed(0)}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-neutral-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: g.color }} />
                    </div>
                    <p className="text-xs text-neutral-400 mt-2">{formatCurrency(remaining)} to go</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-neutral-400 shrink-0" />
                      <div>
                        <p className="text-xs text-neutral-500">Target date</p>
                        <p className="text-sm font-medium text-neutral-900">{formatDate(g.targetDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-neutral-400 shrink-0" />
                      <div>
                        <p className="text-xs text-neutral-500">Monthly</p>
                        <p className="text-sm font-medium text-neutral-900 tabular-nums">{formatCurrency(g.monthlyContribution)}</p>
                      </div>
                    </div>
                  </div>

                  {g.status === 'active' && remaining > 0 && (
                    <Button
                      fullWidth
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      leftIcon={<Plus size={14} />}
                      onClick={() => { setContributeModal(g); setContributeAmount(''); setError(''); }}
                    >
                      Add Contribution
                    </Button>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <SectionHeader title="Completed Goals" />
          <div className="grid lg:grid-cols-2 gap-6">
            {completedGoals.map((g) => (
              <Card key={g.id} padding="lg" className="border-success-200 bg-success-50/30">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: g.color }}>
                      <Trophy size={22} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base text-neutral-900">{g.name}</h3>
                      <p className="text-xs text-neutral-500 mt-0.5">{g.description}</p>
                    </div>
                  </div>
                  <Badge variant="success" dot>Completed</Badge>
                </div>

                <div className="flex items-end justify-between mb-2">
                  <div>
                    <p className="text-2xl font-bold text-neutral-900 tabular-nums">{formatCurrency(g.currentAmount)}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">of {formatCurrency(g.targetAmount)}</p>
                  </div>
                  <span className="text-lg font-semibold text-success-600 tabular-nums">100%</span>
                </div>
                <div className="h-3 rounded-full bg-neutral-100 overflow-hidden">
                  <div className="h-full rounded-full bg-success-500" style={{ width: '100%' }} />
                </div>
                <p className="text-xs text-neutral-400 mt-2">
                  Completed on {g.completedAt ? formatDate(g.completedAt) : '—'}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <Card>
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
              <Target size={28} />
            </div>
            <p className="text-base font-medium text-neutral-900">No goals yet</p>
            <p className="text-sm text-neutral-500 mt-1.5 max-w-sm">Create your first savings or investment goal to start tracking progress.</p>
            <div className="mt-5">
              <Button size="sm" leftIcon={<Plus size={16} />} onClick={() => { setNewGoalModal(true); setError(''); }}>Create Goal</Button>
            </div>
          </div>
        </Card>
      )}

      {/* New Goal Modal */}
      <Modal
        open={newGoalModal}
        onClose={() => setNewGoalModal(false)}
        title="Create New Goal"
        description="Set a new savings or investment goal"
        footer={
          <div className="space-y-3">
            {error && <p className="text-sm text-error-600">{error}</p>}
            <Button fullWidth size="lg" onClick={handleCreateGoal}>Create Goal</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input label="Goal name" placeholder="e.g. Dream Vacation" value={goalName} onChange={(e) => setGoalName(e.target.value)} />
          <Input label="Description" placeholder="What are you saving for?" value={goalDesc} onChange={(e) => setGoalDesc(e.target.value)} />
          <Input label="Target amount (BWP)" type="number" min="1" placeholder="50000" value={goalTarget} onChange={(e) => setGoalTarget(e.target.value)} />
          <Input label="Monthly contribution (BWP)" type="number" min="0" placeholder="1000" value={goalMonthly} onChange={(e) => setGoalMonthly(e.target.value)} />
          <Input label="Target date" type="date" value={goalDate} onChange={(e) => setGoalDate(e.target.value)} />
          <div>
            <p className="text-sm font-medium text-neutral-700 mb-2">Color</p>
            <div className="flex gap-2">
              {GOAL_COLORS.map((c) => (
                <button key={c} onClick={() => setGoalColor(c)} className={`w-8 h-8 rounded-lg transition ${goalColor === c ? 'ring-2 ring-offset-2 ring-neutral-400' : ''}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </div>
      </Modal>

      {/* Contribute Modal */}
      <Modal
        open={contributeModal !== null}
        onClose={() => setContributeModal(null)}
        title="Add Contribution"
        description={contributeModal ? contributeModal.name : ''}
        footer={
          <div className="space-y-3">
            {error && <p className="text-sm text-error-600">{error}</p>}
            <Button fullWidth size="lg" onClick={handleContribute}>
              Contribute {contributeAmount && parseFloat(contributeAmount) > 0 ? formatCurrency(parseFloat(contributeAmount)) : ''}
            </Button>
          </div>
        }
      >
        {contributeModal && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-neutral-50 p-3 text-center">
                <p className="text-xs text-neutral-500">Current</p>
                <p className="text-sm font-semibold text-neutral-900 tabular-nums mt-1">{formatCurrency(contributeModal.currentAmount)}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3 text-center">
                <p className="text-xs text-neutral-500">Target</p>
                <p className="text-sm font-semibold text-neutral-900 tabular-nums mt-1">{formatCurrency(contributeModal.targetAmount)}</p>
              </div>
              <div className="rounded-xl bg-brand-50 p-3 text-center">
                <p className="text-xs text-brand-600">Remaining</p>
                <p className="text-sm font-semibold text-brand-700 tabular-nums mt-1">{formatCurrency(contributeModal.targetAmount - contributeModal.currentAmount)}</p>
              </div>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3 flex items-center justify-between">
              <span className="text-xs text-neutral-500">Available Cash</span>
              <span className="text-sm font-semibold text-neutral-900 tabular-nums">{formatCurrency(cash?.balance ?? 0)}</span>
            </div>
            <Input
              label="Amount (BWP)"
              type="number"
              min="1"
              step="1"
              value={contributeAmount}
              onChange={(e) => setContributeAmount(e.target.value)}
              hint={`Maximum valid contribution: ${formatCurrency(Math.max(0, maxContribution))}`}
            />
            {maxContribution > 0 && (
              <button
                onClick={() => setContributeAmount(String(Math.floor(maxContribution)))}
                className="text-xs text-brand-600 hover:text-brand-700 font-medium"
              >
                Contribute maximum ({formatCurrency(Math.max(0, maxContribution))})
                {maxContribution < (contributeModal.targetAmount - contributeModal.currentAmount) && ' — limited by available cash'}
              </button>
            )}
          </div>
        )}
      </Modal>

      {/* Goal Completion Modal */}
      <Modal
        open={completedGoal !== null}
        onClose={() => setCompletedGoal(null)}
        title="Goal Completed!"
        footer={
          <div className="space-y-2">
            <Button fullWidth size="lg" onClick={() => setCompletedGoal(null)}>View Completed Goal</Button>
            <div className="flex gap-2">
              <Button fullWidth variant="outline" onClick={() => { setCompletedGoal(null); setNewGoalModal(true); setError(''); }}>Create Another Goal</Button>
              <Button fullWidth variant="outline" onClick={() => setCompletedGoal(null)}>Return to Goals</Button>
            </div>
          </div>
        }
      >
        {completedGoal && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-success-50 flex items-center justify-center text-success-600 mx-auto mb-4">
              <Trophy size={32} />
            </div>
            <p className="text-lg font-semibold text-neutral-900 mb-1">Congratulations!</p>
            <p className="text-sm text-neutral-500 mb-4">You have completed your goal:</p>
            <p className="text-base font-medium text-neutral-900">{completedGoal.name}</p>
            <p className="text-2xl font-bold text-success-600 tabular-nums mt-2">
              {formatCurrency(completedGoal.currentAmount)} / {formatCurrency(completedGoal.targetAmount)}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
