import { useEffect } from "react";
import { X } from "lucide-react";

const WIDTHS = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({
  title,
  description,
  onClose,
  width = "md",
  children,
  footer,
}) {
  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/45 backdrop-blur-[2px] flex items-start justify-center px-4 py-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className={`w-full ${WIDTHS[width]} bg-white rounded-xl shadow-float mt-6 mb-6`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || onClose) && (
          <div className="flex items-start justify-between gap-3 px-5 sm:px-6 py-4 border-b border-line">
            <div>
              {title && (
                <h2 className="text-lg font-extrabold text-ink">{title}</h2>
              )}
              {description && (
                <p className="text-xs text-ink-soft mt-1">{description}</p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-ink-soft hover:bg-paper hover:text-ink transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="px-5 sm:px-6 py-5">{children}</div>

        {footer && (
          <div className="flex justify-end gap-2.5 px-5 sm:px-6 py-4 border-t border-line">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
