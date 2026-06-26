"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ToastType = "default" | "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (options: Omit<ToastItem, "id">) => void;
  dismiss: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToastContext = createContext<ToastContextValue>({
  toast: () => {},
  dismiss: () => {},
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const prefix = useId();
  let counter = 0;

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (options: Omit<ToastItem, "id">) => {
      const id = `${prefix}-${++counter}`;
      const duration = options.duration ?? 4000;

      setToasts((prev) => [...prev, { ...options, id }]);

      if (duration > 0) {
        setTimeout(() => dismiss(id), duration);
      }
    },
    [prefix, dismiss] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {mounted &&
        createPortal(
          <div
            aria-live="polite"
            aria-atomic="false"
            className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 max-w-sm w-full"
          >
            <AnimatePresence mode="sync">
              {toasts.map((t) => (
                <ToastItem key={t.id} {...t} onDismiss={dismiss} />
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// useToast hook
// ---------------------------------------------------------------------------

export function useToast() {
  return useContext(ToastContext);
}

// ---------------------------------------------------------------------------
// Individual Toast item
// ---------------------------------------------------------------------------

const toastConfig: Record<ToastType, { icon: ReactNode; accent: string }> = {
  default: { icon: <Info className="h-4 w-4" />, accent: "var(--border-default)" },
  success: { icon: <CheckCircle2 className="h-4 w-4" />, accent: "var(--success)" },
  error: { icon: <XCircle className="h-4 w-4" />, accent: "var(--error)" },
  warning: { icon: <AlertCircle className="h-4 w-4" />, accent: "var(--warning)" },
  info: { icon: <Info className="h-4 w-4" />, accent: "var(--accent-primary)" },
};

function ToastItem({
  id,
  type,
  title,
  description,
  onDismiss,
}: ToastItem & { onDismiss: (id: string) => void }) {
  const config = toastConfig[type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      role="alert"
      className={cn(
        "relative flex items-start gap-3 overflow-hidden",
        "rounded-[var(--radius-lg)] border border-[var(--border-default)]",
        "bg-[var(--bg-elevated)] px-4 py-3.5 shadow-[var(--shadow-lg)]"
      )}
      style={{ borderLeftWidth: "3px", borderLeftColor: config.accent }}
    >
      <span
        aria-hidden
        style={{ color: config.accent }}
        className="mt-0.5 shrink-0"
      >
        {config.icon}
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)] leading-snug">{title}</p>
        {description && (
          <p className="mt-0.5 text-xs text-[var(--text-secondary)] leading-snug">{description}</p>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="shrink-0 mt-0.5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}
