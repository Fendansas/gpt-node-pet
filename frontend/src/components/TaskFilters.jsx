import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { TASK_STATUSES, TASK_PRIORITIES } from '../utils/constants';

export function TaskFilters({ filters, onChange }) {
  const [searchValue, setSearchValue] = useState(filters.search || '');
  const filtersRef = useRef(filters);
  const onChangeRef = useRef(onChange);
  filtersRef.current = filters;
  onChangeRef.current = onChange;

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = searchValue.trim();
      const current = filtersRef.current.search || '';
      if (value === current) return;
      if (value.length < 3) {
        if (current) onChangeRef.current({ ...filtersRef.current, search: '' });
        return;
      }
      onChangeRef.current({ ...filtersRef.current, search: value });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  const activeStatus = filters.status || '';
  const activePriority = filters.priority || '';

  return (
    <div className="flex flex-wrap gap-4">
      <div className="min-w-64 flex-1">
        <label className="block text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
          Поиск
        </label>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
            placeholder="Поиск по названию и описанию…"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => setSearchValue('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

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
