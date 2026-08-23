import { type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: ReactNode;
  hint?: string;
}

export function Input({ label, error, leftIcon, hint, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-neutral-700 mb-1.5">{label}</label>}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          className={`input-base ${leftIcon ? 'pl-10' : ''} ${error ? 'border-error-400 focus:ring-error-500/20 focus:border-error-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-error-600">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
    </div>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

export function Select({ label, error, children, className = '', ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-neutral-700 mb-1.5">{label}</label>}
      <select className={`input-base appearance-none bg-no-repeat ${className}`} {...props}>
        {children}
      </select>
      {error && <p className="mt-1 text-xs text-error-600">{error}</p>}
    </div>
  );
}
