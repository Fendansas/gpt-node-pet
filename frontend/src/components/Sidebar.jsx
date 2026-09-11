import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {
  CheckSquare,
  User,
  Shield,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Sidebar({ onToggle }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleToggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    onToggle?.(next);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/tasks', icon: CheckSquare, label: 'Задачи' },
    { to: '/profile', icon: User, label: 'Профиль' },
    ...(isAdmin ? [{ to: '/admin', icon: Shield, label: 'Админ' }] : []),
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2 }}
      className="h-screen bg-[#1e293b] border-r border-slate-700/50 flex flex-col fixed left-0 top-0 z-30"
    >
      <div className="p-4 border-b border-slate-700/50">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-lg font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap"
            >
              Task Manager
            </motion.h1>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
            TM
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            <item.icon size={20} className="shrink-0" />
            <AnimatePresence mode="wait">
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium whitespace-nowrap"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-slate-700/50">
        {!collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Выйти</span>}
        </button>
      </div>

      <button
        onClick={handleToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600 transition-colors"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </motion.aside>
  );
}
