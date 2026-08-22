import { useNavigate } from 'react-router-dom';
import { Bell, Shield, HelpCircle, LogOut, ChevronRight, BadgeCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { useDemo } from '@/hooks/useDemo';
import { formatDate } from '@/lib/format';

export function ProfilePage() {
  const { profile, exitDemo } = useDemo();
  const navigate = useNavigate();

  const handleExitDemo = () => {
    exitDemo();
    navigate('/');
  };

  const menuItems = [
    { icon: Bell, label: 'Notifications', to: '/app/notifications' },
    { icon: Shield, label: 'Security', to: '/app/security' },
    { icon: HelpCircle, label: 'Help & Support', to: '/app/help' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Profile" />

      <Card>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: profile?.avatarColor ?? '#2d9568' }}>
            {profile?.displayName?.split(' ').map((w) => w[0]).join('') ?? '?'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-neutral-900">{profile?.displayName ?? 'Investor'}</h2>
              {profile?.isDemo && <Badge variant="accent" dot>Demo Account</Badge>}
            </div>
            <p className="text-sm text-neutral-500">{profile?.email ?? 'demo@investbw.app'}</p>
            <p className="text-xs text-neutral-400 mt-1">Joined {formatDate(profile?.joinedDate ?? new Date())}</p>
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        {menuItems.map((item) => (
          <Card key={item.label} hover padding="sm" onClick={() => navigate(item.to)} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-600">
                <item.icon size={18} />
              </div>
              <span className="text-sm font-medium text-neutral-900">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-neutral-300" />
          </Card>
        ))}
      </div>

      <Card className="bg-accent-50 border-accent-100">
        <div className="flex items-start gap-3">
          <BadgeCheck size={20} className="text-accent-600 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-accent-800">Demo Mode Active</p>
            <p className="text-xs text-accent-600 mt-1">
              You are using a demo account with simulated funds. No real money is involved.
              Exit demo to return to the landing page.
            </p>
            <Button variant="outline" size="sm" className="mt-3" leftIcon={<LogOut size={14} />} onClick={handleExitDemo}>
              Exit Demo
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
