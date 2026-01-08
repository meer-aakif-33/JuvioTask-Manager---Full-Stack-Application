// backend/src/controllers/taskController.ts

import { Response, NextFunction } from 'express';
import { TaskService } from '../services/taskService';
import { AuthRequest, CreateTaskDTO, UpdateTaskDTO, TaskFilters } from '../types';

const taskService = new TaskService();

export class TaskController {
  async getTasks(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const filters: TaskFilters = req.query as any;
      const result = await taskService.getTasks(userId, filters);

      res.json({
        success: true,
        data: result.data,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const task = await taskService.getTaskById(userId, id);

      res.json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async createTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const data: CreateTaskDTO = req.body;
      const task = await taskService.createTask(userId, data);

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const data: UpdateTaskDTO = req.body;
      const task = await taskService.updateTask(userId, id, data);

      res.json({
        success: true,
        message: 'Task updated successfully',
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;
      const result = await taskService.deleteTask(userId, id);

      res.json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}