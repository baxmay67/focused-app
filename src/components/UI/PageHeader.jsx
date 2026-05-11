export default function PageHeader({ title, sub, action, actionLabel, actionVariant = "primary" }) {
  return (
    <div className="flex items-start justify-between fade-up">
      <div>
        <h1 className="text-2xl font-bold text-ink tracking-tight">{title}</h1>
        {sub && <p className="text-sm text-muted mt-0.5">{sub}</p>}
      </div>
      {action && (
        <button
          onClick={action}
          className={`px-4 py-2 text-sm font-semibold rounded-md transition shadow-card ${
            actionVariant === "primary"
              ? "bg-brand hover:bg-brand-dark text-white"
              : "bg-surface border border-line text-gray-700 hover:bg-base"
          }`}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}