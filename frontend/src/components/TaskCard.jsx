import { motion } from 'framer-motion';
import { Calendar, ArrowDown, ArrowUp, Minus, AlertTriangle } from 'lucide-react';
import { getStatusConfig, getPriorityConfig } from '../utils/constants';

const priorityIcons = {
  low: ArrowDown,
  medium: Minus,
  high: ArrowUp,
  critical: AlertTriangle,
};

export function TaskCard({ task, index = 0 }) {
  const status = getStatusConfig(task.status);
  const priority = getPriorityConfig(task.priority);
  const PriorityIcon = priorityIcons[task.priority] || Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-5 hover:border-slate-600/50 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-slate-100 font-semibold text-base leading-tight group-hover:text-white transition-colors line-clamp-2">
          {task.title}
        </h3>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${priority.color} shrink-0`}>
          <PriorityIcon size={12} />
          {priority.label}
        </div>
      </div>

      {task.description && (
        <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${status.color}`}>
          {status.label}
        </span>
        <div className="flex items-center gap-1.5 text-slate-500 text-xs">
          <Calendar size={12} />
          {new Date(task.createdAt).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short',
          })}
        </div>
      </div>
    </motion.div>
  );
}
