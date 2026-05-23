import React, {
  useState,
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  X,
  AlertTriangle,
} from "lucide-react";

/* ===============================
   CONSTANTS
================================ */
const MAX_TOASTS = 3;
const TOAST_DURATION = 5000;

/* ===============================
   POSITION MAP
================================ */
const TOAST_POSITIONS = {
  "top-left": "top-6 left-6 items-start",
  "top-center": "top-6 left-1/2 -translate-x-1/2 items-center",
  "top-right": "top-6 right-6 items-end",

  "bottom-left": "bottom-6 left-6 items-start",
  "bottom-center": "bottom-6 left-1/2 -translate-x-1/2 items-center",
  "bottom-right": "bottom-6 right-6 items-end",
};

/* ===============================
   CONTEXT & HOOK
================================ */
const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
};

/* ===============================
   TOAST COMPONENT
================================ */
const Toast = ({ id, title, message, type = "info", onClose }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());
  const remainingTimeRef = useRef(TOAST_DURATION);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => onClose(id), 400);
  }, [id, onClose]);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(handleClose, remainingTimeRef.current);
  }, [handleClose]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      remainingTimeRef.current -= Date.now() - startTimeRef.current;
    }
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    startTimer();
    return clearTimer;
  }, [startTimer, clearTimer]);

  const styles = {
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
      border: "border-emerald-500/20",
      shadow: "shadow-emerald-500/10",
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 text-rose-500" />,
      border: "border-rose-500/20",
      shadow: "shadow-rose-500/10",
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
      border: "border-amber-500/20",
      shadow: "shadow-amber-500/10",
    },
    info: {
      icon: <Info className="w-5 h-5 text-blue-500" />,
      border: "border-blue-500/20",
      shadow: "shadow-blue-500/10",
    },
  };

  const style = styles[type] || styles.info;

  return (
    <div
      onMouseEnter={clearTimer}
      onMouseLeave={startTimer}
      className={`
        relative w-full max-w-sm mb-3 rounded-2xl border p-4
        backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 shadow-2xl
        transition-all duration-500 ease-in-out
        ${
          isMounted && !isClosing
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 translate-x-8 scale-95"
        }
        ${style.border} ${style.shadow}
      `}
      role="alert"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
          {style.icon}
        </div>

        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-[11px] text-white font-bold uppercase tracking-widest opacity-70 mb-1">
              {title}
            </h4>
          )}
          <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
            {message}
          </p>
        </div>

        <button
          onClick={handleClose}
          className="rounded-lg p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

/* ===============================
   PROVIDER
================================ */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [position, setPosition] = useState("bottom-right");

  const showToast = useCallback((options) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => {
      const next = [{ id, ...options }, ...prev];
      return next.slice(0, MAX_TOASTS);
    });
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const contextValue = useMemo(
    () => ({
      showToast,
      setToastPosition: setPosition,
      toastPosition: position,
    }),
    [showToast, position],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <div
        className={`fixed z-[9999] pointer-events-none flex flex-col
        ${TOAST_POSITIONS[position]}`}
      >
        <div className="pointer-events-auto flex flex-col">
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onClose={removeToast} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};
