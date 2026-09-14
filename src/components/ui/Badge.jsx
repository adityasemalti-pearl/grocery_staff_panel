const TONES = {
  brand: "bg-brand-50 text-brand-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  sky: "bg-sky-50 text-sky-600",
  violet: "bg-violet-50 text-violet-600",
  teal: "bg-teal-50 text-teal-600",
  neutral: "bg-line/60 text-ink-soft",
};

export default function Badge({ tone = "neutral", dot = false, icon: Icon, children, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${TONES[tone]} ${className}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}