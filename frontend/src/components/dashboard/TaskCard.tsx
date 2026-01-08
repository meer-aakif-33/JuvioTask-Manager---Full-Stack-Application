// frontend/src/components/dashboard/TaskCard.tsx

import { Task } from '@/types';
import { Pencil, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const statusColors = {
    TODO: 'bg-orange-100 text-orange-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    COMPLETED: 'bg-green-100 text-green-800',
  };

  const priorityColors = {
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">{task.title}</h3>
        <div className="flex gap-2 ml-2">
          <button
            onClick={onEdit}
            className="text-gray-400 hover:text-primary-600 transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description}</p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ')}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-medium ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.dueDate && (
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-1" />
          Due {format(new Date(task.dueDate), 'MMM dd, yyyy')}
        </div>
      )}
    </div>
  );
}
