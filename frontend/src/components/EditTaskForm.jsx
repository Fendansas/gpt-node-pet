import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Pencil, User } from 'lucide-react';
import { TASK_STATUSES, TASK_PRIORITIES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import api from '../api/api';

export function EditTaskForm({ isOpen, onClose, task, onSubmit }) {
  const { user } = useAuth();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [status, setStatus] = useState(task?.status || 'draft');
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo || '');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isCreator = task?.createdBy?.toString() === user?.id?.toString();
  const isAssignee = task?.assignedTo?.toString() === user?.id?.toString();

  const canEditFields = isAdmin || isCreator;
  const canEditStatus = isAdmin || isAssignee;

  useEffect(() => {
    if (isOpen) {
      api.get('/users/assignable').then(({ data }) => setUsers(data)).catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'medium');
      setStatus(task.status || 'draft');
      setAssignedTo(task.assignedTo || '');
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData = {};
      if (canEditFields) {
        if (title !== task.title) updateData.title = title;
        if (description !== (task.description || '')) updateData.description = description;
        if (priority !== task.priority) updateData.priority = priority;
        if (assignedTo !== (task.assignedTo || '')) updateData.assignedTo = assignedTo || undefined;
      }
      if (canEditStatus) {
        if (status !== task.status) updateData.status = status;
      }

      if (Object.keys(updateData).length === 0) {
        onClose();
        return;
      }

      await onSubmit(task._id, updateData);
      onClose();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-[#1e293b] rounded-2xl border border-slate-700/50 shadow-2xl shadow-black/40"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <Pencil size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">Редактировать задачу</h2>
                  <p className="text-sm text-slate-500">
                    {isAdmin ? 'Полный доступ' : isCreator ? 'Создатель' : 'Исполнитель'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {canEditFields && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Название <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                      required
                      minLength={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Описание</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Приоритет</label>
                    <div className="grid grid-cols-4 gap-2">
                      {TASK_PRIORITIES.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setPriority(p.value)}
                          className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                            priority === p.value
                              ? p.selectColor
                              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600/50 hover:text-slate-300'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <span className="flex items-center gap-1.5">
                        <User size={14} />
                        Исполнитель
                      </span>
                    </label>
                    <select
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Без исполнителя</option>
                      {users.map((u) => (
                        <option key={u._id} value={u._id}>{u.name}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {canEditStatus && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Статус</label>
                  <div className="grid grid-cols-4 gap-2">
                    {TASK_STATUSES.filter((s) => s.value !== 'cancelled').map((s) => (
                      <button
                        key={s.value}
                        type="button"
                        onClick={() => setStatus(s.value)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
                          status === s.value
                            ? s.color
                            : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600/50 hover:text-slate-300'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {!canEditFields && !canEditStatus && (
                <p className="text-slate-500 text-sm text-center py-4">
                  У вас нет прав на редактирование этой задачи
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 font-medium hover:text-white hover:bg-slate-700/50 transition-all"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={16} />
                      Сохранить
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
