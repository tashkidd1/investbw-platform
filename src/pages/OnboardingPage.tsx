import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, ArrowLeft, Check, User, Target, Compass,
  Briefcase, Sparkles, Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/branding/Logo';

const steps = [
  {
    icon: User,
    title: 'Welcome to InvestBW',
    subtitle: 'Let\'s set up your profile in a few quick steps.',
  },
  {
    icon: Target,
    title: 'What are you investing for?',
    subtitle: 'Choose your goals — you can change these later.',
    options: [
      { label: 'Buying a home', icon: '🏠', desc: '' },
      { label: 'Children\'s education', icon: '🎓', desc: '' },
      { label: 'Retirement', icon: '🏖️', desc: '' },
      { label: 'Building wealth', icon: '📈', desc: '' },
      { label: 'Emergency fund', icon: '🛡️', desc: '' },
      { label: 'Just exploring', icon: '🔍', desc: '' },
    ],
  },
  {
    icon: Compass,
    title: 'What\'s your experience level?',
    subtitle: 'We\'ll tailor content and suggestions to your level.',
    options: [
      { label: 'Complete beginner', desc: 'I\'m new to investing', icon: '🌱' },
      { label: 'Some experience', desc: 'I know the basics', icon: '🌿' },
      { label: 'Experienced investor', desc: 'I understand markets well', icon: '🌳' },
    ],
  },
  {
    icon: Briefcase,
    title: 'You\'re all set!',
    subtitle: 'Your demo portfolio is ready with P10,000 in virtual funds.',
  },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [experience, setExperience] = useState('');

  const isLastStep = step === steps.length - 1;
  const canProceed = step === 0 || step === 3 || (step === 1 && selectedGoals.length > 0) || (step === 2 && experience !== '');

  const handleNext = () => {
    if (isLastStep) {
      navigate('/app');
    } else {
      setStep(step + 1);
    }
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const current = steps[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-accent-50 flex flex-col">
      {/* Header */}
      <header className="px-4 sm:px-6 py-4 flex items-center justify-between">
        <Logo size="md" />
        <div className="flex items-center gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-brand-600' : i < step ? 'w-4 bg-brand-400' : 'w-4 bg-neutral-200'
              }`}
            />
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8 animate-fade-in" key={step}>
            <div className="w-16 h-16 rounded-2xl bg-brand-600 flex items-center justify-center text-white mx-auto mb-5">
              <current.icon size={32} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 mb-2">
              {current.title}
            </h1>
            <p className="text-base text-neutral-500">{current.subtitle}</p>
          </div>

          {/* Step content */}
          <div className="animate-slide-up" key={`content-${step}`}>
            {step === 0 && (
              <div className="card-surface p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                    <Shield size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Demo Mode Active</p>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      You\'re exploring with a simulated P10,000 portfolio. No real money is involved —
                      everything here is for learning and exploration.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent-50 flex items-center justify-center text-accent-600 shrink-0">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">Full Access</p>
                    <p className="text-sm text-neutral-500 mt-0.5">
                      You can buy, sell, set goals, explore markets, use the AI assistant,
                      and browse educational content — all with virtual funds.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-3">
                {current.options!.map((opt) => {
                  const selected = selectedGoals.includes(opt.label);
                  return (
                    <button
                      key={opt.label}
                      onClick={() => toggleGoal(opt.label)}
                      className={`card-surface p-4 text-left transition hover:shadow-elevated ${
                        selected ? 'border-brand-500 ring-2 ring-brand-500/20' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{opt.icon}</span>
                        {selected && (
                          <div className="w-5 h-5 rounded-full bg-brand-600 flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-neutral-900 mt-2">{opt.label}</p>
                    </button>
                  );
                })}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                {current.options!.map((opt) => {
                  const selected = experience === opt.label;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => setExperience(opt.label)}
                      className={`card-surface p-4 w-full text-left transition hover:shadow-elevated flex items-center gap-4 ${
                        selected ? 'border-brand-500 ring-2 ring-brand-500/20' : ''
                      }`}
                    >
                      <span className="text-3xl">{opt.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-neutral-900">{opt.label}</p>
                        <p className="text-sm text-neutral-500">{opt.desc}</p>
                      </div>
                      {selected && (
                        <div className="w-6 h-6 rounded-full bg-brand-600 flex items-center justify-center shrink-0">
                          <Check size={14} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {step === 3 && (
              <div className="card-surface p-8 text-center">
                <div className="w-20 h-20 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-5">
                  <Check size={40} className="text-success-600" />
                </div>
                <h2 className="text-xl font-display font-bold text-neutral-900 mb-2">
                  Your portfolio is ready
                </h2>
                <p className="text-sm text-neutral-500 mb-6 max-w-sm mx-auto">
                  You now have P10,000 in virtual cash and a pre-built demo portfolio.
                  Start exploring markets, set goals, and learn at your own pace.
                </p>
                {selectedGoals.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {selectedGoals.map((g) => (
                      <span key={g} className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-medium">
                        {g}
                      </span>
                    ))}
                  </div>
                )}
                {experience && (
                  <p className="text-xs text-neutral-400 mb-4">
                    Experience level: {experience}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 0 ? (
              <Button variant="ghost" size="md" onClick={() => setStep(step - 1)} leftIcon={<ArrowLeft size={16} />}>
                Back
              </Button>
            ) : (
              <button
                onClick={() => navigate('/app')}
                className="text-sm text-neutral-400 hover:text-neutral-600 transition"
              >
                Skip for now
              </button>
            )}
            <Button
              size="lg"
              onClick={handleNext}
              disabled={!canProceed}
              rightIcon={isLastStep ? <Sparkles size={18} /> : <ArrowRight size={18} />}
            >
              {isLastStep ? 'Enter Dashboard' : 'Continue'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
