import { createContext } from 'react';

export type Toast = {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
};

export type ToastContextType = {
  toasts: Toast[];
  toast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);
