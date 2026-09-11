import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, FileText, AlertTriangle } from 'lucide-react';
import { TASK_PRIORITIES } from '../utils/constants';

export function TaskForm({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ title, description, priority });
      setTitle('');
      setDescription('');
      setPriority('medium');
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
                  <FileText size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">Новая задача</h2>
                  <p className="text-sm text-slate-500">Заполните детали задачи</p>
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
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Название <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                  placeholder="Что нужно сделать?"
                  required
                  minLength={3}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Описание</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl px-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none"
                  placeholder="Подробности задачи (необязательно)"
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
                      className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                        priority === p.value
                          ? p.selectColor
                          : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600/50 hover:text-slate-300'
                      }`}
                    >
                      {p.value === 'critical' && <AlertTriangle size={14} />}
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

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
                  disabled={loading || !title.trim()}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      Создать
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
