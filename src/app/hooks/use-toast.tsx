// hooks/use-toast.ts
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Toast = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  duration?: number;
  variant?: 'default' | 'destructive';
};

const DEFAULT_DURATION = 3000;
const TOAST_LIMIT = 3;

const toastState = {
  toasts: [] as Toast[],
  listeners: [] as ((toasts: Toast[]) => void)[],
};

function safeUpdater(updater: (value: Toast[]) => Toast[]) {
  toastState.toasts = updater(toastState.toasts).slice(0, TOAST_LIMIT);
  toastState.listeners.forEach((listener) => {
    listener(toastState.toasts);
  });
}

export function toast({ ...props }: Omit<Toast, 'id'>) {
  const id = uuidv4();
  const newToast: Toast = {
    id,
    duration: DEFAULT_DURATION,
    ...props,
  };

  safeUpdater((prev) => [...prev, newToast]);

  return id;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>(toastState.toasts);

  useEffect(() => {
    function listener(newToasts: Toast[]) {
      setToasts(newToasts);
    }
    toastState.listeners.push(listener);
    return () => {
      toastState.listeners = toastState.listeners.filter((l) => l !== listener);
    };
  }, [setToasts]);

  return {
    toasts,
    toast,
    dismiss: (toastId: string) => {
      safeUpdater((prev) => prev.filter((t) => t.id !== toastId));
    },
    update: (toastId: string, updateProps: Omit<Toast, 'id'>) => {
      safeUpdater((prev) =>
        prev.map((t) =>
          t.id === toastId ? { ...t, ...updateProps } : t
        )
      );
    },
  };
}