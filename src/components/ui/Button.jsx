import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 disabled:bg-brand-600/60",
  secondary:
    "bg-white text-ink border border-line hover:border-brand-500 hover:text-brand-700 disabled:opacity-50",
  ghost:
    "bg-transparent text-ink-soft hover:bg-brand-50 hover:text-brand-700 disabled:opacity-50",
  danger:
    "bg-rose-500 text-white hover:bg-rose-700 disabled:bg-rose-500/60",
  dangerGhost:
    "bg-transparent text-rose-500 border border-line hover:border-rose-500 hover:bg-rose-50 disabled:opacity-50",
};

const SIZES = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  className = "",
  children,
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg
        font-bold transition-colors
        ${VARIANTS[variant]} ${SIZES[size]} ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}
      {children}
    </button>
  );
}
