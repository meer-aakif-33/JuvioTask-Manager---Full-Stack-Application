// backend/src/middleware/authMiddleware.ts

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { verifyAccessToken } from '../utils/jwt';

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided',
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = verifyAccessToken(token);
      req.user = {
        id: decoded.id,
        email: decoded.email,
      };
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Authentication error',
    });
  }
};