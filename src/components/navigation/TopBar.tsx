import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { useDemo } from '@/hooks/useDemo';
import { formatCurrency } from '@/lib/format';

export function TopBar() {
  const { cash, notifications, profile } = useDemo();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-200">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search investments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => navigate('/app/markets')}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-neutral-100 border border-transparent focus:bg-white focus:border-neutral-300 focus:outline-none transition"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {cash && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-50 border border-brand-100">
              <span className="text-xs text-brand-700 font-medium">Cash</span>
              <span className="text-sm font-semibold text-brand-800 tabular-nums">{formatCurrency(cash.balance)}</span>
            </div>
          )}
          <button
            onClick={() => navigate('/app/notifications')}
            className="relative p-2 rounded-xl hover:bg-neutral-100 transition"
          >
            <Bell size={20} className="text-neutral-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-error-500 text-white text-2xs font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {profile && (
            <button
              onClick={() => navigate('/app/profile')}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
              style={{ backgroundColor: profile.avatarColor }}
            >
              {profile.displayName.split(' ').map((w) => w[0]).join('')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
