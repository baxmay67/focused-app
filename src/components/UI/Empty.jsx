export default function Empty({ heading, sub, cta, onCta }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center fade-in">
      <div className="w-12 h-12 bg-base border border-line rounded-xl flex items-center justify-center mb-4">
        <svg className="w-5 h-5 text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-gray-800 mb-1">{heading}</p>
      {sub && <p className="text-xs text-muted mb-4 max-w-xs leading-relaxed">{sub}</p>}
      {cta && (
        <button
          onClick={onCta}
          className="px-4 py-2 bg-brand hover:bg-brand-dark text-white text-xs font-semibold rounded-md transition"
        >
          {cta}
        </button>
      )}
    </div>
  );
}