import { motion } from 'framer-motion';
import { UserCheck, UserX, Shield, Mail } from 'lucide-react';

export function UserTable({ users, onToggleActive }) {
  return (
    <div className="bg-[#1e293b] rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl shadow-black/20">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Пользователь
              </th>
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Роль
              </th>
              <th className="text-left px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="text-right px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {users.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="hover:bg-slate-700/20 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-medium">
                      {user.name
                        .split(' ')
                        .map((w) => w[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-100">{user.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Mail size={10} />
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <Shield size={14} className="text-slate-500" />
                    <span className="text-sm text-slate-300 capitalize">{user.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                      user.isActive
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {user.isActive ? <UserCheck size={12} /> : <UserX size={12} />}
                    {user.isActive ? 'Активен' : 'Заблокирован'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onToggleActive(user.id, user.isActive)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      user.isActive
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                        : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                    }`}
                  >
                    {user.isActive ? (
                      <>
                        <UserX size={14} />
                        Деактивировать
                      </>
                    ) : (
                      <>
                        <UserCheck size={14} />
                        Активировать
                      </>
                    )}
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <Users size={48} className="mx-auto mb-4 text-slate-600" />
          <p className="font-medium">Нет пользователей</p>
        </div>
      )}
    </div>
  );
}
