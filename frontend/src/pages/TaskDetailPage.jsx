import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Pencil, Trash2, AlertTriangle, ArrowDown, ArrowUp, Minus, Ban, Paperclip, Upload, FileImage, File, Download } from 'lucide-react';
import api, { uploadFile, downloadFile } from '../api/api';
import { useAuth } from '../hooks/useAuth';
import { getStatusConfig, getPriorityConfig } from '../utils/constants';
import { EditTaskForm } from '../components/EditTaskForm';
import { ConfirmDialog } from '../components/ConfirmDialog';
import toast from 'react-hot-toast';

const priorityIcons = {
  low: ArrowDown,
  medium: Minus,
  high: ArrowUp,
  critical: AlertTriangle,
};

export function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [filePreviews, setFilePreviews] = useState({});
  const fileInputRef = useRef(null);

  const fetchTask = async () => {
    try {
      const { data } = await api.get(`/tasks/${id}`);
      setTask(data);
    } catch (err) {
      if (err.response?.status === 403) {
        toast.error('Нет доступа к этой задаче');
      } else if (err.response?.status === 404) {
        toast.error('Задача не найдена');
      } else {
        toast.error('Ошибка загрузки задачи');
      }
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTask();
      api.get('/users/assignable').then(({ data }) => setUsers(data)).catch(() => {});
    }
  }, [id, user]);

  useEffect(() => {
    if (!task?.attachments) return;
    const images = task.attachments.filter((f) => f.mimetype?.startsWith('image/'));
    if (images.length === 0) return;

    let cancelled = false;

    const loadPreviews = async () => {
      const previews = {};
      for (const file of images) {
        try {
          const { data: blob } = await downloadFile(task._id, file._id);
          if (!cancelled) {
            previews[file._id] = URL.createObjectURL(blob);
          }
        } catch {
          // skip failed previews
        }
      }
      if (!cancelled) {
        setFilePreviews((prev) => ({ ...prev, ...previews }));
      }
    };

    loadPreviews();

    return () => {
      cancelled = true;
      setFilePreviews((prev) => {
        Object.values(prev).forEach((url) => URL.revokeObjectURL(url));
        return {};
      });
    };
  }, [task?._id, task?.attachments]);

  const handleUpdate = async (taskId, updateData) => {
    const { data } = await api.patch(`/tasks/${taskId}`, updateData);
    setTask(data);
    toast.success('Задача обновлена!');
    return data;
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/tasks/${id}`);
      toast.success('Задача удалена');
      navigate('/tasks');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ошибка удаления');
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const { data } = await api.post(`/tasks/${id}/cancel`);
      setTask(data);
      toast.success('Задача отменена');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ошибка отмены');
    } finally {
      setCancelling(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await uploadFile(id, file);
      setTask(data);
      toast.success('Файл загружен');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Ошибка загрузки файла');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownload = async (file) => {
    try {
      const { data: blob } = await downloadFile(id, file._id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.originalName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Ошибка скачивания файла');
    }
  };

  const handleOpenFull = async (file) => {
    try {
      const { data: blob } = await downloadFile(id, file._id);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      toast.error('Ошибка открытия файла');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!task) return null;

  const status = getStatusConfig(task.status);
  const priority = getPriorityConfig(task.priority);
  const PriorityIcon = priorityIcons[task.priority] || Minus;
  const assignee = users.find((u) => u._id === task.assignedTo);
  const isCreator = task.createdBy?.toString() === user?.id?.toString();
  const isAssignee = task.assignedTo?.toString() === user?.id?.toString();
  const canDelete = isCreator || user?.role === 'admin';
  const canCancel = canDelete && !['done', 'cancelled'].includes(task.status);
  const canUpload = isCreator || isAssignee || user?.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">К списку задач</span>
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#1e293b] rounded-2xl border border-slate-700/50 overflow-hidden shadow-xl shadow-black/20"
      >
        <div className="bg-gradient-to-r from-indigo-600/10 to-purple-600/10 px-8 py-6 border-b border-slate-700/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-100 mb-3">{task.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${status.color}`}>
                  {status.label}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border ${priority.color}`}>
                  <PriorityIcon size={14} />
                  {priority.label}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all text-sm font-medium"
              >
                <Pencil size={16} />
                Редактировать
              </button>
              {canDelete && (
                <button
                  onClick={() => setConfirmOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all text-sm font-medium"
                >
                  <Trash2 size={16} />
                  Удалить
                </button>
              )}
              {canCancel && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelling ? (
                    <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Ban size={16} />
                  )}
                  Отменить
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {task.description && (
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Описание</h3>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{task.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1.5">Исполнитель</h3>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-slate-400" />
                  {assignee ? (
                    <span className="text-slate-200 font-medium">{assignee.name}</span>
                  ) : (
                    <span className="text-slate-500 italic">Не назначен</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1.5">Создатель</h3>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-slate-400" />
                  <span className="text-slate-200 font-medium">
                    {users.find((u) => u._id === task.createdBy)?.name || 'Неизвестный'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1.5">Создано</h3>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="text-slate-200">
                    {new Date(task.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {task.updatedAt !== task.createdAt && (
                <div>
                  <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1.5">Обновлено</h3>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-slate-400" />
                    <span className="text-slate-200">
                      {new Date(task.updatedAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {task.attachments?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-3">Вложения</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {task.attachments.map((file) => {
                  const isImage = file.mimetype?.startsWith('image/');
                  const previewUrl = filePreviews[file._id];
                  return (
                    <div
                      key={file._id}
                      className="rounded-xl bg-slate-800/30 border border-slate-700/30 overflow-hidden"
                    >
                      {isImage && previewUrl ? (
                        <div
                          className="relative group cursor-pointer aspect-[4/3] bg-slate-900"
                          onClick={() => handleOpenFull(file)}
                        >
                          <img
                            src={previewUrl}
                            alt={file.originalName}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-sm font-medium">Открыть</span>
                          </div>
                        </div>
                      ) : isImage ? (
                        <div className="aspect-[4/3] bg-slate-900 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : (
                        <div className="aspect-[4/3] bg-slate-900 flex flex-col items-center justify-center gap-2">
                          <File size={32} className="text-slate-500" />
                        </div>
                      )}
                      <div className="p-3">
                        <p className="text-sm text-slate-200 truncate mb-1" title={file.originalName}>
                          {file.originalName}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-500">
                            {(file.size / 1024).toFixed(1)} КБ
                          </span>
                          <button
                            onClick={() => handleDownload(file)}
                            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                          >
                            <Download size={12} />
                            Скачать
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {canUpload && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Upload size={16} />
                )}
                {uploading ? 'Загрузка...' : 'Загрузить файл'}
              </button>
              <p className="text-xs text-slate-600 mt-2">JPEG или PNG, максимум 5 МБ</p>
            </div>
          )}
        </div>
      </motion.div>

      <EditTaskForm
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        task={task}
        onSubmit={handleUpdate}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Удалить задачу?"
        message={`Задача «${task.title}» будет удалена навсегда. Это действие нельзя отменить.`}
        confirmText="Удалить"
        loading={deleting}
      />
    </div>
  );
}
