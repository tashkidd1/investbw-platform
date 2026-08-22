import { useNavigate } from 'react-router-dom';
import {
  TrendingUp, TrendingDown, Shield, ArrowRight, Sprout, Eye, Target,
  BarChart3, UserPlus, Flag, Compass, Briefcase, Globe, Landmark,
  Building2, Coins, CheckCircle2, Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/branding/Logo';
import { useDemo } from '@/hooks/useDemo';
import { formatCurrency, formatPercent } from '@/lib/format';
import { AreaChart, Sparkline } from '@/components/ui/Chart';

export function LandingPage() {
  const navigate = useNavigate();
  const { enterDemo } = useDemo();

  const handleExploreDemo = () => {
    enterDemo();
    navigate('/app');
  };

  const heroChartData = [
    { date: '2026-06-01', value: 9800 },
    { date: '2026-06-08', value: 9950 },
    { date: '2026-06-15', value: 10100 },
    { date: '2026-06-22', value: 10050 },
    { date: '2026-07-01', value: 10200 },
    { date: '2026-07-08', value: 10350 },
    { date: '2026-07-15', value: 10400 },
    { date: '2026-07-22', value: 10380 },
    { date: '2026-07-27', value: 10429 },
  ];

  const heroHoldings = [
    { ticker: 'FNBB', name: 'First National Bank BW', price: 1520.0, change: 0.65, color: '#1B4F8C', spark: [1490, 1495, 1502, 1498, 1510, 1505, 1512, 1518, 1520] },
    { ticker: 'LETS', name: 'Letshego Holdings', price: 1.85, change: 0.8, color: '#2E7D32', spark: [1.78, 1.80, 1.79, 1.82, 1.81, 1.83, 1.84, 1.84, 1.85] },
    { ticker: 'BETF', name: 'Botswana Diversified ETF', price: 28.5, change: 0.45, color: '#5E35B1', spark: [28.1, 28.2, 28.25, 28.3, 28.35, 28.4, 28.45, 28.48, 28.5] },
    { ticker: 'GSPX', name: 'Global S&P 500 ETF', price: 485.0, change: 0.9, color: '#1976D2', spark: [478, 480, 481, 482, 483, 484, 484.5, 484.8, 485] },
  ];

  const features = [
    { icon: Sprout, title: 'Start Small', desc: 'Explore investing with a simulated portfolio and see how your money could work over time.' },
    { icon: Eye, title: 'Understand What You Own', desc: 'Simple explanations of investments, financial terms and portfolio performance.' },
    { icon: Target, title: 'Build Towards Goals', desc: 'Connect investing with goals such as a house, education, retirement or building wealth.' },
    { icon: BarChart3, title: 'Make Better Decisions', desc: 'Portfolio analytics and educational AI tools help you understand your investments.' },
  ];

  const steps = [
    { icon: UserPlus, title: 'Create your profile', desc: 'Set up your account and get P10,000 in virtual funds to start.' },
    { icon: Flag, title: 'Choose your goals', desc: 'Define what you are investing for — a home, education, retirement.' },
    { icon: Compass, title: 'Explore investments', desc: 'Browse Botswana and global securities with clear, simple explanations.' },
    { icon: Briefcase, title: 'Build your portfolio', desc: 'Buy, sell and track your simulated investments with real-time updates.' },
  ];

  const categories = [
    { icon: Landmark, label: 'Botswana', desc: 'BSE-listed equities and bonds', available: true, color: '#2d9568' },
    { icon: Globe, label: 'Global', desc: 'International ETFs and index funds', available: false, color: '#1976D2' },
    { icon: BarChart3, label: 'ETFs', desc: 'Diversified baskets in one trade', available: true, color: '#5E35B1' },
    { icon: Building2, label: 'REITs', desc: 'Real estate investment trusts', available: true, color: '#FF6F00' },
    { icon: Coins, label: 'Dividend Investments', desc: 'Income-generating securities', available: true, color: '#D32F2F' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <Logo size="md" />
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>Sign In</Button>
            <Button size="sm" onClick={handleExploreDemo}>Explore the Demo</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-accent-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-200/15 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16 sm:pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-50 border border-accent-200 text-accent-700 text-xs font-semibold mb-6">
                <Shield size={14} />
                Prototype • Demo Mode • No real money
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-neutral-900 leading-[1.05] tracking-tight mb-6">
                Investing made simple.
              </h1>
              <p className="text-lg text-neutral-600 leading-relaxed mb-8 max-w-lg">
                Explore investments, build your portfolio and learn how to grow your wealth —
                starting from small amounts.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" onClick={handleExploreDemo} rightIcon={<ArrowRight size={20} />}>
                  Explore the Demo
                </Button>
                <Button variant="outline" size="lg" onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  How It Works
                </Button>
              </div>
            </div>

            {/* Right: Dashboard preview */}
            <div className="animate-fade-in">
              <div className="relative">
                {/* Main card */}
                <div className="card-surface p-5 sm:p-6 shadow-elevated">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-neutral-500">Portfolio Value</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-50 text-accent-700 text-2xs font-semibold">
                      <Shield size={10} /> DEMO
                    </span>
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-neutral-900 tabular-nums">{formatCurrency(10429)}</p>
                  <div className="flex items-center gap-2 mt-1 mb-4">
                    <span className="flex items-center gap-1 text-sm font-semibold text-success-600 tabular-nums">
                      <TrendingUp size={14} />
                      {formatCurrency(49)} today
                    </span>
                    <span className="text-xs text-neutral-400">+{formatPercent(0.47)}</span>
                  </div>

                  {/* Chart */}
                  <AreaChart data={heroChartData} height={140} />

                  {/* Holdings */}
                  <div className="mt-5 pt-4 border-t border-neutral-100 space-y-2.5">
                    {heroHoldings.map((h) => {
                      const isUp = h.change >= 0;
                      return (
                        <div key={h.ticker} className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-2xs font-bold" style={{ backgroundColor: h.color }}>
                              {h.ticker.slice(0, 2)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-neutral-900">{h.ticker}</p>
                              <p className="text-2xs text-neutral-500">{h.name}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Sparkline data={h.spark} width={48} height={20} color={isUp ? '#2d9568' : '#ef4444'} fill={false} strokeWidth={1.5} />
                            <div className="text-right">
                              <p className="text-sm font-semibold tabular-nums">{formatCurrency(h.price)}</p>
                              <p className={`text-2xs tabular-nums ${isUp ? 'text-success-600' : 'text-error-600'}`}>
                                {formatPercent(h.change)}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 sm:-right-5 bg-white rounded-xl shadow-elevated px-3 py-2 border border-neutral-100 hidden sm:flex items-center gap-2 animate-pulse-soft">
                  <div className="w-7 h-7 rounded-lg bg-success-50 flex items-center justify-center text-success-600">
                    <TrendingUp size={16} />
                  </div>
                  <div>
                    <p className="text-2xs text-neutral-500">All-time gain</p>
                    <p className="text-sm font-bold text-success-600 tabular-nums">+{formatPercent(3.71)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why InvestBW */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-brand-600 uppercase tracking-wide mb-2">Why InvestBW</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-4">
            Built for first-time investors
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Everything you need to understand investing, practice safely, and build toward your goals.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div key={i} className="card-surface p-6 hover:shadow-elevated transition group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 shrink-0 group-hover:bg-brand-600 group-hover:text-white transition">
                  <f.icon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-neutral-50 border-y border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-brand-600 uppercase tracking-wide mb-2">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-4">
              Get started in four steps
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                <div className="card-surface p-6 h-full">
                  <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white mb-4">
                    <s.icon size={24} />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">STEP {i + 1}</span>
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                    <ArrowRight className="text-neutral-300" size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment Categories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-brand-600 uppercase tracking-wide mb-2">Investment Categories</p>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-4">
            A range of options to explore
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            From Botswana equities to global ETFs — discover different types of investments in demo mode.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c, i) => (
            <div key={i} className={`card-surface p-5 transition ${c.available ? 'hover:shadow-elevated' : 'opacity-75'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white" style={{ backgroundColor: c.color }}>
                  <c.icon size={22} />
                </div>
                {!c.available && (
                  <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 text-2xs font-semibold">
                    Coming Later
                  </span>
                )}
              </div>
              <h3 className="text-base font-semibold text-neutral-900 mb-1">{c.label}</h3>
              <p className="text-sm text-neutral-500">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Accessibility */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-brand-100 text-xs font-medium mb-6">
            <Sparkles size={14} />
            Designed for everyone
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight">
            Investing shouldn't feel complicated.
          </h2>
          <p className="text-lg text-brand-100 leading-relaxed max-w-2xl mx-auto mb-8">
            InvestBW is built for beginners who want to understand how investing works,
            while still providing useful analytics for more experienced investors.
            Clear language, simple tools, and no jargon — just a straightforward way to learn.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Plain-language explanations', 'Beginner-friendly interface', 'Educational AI assistant', 'No real money at risk'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-brand-100">
                <CheckCircle2 size={16} className="text-brand-300" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-4">
          Explore the InvestBW Demo
        </h2>
        <p className="text-lg text-neutral-600 mb-8 max-w-xl mx-auto">
          Get instant access with P10,000 in virtual funds and a pre-built demo portfolio.
          No sign-up required.
        </p>
        <Button size="lg" onClick={handleExploreDemo} rightIcon={<ArrowRight size={20} />}>
          Launch Demo Account
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo size="sm" />
              <p className="text-sm text-neutral-500 mt-3 max-w-xs">
                A modern investment platform prototype built for Botswana and African markets.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900 mb-3">Product</p>
              <ul className="space-y-2">
                <li><button onClick={handleExploreDemo} className="text-sm text-neutral-500 hover:text-brand-600 transition">Demo</button></li>
                <li><button onClick={() => navigate('/app/learn')} className="text-sm text-neutral-500 hover:text-brand-600 transition">Learn</button></li>
                <li><button onClick={() => navigate('/app/markets')} className="text-sm text-neutral-500 hover:text-brand-600 transition">Markets</button></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900 mb-3">Company</p>
              <ul className="space-y-2">
                <li><button className="text-sm text-neutral-500 hover:text-brand-600 transition">About</button></li>
                <li><button className="text-sm text-neutral-500 hover:text-brand-600 transition">Help</button></li>
                <li><button className="text-sm text-neutral-500 hover:text-brand-600 transition">Privacy</button></li>
                <li><button className="text-sm text-neutral-500 hover:text-brand-600 transition">Terms</button></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900 mb-3">Demo Disclaimer</p>
              <p className="text-xs text-neutral-500 leading-relaxed">
                InvestBW is currently a prototype. No real financial transactions are processed.
                All securities, prices, and data are simulated.
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-neutral-400">
              © 2026 InvestBW. Prototype — not a real brokerage. Nothing here constitutes financial advice.
            </p>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-50 text-accent-700 text-2xs font-semibold">
              <Shield size={12} /> Demo Mode — No real money
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
