import { TASK_STATUSES, TASK_PRIORITIES } from '../utils/constants';

export function TaskFilters({ filters, onChange }) {
  const activeStatus = filters.status || '';
  const activePriority = filters.priority || '';

  return (
    <div className="flex flex-wrap gap-4">
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
          Статус
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onChange({ ...filters, status: '' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              !activeStatus
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600/50 hover:text-slate-300'
            }`}
          >
            Все
          </button>
          {TASK_STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => onChange({ ...filters, status: s.value === activeStatus ? '' : s.value })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                activeStatus === s.value
                  ? s.color
                  : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:border-slate-600/50 hover:text-slate-300'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
          Приоритет
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => onChange({ ...filters, priority: '' })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              !activePriority
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600/50 hover:text-slate-300'
            }`}
          >
            Все
          </button>
          {TASK_PRIORITIES.map((p) => (
            <button
              key={p.value}
              onClick={() => onChange({ ...filters, priority: p.value === activePriority ? '' : p.value })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
                activePriority === p.value
                  ? p.filterColor
                  : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:border-slate-600/50 hover:text-slate-300'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
