import { createContext, useCallback, useContext, useRef, useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message, tone = "success") => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setToast({ message, tone });

    timerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}

      {toast && (
        <div
          role="status"
          className={`
            fixed bottom-5 left-1/2 -translate-x-1/2 z-[200]
            flex items-center gap-2 px-4 py-3 rounded-lg shadow-float
            text-sm font-semibold text-white
            ${toast.tone === "error" ? "bg-rose-500" : "bg-ink"}
          `}
        >
          {toast.tone === "error" ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const showToast = useContext(ToastContext);

  if (!showToast) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }

  return showToast;
}
