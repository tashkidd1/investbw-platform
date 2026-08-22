import { type ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-neutral-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-neutral-500 mt-1.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, action, className = '' }: SectionHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <h2 className="text-base font-semibold text-neutral-900">{title}</h2>
      {action}
    </div>
  );
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
        {icon}
      </div>
      <p className="text-base font-medium text-neutral-900">{title}</p>
      {description && (
        <p className="text-sm text-neutral-500 mt-1.5 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function LoadingCard({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="card-surface p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="skeleton w-10 h-10 rounded-xl" />
            <div className="flex-1">
              <div className="skeleton h-4 w-24 mb-2" />
              <div className="skeleton h-3 w-16" />
            </div>
          </div>
          <div className="skeleton h-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="card-surface p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="skeleton w-10 h-10 rounded-xl" />
            <div className="flex-1">
              <div className="skeleton h-4 w-20 mb-2" />
              <div className="skeleton h-3 w-14" />
            </div>
          </div>
          <div className="skeleton h-16 rounded-lg mb-3" />
          <div className="flex justify-between">
            <div className="skeleton h-6 w-20" />
            <div className="skeleton h-6 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
}
