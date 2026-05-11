export default function StatCard({ label, value, change, up }) {
  return (
    <div className="bg-surface border border-line rounded-xl p-4 shadow-card fade-up">
      <p className="text-2xs font-semibold text-subtle uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-bold text-gray-900 tracking-tight leading-none mb-1.5">{value}</p>
      <p className={`text-xs font-medium ${up ? "text-emerald-600" : "text-amber-500"}`}>{change}</p>
    </div>
  );
}