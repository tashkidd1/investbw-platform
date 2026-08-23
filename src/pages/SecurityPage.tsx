import { Shield, Lock, Smartphone, Mail, Eye, Key } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';

export function SecurityPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Security" subtitle="Manage your account security" />

      <Card className="bg-accent-50 border-accent-100">
        <div className="flex items-start gap-3">
          <Shield size={20} className="text-accent-600 mt-0.5 shrink-0" />
          <p className="text-sm text-accent-700">
            This is a demo account. Security settings are shown for illustration only and are not fully functional in prototype mode.
          </p>
        </div>
      </Card>

      <div className="space-y-3">
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
                <Lock size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">Password</p>
                <p className="text-xs text-neutral-500">Last changed 30 days ago</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Change</Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center text-success-600">
                <Smartphone size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-neutral-900">Two-Factor Authentication</p>
                  <Badge variant="success" dot>Enabled</Badge>
                </div>
                <p className="text-xs text-neutral-500">Protects your account with an extra step</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">Email Verification</p>
                <p className="text-xs text-neutral-500">demo@investbw.app</p>
              </div>
            </div>
            <Badge variant="success" dot>Verified</Badge>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600">
                <Eye size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">Login Activity</p>
                <p className="text-xs text-neutral-500">View recent sign-in activity</p>
              </div>
            </div>
            <Button variant="outline" size="sm">View</Button>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600">
                <Key size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">Active Sessions</p>
                <p className="text-xs text-neutral-500">1 active session on this device</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Manage</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
