
// frontend/src/components/dashboard/TaskForm.tsx

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Task } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(2000, 'Description too long').optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (data: Partial<Task>) => Promise<void>;
  onCancel: () => void;
}

export default function TaskForm({ initialData, onSubmit, onCancel }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description || '',
      status: initialData.status,
      priority: initialData.priority,
      dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
    } : {
      status: 'TODO',
      priority: 'MEDIUM',
    },
  });

  const handleFormSubmit = async (data: TaskFormData) => {
    const submitData = {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : undefined,
    };
    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Title"
        placeholder="Task title"
        error={errors.title?.message}
        {...register('title')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={4}
          placeholder="Task description (optional)"
          {...register('description')}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            {...register('status')}
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            {...register('priority')}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
      </div>

      <Input
        label="Due Date"
        type="date"
        error={errors.dueDate?.message}
        {...register('dueDate')}
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1" isLoading={isSubmitting}>
          {initialData ? 'Update' : 'Create'} Task
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}