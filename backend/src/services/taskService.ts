// backend/src/services/taskService.ts

import { prisma } from '../config/database';
import { CreateTaskDTO, UpdateTaskDTO, TaskFilters } from '../types';
import { AppError } from '../middleware/errorHandler';

export class TaskService {
  async getTasks(userId: string, filters: TaskFilters) {
    const {
      status,
      priority,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = filters;

    const where: any = { userId };

    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.task.count({ where }),
    ]);

    return {
      data: tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTaskById(userId: string, taskId: string) {
    const task = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) {
      throw new AppError(404, 'Task not found');
    }

    return task;
  }

  async createTask(userId: string, data: CreateTaskDTO) {
    const task = await prisma.task.create({
      data: {
        ...data,
        userId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      },
    });

    return task;
  }

  async updateTask(userId: string, taskId: string, data: UpdateTaskDTO) {
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!existingTask) {
      throw new AppError(404, 'Task not found');
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      },
    });

    return task;
  }

  async deleteTask(userId: string, taskId: string) {
    const existingTask = await prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!existingTask) {
      throw new AppError(404, 'Task not found');
    }

    await prisma.task.delete({
      where: { id: taskId },
    });

    return { message: 'Task deleted successfully' };
  }
}