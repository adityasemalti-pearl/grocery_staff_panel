export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="py-14 sm:py-16 text-center px-4">
      {Icon && (
        <div className="w-12 h-12 mx-auto rounded-lg bg-paper flex items-center justify-center">
          <Icon className="w-5 h-5 text-ink-faint" />
        </div>
      )}

      <p className="text-sm font-bold text-ink mt-3">{title}</p>

      {description && (
        <p className="text-xs text-ink-soft mt-1 max-w-xs mx-auto">
          {description}
        </p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
