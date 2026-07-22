"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ToastSeverity = "success" | "danger" | "warning" | "info";
export type ToastPosition =
  | "top-right"
  | "top-left"
  | "bottom-right"
  | "bottom-left"
  | "top-center"
  | "bottom-center";

export type ToastOptions = {
  severity?: ToastSeverity;
  title?: string;
  message: string;
  timeoutMs?: number | false;
  position?: ToastPosition;
  dismissible?: boolean;
  showProgress?: boolean;
};

type Toast = Required<Omit<ToastOptions, "timeoutMs">> & {
  id: string;
  timeoutMs: number | false;
  remainingMs: number;
};

type ToastContextValue = {
  addToast: {
    (options: ToastOptions): string;
    (message: string, severity?: ToastSeverity): string;
  };
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const MAX_TOASTS = 6;
const DEFAULT_TIMEOUT_MS = 3500;

function normalizeToast(
  messageOrOptions: string | ToastOptions,
  severity: ToastSeverity,
): ToastOptions {
  return typeof messageOrOptions === "string"
    ? { message: messageOrOptions, severity }
    : messageOrOptions;
}

function ToastIcon({ severity }: { severity: ToastSeverity }) {
  const icons: Record<ToastSeverity, string> = {
    info: "i",
    warning: "!",
    success: "✓",
    danger: "×",
  };

  return (
    <span className="sa-toast-icon" data-severity={severity} aria-hidden="true">
      {icons[severity]}
    </span>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef(new Map<string, { timeout?: number; interval?: number }>());
  const idRef = useRef(0);

  const removeToast = useCallback((id: string) => {
    const timers = timersRef.current.get(id);
    if (timers?.timeout) window.clearTimeout(timers.timeout);
    if (timers?.interval) window.clearInterval(timers.interval);
    timersRef.current.delete(id);
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (messageOrOptions: string | ToastOptions, legacySeverity: ToastSeverity = "info") => {
      const options = normalizeToast(messageOrOptions, legacySeverity);
      const id = `toast-${++idRef.current}`;
      const timeoutMs = options.timeoutMs === undefined ? DEFAULT_TIMEOUT_MS : options.timeoutMs;
      const toast: Toast = {
        id,
        message: options.message,
        severity: options.severity ?? "info",
        title: options.title ?? "",
        timeoutMs,
        remainingMs: typeof timeoutMs === "number" ? timeoutMs : 0,
        position: options.position ?? "top-right",
        dismissible: options.dismissible ?? true,
        showProgress: options.showProgress ?? true,
      };

      setToasts((previous) => {
        const overflow = previous.slice(0, Math.max(0, previous.length - MAX_TOASTS + 1));
        overflow.forEach((item) => {
          const timers = timersRef.current.get(item.id);
          if (timers?.timeout) window.clearTimeout(timers.timeout);
          if (timers?.interval) window.clearInterval(timers.interval);
          timersRef.current.delete(item.id);
        });
        return [...previous.slice(-(MAX_TOASTS - 1)), toast];
      });

      if (typeof timeoutMs === "number") {
        const startedAt = Date.now();
        const interval = window.setInterval(() => {
          setToasts((previous) =>
            previous.map((item) =>
              item.id === id
                ? { ...item, remainingMs: Math.max(0, timeoutMs - (Date.now() - startedAt)) }
                : item,
            ),
          );
        }, 50);
        const timeout = window.setTimeout(() => removeToast(id), timeoutMs);
        timersRef.current.set(id, { timeout, interval });
      }

      return id;
    },
    [removeToast],
  );

  useEffect(
    () => () => {
      timersRef.current.forEach(({ timeout, interval }) => {
        if (timeout) window.clearTimeout(timeout);
        if (interval) window.clearInterval(interval);
      });
      timersRef.current.clear();
    },
    [],
  );

  const positions = Array.from(new Set(toasts.map((toast) => toast.position)));

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {positions.map((position) => {
        const positionedToasts = toasts.filter((toast) => toast.position === position);
        const politeToasts = positionedToasts.filter((toast) => toast.severity !== "danger");
        const dangerToasts = positionedToasts.filter((toast) => toast.severity === "danger");

        return (
          <div key={position} className="sa-toast-container" data-position={position} aria-label="Notifications">
            <div className="sa-toast-live-region" aria-live="polite" aria-atomic="false">
              {politeToasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
              ))}
            </div>
            <div className="sa-toast-live-region" aria-live="assertive" aria-atomic="false">
              {dangerToasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
              ))}
            </div>
          </div>
        );
      })}
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  return (
    <div className="sa-toast" data-severity={toast.severity}>
      <ToastIcon severity={toast.severity} />
      <div className="sa-toast-content">
        {toast.title ? <h2 className="sa-toast-title">{toast.title}</h2> : null}
        <p className="sa-toast-message">{toast.message}</p>
      </div>
      {toast.dismissible ? (
        <button
          type="button"
          className="sa-toast-dismiss"
          onClick={() => onDismiss(toast.id)}
          aria-label={`Dismiss ${toast.severity} notification`}
        >
          ×
        </button>
      ) : null}
      {toast.showProgress && typeof toast.timeoutMs === "number" ? (
        <progress
          className="sa-toast-progress"
          value={toast.remainingMs}
          max={toast.timeoutMs}
          aria-label="Time remaining before this notification closes"
        />
      ) : null}
    </div>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
