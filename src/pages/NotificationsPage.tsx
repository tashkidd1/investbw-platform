import { Bell, Check, CheckCheck } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader, EmptyState } from '@/components/ui/PageHeader';
import { useDemo } from '@/hooks/useDemo';
import { timeAgo } from '@/lib/format';
import type { NotificationType } from '@/types';

const typeColors: Record<NotificationType, 'brand' | 'success' | 'warning' | 'accent' | 'neutral'> = {
  price_alert: 'warning',
  goal_update: 'brand',
  dividend: 'success',
  education: 'accent',
  system: 'neutral',
};

export function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useDemo();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Notifications"
        subtitle={`${unreadCount} unread of ${notifications.length} total`}
        action={unreadCount > 0 ? (
          <Button variant="outline" size="sm" leftIcon={<CheckCheck size={16} />} onClick={markAllNotificationsRead}>
            Mark all read
          </Button>
        ) : undefined}
      />

      <div className="space-y-2">
        {notifications.map((n) => (
          <Card key={n.id} hover padding="sm" className={`flex items-start gap-3 ${n.read ? 'opacity-70' : ''}`}>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              n.read ? 'bg-neutral-100 text-neutral-400' : 'bg-brand-50 text-brand-600'
            }`}>
              <Bell size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-neutral-900">{n.title}</p>
                <Badge variant={typeColors[n.type]}>{n.type.replace('_', ' ')}</Badge>
                {!n.read && <span className="w-2 h-2 rounded-full bg-brand-500" />}
              </div>
              <p className="text-sm text-neutral-500 mt-0.5">{n.message}</p>
              <p className="text-2xs text-neutral-400 mt-1">{timeAgo(n.date)}</p>
            </div>
            {!n.read && (
              <button
                onClick={() => markNotificationRead(n.id)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 transition shrink-0"
                title="Mark as read"
              >
                <Check size={16} className="text-neutral-400" />
              </button>
            )}
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card>
          <EmptyState icon={<Bell size={28} />} title="No notifications yet" description="You're all caught up. New activity will appear here." />
        </Card>
      )}
    </div>
  );
}
