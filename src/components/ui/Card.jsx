export function Card({ accent, className = "", children, ...props }) {
  return (
    <div
      className={`relative bg-card border border-line rounded-xl overflow-hidden ${className}`}
      {...props}
    >
      {accent && (
        <span
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ background: accent }}
        />
      )}
      {children}
    </div>
  );
}

const TONE_MAP = {
  brand: "bg-brand-50 text-brand-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  sky: "bg-sky-50 text-sky-600",
};

export function StatCard({ label, value, icon: Icon, tone = "brand" }) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-ink-soft">{label}</p>
          <p className="text-2xl font-extrabold text-ink mt-1.5 tracking-tight">
            {value}
          </p>
        </div>

        {Icon && (
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${TONE_MAP[tone]}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </Card>
  );
}
