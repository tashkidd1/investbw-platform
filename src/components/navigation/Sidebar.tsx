import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home, BarChart3, Briefcase, Target, Repeat, Star, GraduationCap,
  Bot, Wallet, ArrowLeftRight, Bell, User, Settings, HelpCircle, LogOut,
  MoreHorizontal, X,
} from 'lucide-react';
import { Logo } from '@/components/branding/Logo';
import { DemoModeIndicator } from '@/components/branding/DemoModeIndicator';
import { useDemo } from '@/hooks/useDemo';
import { useState } from 'react';

const mainNav = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/app/markets', label: 'Markets', icon: BarChart3 },
  { to: '/app/portfolio', label: 'Portfolio', icon: Briefcase },
  { to: '/app/goals', label: 'Goals', icon: Target },
  { to: '/app/auto-invest', label: 'Auto-Invest', icon: Repeat },
  { to: '/app/watchlist', label: 'Watchlist', icon: Star },
];

const learnNav = [
  { to: '/app/learn', label: 'Learn', icon: GraduationCap },
  { to: '/app/assistant', label: 'Invest Assistant', icon: Bot },
];

const accountNav = [
  { to: '/app/cash', label: 'Cash', icon: Wallet },
  { to: '/app/transactions', label: 'Transactions', icon: ArrowLeftRight },
];

const bottomNav = [
  { to: '/app/profile', label: 'Profile', icon: User },
  { to: '/app/help', label: 'Help', icon: HelpCircle },
];

function NavGroup({ label, items }: { label: string; items: typeof mainNav }) {
  return (
    <div className="mb-1">
      <p className="px-3 py-2 text-2xs font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
      <div className="space-y-0.5">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`
            }
          >
            <item.icon size={18} strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export function Sidebar() {
  const { isDemoMode, exitDemo } = useDemo();
  const navigate = useNavigate();

  const handleExitDemo = () => {
    exitDemo();
    navigate('/');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-white border-r border-neutral-200 sticky top-0">
      <div className="px-5 py-5 border-b border-neutral-100">
        <Logo />
      </div>
      {isDemoMode && (
        <div className="px-5 py-3">
          <DemoModeIndicator />
        </div>
      )}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        <NavGroup label="Main" items={mainNav} />
        <NavGroup label="Learn" items={learnNav} />
        <NavGroup label="Account" items={accountNav} />
      </nav>
      <div className="border-t border-neutral-100 px-3 py-3 space-y-0.5">
        {bottomNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              }`
            }
          >
            <item.icon size={18} strokeWidth={2} />
            {item.label}
          </NavLink>
        ))}
        {isDemoMode && (
          <button
            onClick={handleExitDemo}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition w-full"
          >
            <LogOut size={18} strokeWidth={2} />
            Exit Demo
          </button>
        )}
      </div>
    </aside>
  );
}

const mobileNav = [
  { to: '/app', label: 'Home', icon: Home, end: true },
  { to: '/app/markets', label: 'Markets', icon: BarChart3 },
  { to: '/app/portfolio', label: 'Portfolio', icon: Briefcase },
  { to: '/app/goals', label: 'Goals', icon: Target },
];

const moreNavItems = [
  { to: '/app/watchlist', label: 'Watchlist', icon: Star },
  { to: '/app/auto-invest', label: 'Auto-Invest', icon: Repeat },
  { to: '/app/learn', label: 'Learn', icon: GraduationCap },
  { to: '/app/assistant', label: 'Invest Assistant', icon: Bot },
  { to: '/app/cash', label: 'Cash', icon: Wallet },
  { to: '/app/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/app/notifications', label: 'Notifications', icon: Bell },
  { to: '/app/profile', label: 'Profile', icon: User },
  { to: '/app/security', label: 'Security', icon: Settings },
  { to: '/app/help', label: 'Help', icon: HelpCircle },
];

export function MobileNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const navigate = useNavigate();
  const { isDemoMode, exitDemo } = useDemo();

  const handleExitDemo = () => {
    exitDemo();
    navigate('/');
  };

  return (
    <>
      {/* More sheet overlay */}
      {moreOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm animate-fade-in"
            onClick={() => setMoreOpen(false)}
          />
          <div className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl shadow-elevated animate-slide-up pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
              <h2 className="text-base font-semibold text-neutral-900">More</h2>
              <button
                onClick={() => setMoreOpen(false)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 transition"
              >
                <X size={20} className="text-neutral-500" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1 p-3">
              {moreNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMoreOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-neutral-600 hover:bg-neutral-50'
                    }`
                  }
                >
                  <item.icon size={18} strokeWidth={2} />
                  {item.label}
                </NavLink>
              ))}
            </div>
            {isDemoMode && (
              <div className="px-3 pb-3">
                <button
                  onClick={handleExitDemo}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-error-600 hover:bg-error-50 transition w-full"
                >
                  <LogOut size={18} strokeWidth={2} />
                  Exit Demo
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-neutral-200 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around px-2 py-1.5">
          {mobileNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-2xs font-medium transition min-w-[60px] ${
                  isActive ? 'text-brand-600' : 'text-neutral-400'
                }`
              }
            >
              <item.icon size={22} strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={() => setMoreOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-2xs font-medium text-neutral-400 hover:text-neutral-600 transition min-w-[60px]"
          >
            <MoreHorizontal size={22} strokeWidth={2} />
            More
          </button>
        </div>
      </nav>
    </>
  );
}
