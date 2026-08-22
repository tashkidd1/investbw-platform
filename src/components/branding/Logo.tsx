import { TrendingUp } from 'lucide-react';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { box: 'w-7 h-7', icon: 16, text: 'text-base' },
    md: { box: 'w-8 h-8', icon: 18, text: 'text-lg' },
    lg: { box: 'w-10 h-10', icon: 22, text: 'text-xl' },
  };
  const s = sizes[size];
  return (
    <div className="flex items-center gap-2">
      <div className={`${s.box} rounded-xl bg-brand-600 flex items-center justify-center text-white shrink-0`}>
        <TrendingUp size={s.icon} strokeWidth={2.5} />
      </div>
      <span className={`${s.text} font-display font-bold text-neutral-900 tracking-tight`}>
        Invest<span className="text-brand-600">BW</span>
      </span>
    </div>
  );
}
