export const TASK_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
  { value: 'backlog', label: 'Backlog', color: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30' },
  { value: 'todo', label: 'To Do', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  { value: 'review', label: 'Review', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { value: 'rework', label: 'Rework', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { value: 'done', label: 'Done', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-500/20 text-red-300 border-red-500/30' },
];

export const TASK_PRIORITIES = [
  { value: 'low', label: 'Low', filterColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30', selectColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { value: 'medium', label: 'Medium', filterColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', selectColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  { value: 'high', label: 'High', filterColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30', selectColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { value: 'critical', label: 'Critical', filterColor: 'bg-red-500/20 text-red-300 border-red-500/30', selectColor: 'bg-red-500/20 text-red-300 border-red-500/30' },
];

export const getStatusConfig = (status) =>
  TASK_STATUSES.find((s) => s.value === status) || TASK_STATUSES[0];

export const getPriorityConfig = (priority) =>
  TASK_PRIORITIES.find((p) => p.value === priority) || TASK_PRIORITIES[1];
