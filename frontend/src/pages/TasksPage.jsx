import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, Inbox } from 'lucide-react';
import api from '../api/api';
import { TaskCard } from '../components/TaskCard';
import { TaskFilters } from '../components/TaskFilters';
import { TaskForm } from '../components/TaskForm';
import { Pagination } from '../components/Pagination';
import toast from 'react-hot-toast';

export function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filters, setFilters] = useState({ status: '', priority: '', sort: '' });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8 };
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.sort) params.sort = filters.sort;

      const { data } = await api.get('/tasks', { params });
      setTasks(data.tasks);
      setPagination(data.pagination);
    } catch (err) {
      toast.error('Ошибка загрузки задач');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleCreateTask = async (taskData) => {
    const { data } = await api.post('/tasks', taskData);
    toast.success('Задача создана!');
    fetchTasks();
    return data;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Задачи</h1>
          <p className="text-slate-500 mt-1">
            {pagination.total} {pagination.total === 1 ? 'задача' : 'задач'}
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
        >
          <Plus size={18} />
          Новая задача
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <TaskFilters filters={filters} onChange={handleFilterChange} />
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-slate-500"
        >
          <Inbox size={48} className="mb-4 text-slate-600" />
          <p className="text-lg font-medium">Нет задач</p>
          <p className="text-sm">Создайте первую задачу</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tasks.map((task, index) => (
            <TaskCard key={task._id} task={task} index={index} />
          ))}
        </div>
      )}

      <Pagination pagination={pagination} onPageChange={setPage} />

      <TaskForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}
