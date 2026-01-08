'use client';

import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import api from '@/lib/api';
import { Task, TaskFilters, Statistics } from '@/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';
import TaskCard from '@/components/dashboard/TaskCard';
import TaskForm from '@/components/dashboard/TaskForm';

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Statistics | null>(null);
  const [filters, setFilters] = useState<TaskFilters>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchStatistics();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks', { params: filters });
      setTasks(data.data);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const { data } = await api.get('/users/statistics');
      setStats(data.data);
    } catch {
      console.error('Failed to fetch statistics');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
  };

  const handleFilterChange = (key: keyof TaskFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleCreateTask = async (taskData: Partial<Task>) => {
    try {
      await api.post('/tasks', taskData);
      toast.success('Task created');
      setIsCreateModalOpen(false);
      fetchTasks();
      fetchStatistics();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData: Partial<Task>) => {
    if (!editingTask) return;
    try {
      await api.put(`/tasks/${editingTask.id}`, taskData);
      toast.success('Task updated');
      setEditingTask(null);
      fetchTasks();
      fetchStatistics();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      fetchTasks();
      fetchStatistics();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete task');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            ['Total Tasks', stats.totalTasks, 'text-gray-900'],
            ['Completed', stats.completedTasks, 'text-green-600'],
            ['In Progress', stats.inProgressTasks, 'text-blue-600'],
            ['To Do', stats.todoTasks, 'text-orange-600'],
          ].map(([label, value, color]) => (
            <div key={label} className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-500">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>

          {tasks.length > 0 && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1" />
              New Task
            </Button>
          )}
        </div>

        {/* Search & Filters */}
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <select
            value={filters.status || ''}
            onChange={(e) =>
              handleFilterChange('status', e.target.value || undefined)
            }
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Status</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>

          <select
            value={filters.priority || ''}
            onChange={(e) =>
              handleFilterChange('priority', e.target.value || undefined)
            }
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">All Priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </form>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-3" />
          <p>Loading tasks…</p>
        </div>
      ) : stats?.totalTasks === 0 ? (
      // TRUE empty state (first-time user)
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-500 text-lg">
          You don’t have any tasks yet
        </p>
        <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4">
          Create Your First Task
        </Button>
      </div>
    ) : tasks.length === 0 ? (
      // Filter/search empty state
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-500 text-lg">
          No tasks match your filters
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Try adjusting search or filters
        </p>
      </div>
    )
 : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => setEditingTask(task)}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Task"
      >
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        title="Edit Task"
      >
        {editingTask && (
          <TaskForm
            initialData={editingTask}
            onSubmit={handleUpdateTask}
            onCancel={() => setEditingTask(null)}
          />
        )}
      </Modal>
    </div>
  );
}
