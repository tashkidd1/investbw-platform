import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mail, Lock, User, Eye, EyeOff, Check, Shield, TrendingUp,
  ArrowRight, Sparkles, Wallet, Target, BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/branding/Logo';
import { useDemo } from '@/hooks/useDemo';
import { supabase } from '@/lib/supabase';

type Tab = 'signup' | 'login' | 'demo';

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  checks: { label: string; passed: boolean }[];
}

function checkPasswordStrength(pw: string): PasswordStrength {
  const checks = [
    { label: 'At least 8 characters', passed: pw.length >= 8 },
    { label: 'Contains uppercase letter', passed: /[A-Z]/.test(pw) },
    { label: 'Contains number', passed: /\d/.test(pw) },
    { label: 'Contains special character', passed: /[^A-Za-z0-9]/.test(pw) },
  ];
  const score = checks.filter((c) => c.passed).length;
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['#ef4444', '#f59e0b', '#f59e0b', '#2d9568', '#2d9568'];
  return { score, label: labels[score], color: colors[score], checks };
}

export function AuthPage() {
  const navigate = useNavigate();
  const { enterDemo } = useDemo();
  const [tab, setTab] = useState<Tab>('login');

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const strength = checkPasswordStrength(password);

  const handleExploreDemo = useCallback(() => {
    enterDemo();
    navigate('/app');
  }, [enterDemo, navigate]);

  const validateSignup = (): boolean => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'First name is required';
    if (!lastName.trim()) e.lastName = 'Last name is required';
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 8) e.password = 'Password must be at least 8 characters';
    if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) e.terms = 'You must agree to the terms to continue';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateLogin = (): boolean => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validateSignup()) return;
    setLoading(true);
    setAuthError('');
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { first_name: firstName.trim(), last_name: lastName.trim() } },
      });
      if (error) throw error;
      // Enter demo mode so user can explore immediately, then go to onboarding
      enterDemo();
      if (data.user) {
        navigate('/onboarding');
      } else {
        navigate('/app');
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    setLoading(true);
    setAuthError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      enterDemo();
      navigate('/app');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-brand-400/10 rounded-full blur-3xl" />

        <div className="relative">
          <Logo size="lg" />
        </div>

        <div className="relative text-white">
          <h2 className="text-3xl font-display font-bold mb-4 leading-tight">
            Start your investment journey today
          </h2>
          <p className="text-brand-100 text-lg leading-relaxed max-w-md mb-8">
            Explore Botswana and global markets with a modern, educational
            investment platform built for everyone.
          </p>
          <div className="space-y-3">
            {[
              { icon: Wallet, text: 'P10,000 virtual funds to practice with' },
              { icon: Target, text: 'Goal-based investing for your future' },
              { icon: BarChart3, text: 'Portfolio analytics and educational tools' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-brand-100">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <item.icon size={16} />
                </div>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-brand-200 text-sm">
          Demo Mode — All funds and securities are simulated. No real trading.
        </p>
      </div>

      {/* Right panel — forms */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-neutral-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo size="md" />
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-neutral-100 rounded-xl mb-6">
            <TabButton active={tab === 'login'} onClick={() => { setTab('login'); setAuthError(''); setErrors({}); }}>
              Log In
            </TabButton>
            <TabButton active={tab === 'signup'} onClick={() => { setTab('signup'); setAuthError(''); setErrors({}); }}>
              Create Account
            </TabButton>
            <TabButton active={tab === 'demo'} onClick={() => { setTab('demo'); setAuthError(''); setErrors({}); }}>
              Explore Demo
            </TabButton>
          </div>

          {authError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-error-50 border border-error-200 text-error-700 text-sm">
              {authError}
            </div>
          )}

          {/* LOGIN */}
          {tab === 'login' && (
            <div className="animate-fade-in space-y-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-neutral-900 mb-1">Welcome back</h1>
                <p className="text-sm text-neutral-500">Sign in to your InvestBW account</p>
              </div>

              <form
                onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
                className="space-y-4"
              >
                <PasswordField
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail size={16} />}
                  value={email}
                  onChange={(v) => setEmail(v)}
                  error={errors.email}
                />

                <PasswordField
                  label="Password"
                  type="password"
                  placeholder="Enter your password"
                  leftIcon={<Lock size={16} />}
                  value={password}
                  onChange={(v) => setPassword(v)}
                  error={errors.password}
                  showToggle
                  showValue={showPassword}
                  onToggleShow={() => setShowPassword(!showPassword)}
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-brand-600 focus:ring-brand-500/20" />
                    <span className="text-sm text-neutral-600">Remember me</span>
                  </label>
                  <button type="button" className="text-sm text-brand-600 font-medium hover:text-brand-700">
                    Forgot password?
                  </button>
                </div>

                <Button type="submit" fullWidth size="lg" loading={loading} leftIcon={<TrendingUp size={18} />}>
                  Log In
                </Button>
              </form>

              <Divider />

              <Button variant="outline" fullWidth size="lg" onClick={handleExploreDemo} leftIcon={<Sparkles size={18} />}>
                Explore Demo Account
              </Button>

              <p className="text-center text-sm text-neutral-500">
                Don't have an account?{' '}
                <button onClick={() => setTab('signup')} className="text-brand-600 font-medium hover:text-brand-700">
                  Create one
                </button>
              </p>
            </div>
          )}

          {/* SIGNUP */}
          {tab === 'signup' && (
            <div className="animate-fade-in space-y-4">
              <div>
                <h1 className="text-2xl font-display font-bold text-neutral-900 mb-1">Create your account</h1>
                <p className="text-sm text-neutral-500">Start exploring with a free InvestBW account</p>
              </div>

              <form
                onSubmit={(e) => { e.preventDefault(); handleSignup(); }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-3">
                  <PasswordField
                    label="First name"
                    placeholder="Thabo"
                    leftIcon={<User size={16} />}
                    value={firstName}
                    onChange={(v) => setFirstName(v)}
                    error={errors.firstName}
                  />
                  <PasswordField
                    label="Last name"
                    placeholder="Molefe"
                    leftIcon={<User size={16} />}
                    value={lastName}
                    onChange={(v) => setLastName(v)}
                    error={errors.lastName}
                  />
                </div>

                <PasswordField
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail size={16} />}
                  value={email}
                  onChange={(v) => setEmail(v)}
                  error={errors.email}
                />

                <PasswordField
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                  leftIcon={<Lock size={16} />}
                  value={password}
                  onChange={(v) => setPassword(v)}
                  error={errors.password}
                  showToggle
                  showValue={showPassword}
                  onToggleShow={() => setShowPassword(!showPassword)}
                />

                {/* Password strength */}
                {password.length > 0 && (
                  <div className="animate-fade-in">
                    <div className="flex gap-1 mb-2">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-1.5 flex-1 rounded-full transition-all duration-300"
                          style={{
                            backgroundColor: i < strength.score ? strength.color : '#e2e8f0',
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium" style={{ color: strength.color }}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {strength.checks.map((c, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <div
                            className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition"
                            style={{ backgroundColor: c.passed ? strength.color : '#e2e8f0' }}
                          >
                            {c.passed && <Check size={10} className="text-white" />}
                          </div>
                          <span className={`text-2xs ${c.passed ? 'text-neutral-600' : 'text-neutral-400'}`}>
                            {c.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <PasswordField
                  label="Confirm password"
                  type="password"
                  placeholder="Re-enter your password"
                  leftIcon={<Lock size={16} />}
                  value={confirmPassword}
                  onChange={(v) => setConfirmPassword(v)}
                  error={errors.confirmPassword}
                  showToggle
                  showValue={showConfirm}
                  onToggleShow={() => setShowConfirm(!showConfirm)}
                />

                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-neutral-300 text-brand-600 focus:ring-brand-500/20 shrink-0"
                  />
                  <span className="text-sm text-neutral-600">
                    I agree to the{' '}
                    <button type="button" className="text-brand-600 font-medium hover:text-brand-700">Terms of Service</button>
                    {' '}and{' '}
                    <button type="button" className="text-brand-600 font-medium hover:text-brand-700">Privacy Policy</button>
                  </span>
                </label>
                {errors.terms && <p className="text-xs text-error-600 -mt-2">{errors.terms}</p>}

                <Button type="submit" fullWidth size="lg" loading={loading} rightIcon={<ArrowRight size={18} />}>
                  Create Account
                </Button>
              </form>

              <Divider />

              <Button variant="outline" fullWidth size="lg" onClick={handleExploreDemo} leftIcon={<Sparkles size={18} />}>
                Explore Demo Account
              </Button>

              <p className="text-center text-sm text-neutral-500">
                Already have an account?{' '}
                <button onClick={() => setTab('login')} className="text-brand-600 font-medium hover:text-brand-700">
                  Log in
                </button>
              </p>
            </div>
          )}

          {/* DEMO */}
          {tab === 'demo' && (
            <div className="animate-fade-in">
              <div className="text-center py-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-50 border border-accent-200 text-accent-700 text-sm font-semibold mb-6">
                  <Shield size={16} />
                  DEMO MODE — SIMULATED INVESTING
                </div>

                <h1 className="text-3xl font-display font-bold text-neutral-900 mb-3">
                  Explore the full platform
                </h1>
                <p className="text-base text-neutral-600 leading-relaxed max-w-sm mx-auto mb-8">
                  Try InvestBW using a simulated{' '}
                  <span className="font-semibold text-brand-600">P10,000 portfolio</span>.
                  No real money is involved — explore freely with no sign-up required.
                </p>

                {/* What you get */}
                <div className="card-surface p-5 text-left space-y-3 mb-6">
                  {[
                    { icon: Wallet, label: 'P10,000 virtual cash balance' },
                    { icon: BarChart3, label: 'Pre-built portfolio with 5 holdings' },
                    { icon: Target, label: '3 active investment goals' },
                    { icon: TrendingUp, label: 'Simulated transaction history' },
                    { icon: Sparkles, label: 'Full access to all features' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                        <item.icon size={16} />
                      </div>
                      <span className="text-sm text-neutral-700">{item.label}</span>
                      <Check size={16} className="text-success-500 ml-auto" />
                    </div>
                  ))}
                </div>

                <Button fullWidth size="lg" onClick={handleExploreDemo} rightIcon={<ArrowRight size={20} />}>
                  Enter Demo Now
                </Button>

                <p className="text-xs text-neutral-400 mt-4 max-w-xs mx-auto">
                  No registration required. Your demo session is temporary and
                  resets when you exit. All data is fictional.
                </p>
              </div>

              <Divider />

              <p className="text-center text-sm text-neutral-500">
                Want a real account?{' '}
                <button onClick={() => setTab('signup')} className="text-brand-600 font-medium hover:text-brand-700">
                  Sign up
                </button>
                {' '}or{' '}
                <button onClick={() => setTab('login')} className="text-brand-600 font-medium hover:text-brand-700">
                  Log in
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Helper components ---

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all ${
        active
          ? 'bg-white text-neutral-900 shadow-sm'
          : 'text-neutral-500 hover:text-neutral-700'
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return (
    <div className="relative my-5">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-neutral-200" />
      </div>
      <div className="relative flex justify-center">
        <span className="px-3 bg-neutral-50 text-xs text-neutral-400">or</span>
      </div>
    </div>
  );
}

interface PasswordFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  showToggle?: boolean;
  showValue?: boolean;
  onToggleShow?: () => void;
}

function PasswordField({
  label, type = 'text', placeholder, leftIcon, value, onChange, error,
  showToggle, showValue, onToggleShow,
}: PasswordFieldProps) {
  const isPassword = type === 'password';
  const inputType = isPassword && showToggle ? (showValue ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-neutral-700 mb-1.5">{label}</label>
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`input-base ${leftIcon ? 'pl-10' : ''} ${showToggle ? 'pr-10' : ''} ${error ? 'border-error-400 focus:ring-error-500/20 focus:border-error-500' : ''}`}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggleShow}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition"
          >
            {showValue ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-error-600">{error}</p>}
    </div>
  );
}
