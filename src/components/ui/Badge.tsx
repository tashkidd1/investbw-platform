import { type ReactNode } from 'react';

type Variant = 'neutral' | 'success' | 'warning' | 'error' | 'brand' | 'accent';

interface BadgeProps {
  children: ReactNode;
  variant?: Variant;
  size?: 'sm' | 'md';
  dot?: boolean;
}

const variantClasses: Record<Variant, string> = {
  neutral: 'bg-neutral-100 text-neutral-600',
  success: 'bg-success-50 text-success-700',
  warning: 'bg-warning-50 text-warning-700',
  error: 'bg-error-50 text-error-700',
  brand: 'bg-brand-50 text-brand-700',
  accent: 'bg-accent-50 text-accent-700',
};

const dotColors: Record<Variant, string> = {
  neutral: 'bg-neutral-400',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  brand: 'bg-brand-500',
  accent: 'bg-accent-500',
};

export function Badge({ children, variant = 'neutral', size = 'sm', dot = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${size === 'sm' ? 'px-2 py-0.5 text-2xs' : 'px-2.5 py-1 text-xs'} font-medium rounded-full ${variantClasses[variant]}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
