export default function SubjectBar({ name, score, color }) {
  const status =
    score >= 85 ? { label: "Great",  cls: "text-emerald-600 bg-emerald-50" }
    : score >= 70 ? { label: "Good",  cls: "text-blue-600 bg-blue-50" }
    : score >= 60 ? { label: "Fair",  cls: "text-amber-600 bg-amber-50" }
    :               { label: "Review", cls: "text-red-600 bg-red-50" };

  return (
    <div className="mb-3.5 last:mb-0">
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-xs font-medium text-gray-700 truncate">{name}</span>
          <span className={`text-2xs font-semibold px-1.5 py-0.5 rounded flex-shrink-0 ${status.cls}`}>
            {status.label}
          </span>
        </div>
        <span className="text-xs font-bold tabular-nums text-muted ml-2 flex-shrink-0">{score}%</span>
      </div>
      <div className="h-1.5 bg-base rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}