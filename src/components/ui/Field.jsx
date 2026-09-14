const baseFieldClass =
  "w-full px-3.5 h-11 rounded-lg border border-line bg-white text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50 disabled:bg-paper disabled:text-ink-faint disabled:cursor-not-allowed";

export function Field({ label, required, hint, error, children }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs font-bold text-ink mb-1.5">
          {label}
          {required && <span className="text-rose-500"> *</span>}
        </label>
      )}

      {children}

      {hint && !error && (
        <p className="text-[11px] text-ink-faint mt-1">{hint}</p>
      )}

      {error && <p className="text-[11px] text-rose-500 mt-1">{error}</p>}
    </div>
  );
}

export function Input({ className = "", ...props }) {
  return <input className={`${baseFieldClass} ${className}`} {...props} />;
}

export function Select({ className = "", children, ...props }) {
  return (
    <select className={`${baseFieldClass} ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className = "", rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      className={`${baseFieldClass} h-auto py-2.5 resize-none ${className}`}
      {...props}
    />
  );
}
