import { motion } from 'framer-motion';
import { Pencil, History, ArrowRight, Ban } from 'lucide-react';
import { getStatusConfig, getPriorityConfig } from '../utils/constants';

const actionConfig = {
  task_cancelled: { icon: Ban, label: 'Отменил(а) задачу', iconColor: 'text-amber-400', iconBg: 'bg-amber-500/10', iconBorder: 'border-amber-500/20' },
  task_updated: { icon: Pencil, label: 'Обновил(а) задачу', iconColor: 'text-indigo-400', iconBg: 'bg-indigo-500/10', iconBorder: 'border-indigo-500/20' },
};

const defaultAction = actionConfig.task_updated;

const fieldLabels = {
  status: 'Статус',
  title: 'Название',
  description: 'Описание',
  priority: 'Приоритет',
  assignedTo: 'Исполнитель',
};

const renderValue = (field, value, users) => {
  if (value == null || value === '') {
    return <span className="text-slate-500 italic">пусто</span>;
  }
  if (field === 'status') {
    const config = getStatusConfig(value);
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  }
  if (field === 'priority') {
    const config = getPriorityConfig(value);
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${config.color}`}>
        {config.label}
      </span>
    );
  }
  if (field === 'assignedTo') {
    const userName = users.find((u) => u._id === value)?.name;
    return userName ? (
      <span className="text-slate-200">{userName}</span>
    ) : (
      <span className="text-slate-200">{String(value).slice(-6)}</span>
    );
  }
  return <span className="text-slate-200">{String(value)}</span>;
};

const getPlainText = (field, value, users) => {
  if (value == null || value === '') return 'пусто';
  if (field === 'status') return getStatusConfig(value).label;
  if (field === 'priority') return getPriorityConfig(value).label;
  if (field === 'assignedTo') {
    return users.find((u) => u._id === value)?.name || String(value).slice(-6);
  }
  return String(value);
};

export function TaskHistory({ history = [], users = [] }) {
  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 text-slate-500"
      >
        <History size={48} className="mb-4 text-slate-600" />
        <p className="text-lg font-medium">История изменений пока пуста</p>
        <p className="text-sm">Здесь появятся все изменения задачи</p>
      </motion.div>
    );
  }

  const sorted = [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="space-y-4">
      {sorted.map((entry, index) => {
        const changedBy = users.find((u) => u._id === entry.changedBy);
        const changes = Object.entries(entry.changes || {});
        const action = actionConfig[entry.action] || defaultAction;
        const ActionIcon = action.icon;

        return (
          <motion.div
            key={entry._id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-xl bg-slate-800/30 border border-slate-700/30 p-5"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg ${action.iconBg} border ${action.iconBorder} flex items-center justify-center`}>
                  <ActionIcon size={16} className={action.iconColor} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">
                    {changedBy?.name || 'Неизвестный пользователь'}
                  </p>
                  <p className="text-xs text-slate-500">{action.label}</p>
                </div>
              </div>
              <span className="text-xs text-slate-500">
                {new Date(entry.createdAt).toLocaleDateString('ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            {changes.length > 0 && (
              <p className="text-xs text-slate-400 mb-4 pl-12">
                Изменено:{' '}
                <span className="text-slate-300">
                  {changes.map(([field, change], i) => (
                    <span key={field}>
                      {i > 0 && ', '}
                      {fieldLabels[field] || field}
                      <span className="text-slate-500"> (</span>
                      <span className="text-slate-400">{getPlainText(field, change.from, users)}</span>
                      <ArrowRight size={10} className="inline mx-0.5 text-slate-600" />
                      <span className="text-indigo-400 font-medium">{getPlainText(field, change.to, users)}</span>
                      <span className="text-slate-500">)</span>
                    </span>
                  ))}
                </span>
              </p>
            )}

            {changes.length > 0 && (
              <div className="space-y-2 border-t border-slate-700/30 pt-4">
                {changes.map(([field, change]) => (
                  <div key={field} className="flex items-center gap-3 text-sm">
                    <span className="text-slate-500 w-24 shrink-0">
                      {fieldLabels[field] || field}
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-slate-400 line-through decoration-slate-600">
                        {renderValue(field, change.from, users)}
                      </span>
                      <span className="text-slate-600">→</span>
                      <span className="text-slate-200 font-medium">
                        {renderValue(field, change.to, users)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
