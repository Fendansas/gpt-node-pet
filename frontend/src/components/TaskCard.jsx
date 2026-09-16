import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowDown, ArrowUp, Minus, AlertTriangle, Pencil, User } from 'lucide-react';
import { getStatusConfig, getPriorityConfig } from '../utils/constants';

const priorityIcons = {
  low: ArrowDown,
  medium: Minus,
  high: ArrowUp,
  critical: AlertTriangle,
};

export function TaskCard({ task, index = 0, onEdit, users = [] }) {
  const navigate = useNavigate();
  const status = getStatusConfig(task.status);
  const priority = getPriorityConfig(task.priority);
  const PriorityIcon = priorityIcons[task.priority] || Minus;

  const assignee = users.find((u) => u._id === task.assignedTo);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={() => navigate(`/tasks/${task._id}`)}
      className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-5 hover:border-slate-600/50 hover:shadow-lg hover:shadow-black/20 transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-slate-100 font-semibold text-base leading-tight group-hover:text-white transition-colors line-clamp-2">
          {task.title}
        </h3>
        <div className="flex items-center gap-2 shrink-0">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${priority.color}`}>
            <PriorityIcon size={12} />
            {priority.label}
          </div>
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="w-7 h-7 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <Pencil size={13} />
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-slate-400 text-sm mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mb-3">
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

      <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-2 border-t border-slate-700/30">
        <User size={12} />
        {assignee ? (
          <span className="text-slate-300">{assignee.name}</span>
        ) : (
          <span className="italic">Без исполнителя</span>
        )}
      </div>
    </motion.div>
  );
}
