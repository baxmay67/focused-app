export default function SubjectBar({ name, score, color }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-700 font-medium truncate pr-2">{name}</span>
        <span className="text-xs font-semibold text-gray-500 tabular-nums flex-shrink-0">{score}%</span>
      </div>
      <div className="h-1.5 bg-base rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}