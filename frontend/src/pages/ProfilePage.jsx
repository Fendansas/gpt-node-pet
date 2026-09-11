import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { User, Mail, Save, AlertTriangle, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export function ProfilePage() {
  const { user, updateProfile, deactivateAccount } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [showDanger, setShowDanger] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ name, email });
      toast.success('Профиль обновлён');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ошибка обновления');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async () => {
    try {
      await deactivateAccount();
      toast.success('Аккаунт деактивирован');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ошибка');
    }
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-slate-100 mb-8">Профиль</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#1e293b] rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl shadow-black/20"
      >
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 px-8 py-12 flex items-center gap-6 border-b border-slate-700/50">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-indigo-500/30">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-100">{user?.name}</h2>
            <p className="text-slate-400">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Shield size={14} className="text-slate-500" />
              <span className="text-sm text-slate-500 capitalize">{user?.role}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Имя</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                required
                minLength={3}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-600/50 rounded-xl pl-11 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save size={18} />
                Сохранить
              </>
            )}
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-[#1e293b] rounded-2xl border border-red-500/20 overflow-hidden"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100">Опасная зона</h3>
              <p className="text-sm text-slate-500">Необратимое действие</p>
            </div>
          </div>

          {!showDanger ? (
            <button
              onClick={() => setShowDanger(true)}
              className="mt-4 px-4 py-2 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium hover:bg-red-500/10 transition-all"
            >
              Деактивировать аккаунт
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 rounded-xl bg-red-500/5 border border-red-500/20"
            >
              <p className="text-sm text-slate-300 mb-4">
                Вы уверены? Это действие нельзя отменить. Ваш аккаунт будет деактивирован.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDanger(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 text-sm font-medium hover:text-white transition-all"
                >
                  Отмена
                </button>
                <button
                  onClick={handleDeactivate}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-all"
                >
                  Да, деактивировать
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
