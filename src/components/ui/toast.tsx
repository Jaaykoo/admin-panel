/* eslint-disable react-dom/no-missing-button-type */
/* eslint-disable ts/no-use-before-define */
/* eslint-disable react-hooks/purity */
/* eslint-disable react/no-unstable-context-value */
import type { ReactNode } from 'react';
import type { Toast } from './toast-context';
import { useState } from 'react';
import { ToastContext } from './toast-context';

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, description, variant }]);

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      dismissToast(id);
    }, 5000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext value={{ toasts, toast, dismissToast }}>
      {children}

      {/* Toast container */}
      <div className="fixed right-0 bottom-0 z-50 w-full max-w-md space-y-4 p-4">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`translate-y-0 transform rounded-md p-4 opacity-100 shadow-md transition-all 
              ${toast.variant === 'destructive' ? 'border border-red-300 bg-red-100' : 'border border-gray-200 bg-white'}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`font-medium ${toast.variant === 'destructive' ? 'text-red-800' : 'text-gray-900'}`}>
                  {toast.title}
                </h3>
                {toast.description && (
                  <p className={`mt-1 text-sm ${toast.variant === 'destructive' ? 'text-red-700' : 'text-gray-700'}`}>
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext>
  );
}
