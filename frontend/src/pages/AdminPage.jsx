import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../hooks/useAuth';
import { UserTable } from '../components/UserTable';
import { AssigneeStats } from '../components/AssigneeStats';
import toast from 'react-hot-toast';

export function AdminPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigneeStats, setAssigneeStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchUsers = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch (err) {
      if (err.response?.status !== 401) {
        toast.error('Ошибка загрузки пользователей');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAssigneeStats = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await api.get('/tasks/stats-by-assignee');
      setAssigneeStats(data);
    } catch (err) {
      if (err.response?.status !== 401) {
        toast.error('Ошибка загрузки статистики по исполнителям');
      }
    } finally {
      setStatsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsers();
  }, [user]);

  useEffect(() => {
    fetchAssigneeStats();
  }, [fetchAssigneeStats]);

  const handleToggleActive = async (userId, currentStatus) => {
    try {
      if (currentStatus) {
        await api.patch(`/users/${userId}/deactivate`);
        toast.success('Пользователь деактивирован');
      } else {
        await api.patch(`/users/${userId}/activate`);
        toast.success('Пользователь активирован');
      }
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ошибка');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Админ-панель</h1>
            <p className="text-slate-500 mt-0.5">Управление пользователями</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <AssigneeStats stats={assigneeStats} users={users} loading={statsLoading} />
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <UserTable users={users} onToggleActive={handleToggleActive} />
        </motion.div>
      )}
    </div>
  );
}
