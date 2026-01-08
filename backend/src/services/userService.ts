// backend/src/services/userService.ts

import { prisma } from '../config/database';
import { UpdateProfileDTO, ChangePasswordDTO } from '../types';
import { hashPassword, comparePassword } from '../utils/password';
import { AppError } from '../middleware/errorHandler';

export class UserService {
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user;
  }

  async updateProfile(userId: string, data: UpdateProfileDTO) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async changePassword(userId: string, data: ChangePasswordDTO) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const isPasswordValid = await comparePassword(
      data.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new AppError(401, 'Current password is incorrect');
    }

    const hashedPassword = await hashPassword(data.newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async getStatistics(userId: string) {
    const totalTasks = await prisma.task.count({
      where: { userId },
    });

    const completedTasks = await prisma.task.count({
      where: { userId, status: 'COMPLETED' },
    });

    const inProgressTasks = await prisma.task.count({
      where: { userId, status: 'IN_PROGRESS' },
    });

    const todoTasks = await prisma.task.count({
      where: { userId, status: 'TODO' },
    });

    const priorityCounts = await prisma.task.groupBy({
      by: ['priority'],
      where: { userId },
      _count: true,
    });

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      priorityCounts: {
        LOW: priorityCounts.find((p: { priority: string; }) => p.priority === 'LOW')?._count || 0,
        MEDIUM: priorityCounts.find((p: { priority: string; }) => p.priority === 'MEDIUM')?._count || 0,
        HIGH: priorityCounts.find((p: { priority: string; }) => p.priority === 'HIGH')?._count || 0,
      },
    };
  }
}