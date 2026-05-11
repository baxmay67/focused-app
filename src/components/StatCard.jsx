export default function StatCard({ label, value, change, up, delay = 1 }) {
  return (
    <div className={`bg-surface border border-line rounded-xl p-4 shadow-card fade-up d${delay}`}>
      <p className="text-2xs font-semibold text-subtle uppercase tracking-wider mb-2 leading-none">
        {label}
      </p>
      <p className="text-3xl font-bold text-ink tabular-nums tracking-tight leading-none mb-1.5">
        {value}
      </p>
      <p className={`text-xs font-medium ${
        up === true ? "text-emerald-600"
        : up === false ? "text-red-500"
        : "text-muted"
      }`}>
        {change}
      </p>
    </div>
  );
}