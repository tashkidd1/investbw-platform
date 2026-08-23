import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export function Modal({ open, onClose, title, description, children, footer, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div className={`relative w-full ${sizeClasses[size]} bg-white rounded-t-3xl sm:rounded-2xl shadow-elevated animate-slide-up sm:animate-scale-in max-h-[90vh] flex flex-col`}>
        {title && (
          <div className="flex items-start justify-between p-5 border-b border-neutral-100">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
              {description && <p className="text-sm text-neutral-500 mt-1">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 -mt-1 -mr-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
        {footer && <div className="p-5 border-t border-neutral-100">{footer}</div>}
      </div>
    </div>
  );
}
