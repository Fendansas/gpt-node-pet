import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ pagination, onPageChange }) {
  const { page, totalPages } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#1e293b] border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
        .reduce((acc, p, i, arr) => {
          if (i > 0 && p - arr[i - 1] > 1) {
            acc.push('...');
          }
          acc.push(p);
          return acc;
        }, [])
        .map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="px-2 text-slate-600">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
                p === page
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-[#1e293b] border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/50'
              }`}
            >
              {p}
            </button>
          )
        )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg bg-[#1e293b] border border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600/50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
