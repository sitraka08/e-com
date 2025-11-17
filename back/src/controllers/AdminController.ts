import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares';
import { AdminService } from '../services/AdminService';
import { ApiResponse } from '../types';

export class AdminController {
  constructor(private adminService: AdminService) {}

  getPlatformStats = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const stats = await this.adminService.getPlatformStats();
      res.status(200).json({ success: true, data: stats } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };
}
