import { Shield } from 'lucide-react';

export function DemoModeIndicator({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent-100 text-accent-700 text-2xs font-semibold uppercase tracking-wide">
        <Shield size={10} />
        Demo
      </span>
    );
  }
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-50 border border-accent-200 text-accent-700 text-xs font-medium">
      <Shield size={14} />
      <span>Demo Mode — Simulated funds, no real trading</span>
    </div>
  );
}
