import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares';
import { UserService } from '../services';
import { ApiResponse, UpdateUserDTO, UserListFilters } from '../types';

export class UserController {
  constructor(private userService: UserService) {}

  getAllUsers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters: UserListFilters = {
        role: req.query.role as any,
        status: req.query.status as any,
        search: req.query.search as string,
      };
      const result = await this.userService.getAllUsers(filters);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.userService.getUserById(id);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateUserDTO = req.body;
      const result = await this.userService.updateUser(id, data);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.userService.deleteUser(id);
      res.status(200).json({ success: true, message: 'Utilisateur supprimé' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  validateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.userService.validateUser(id);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  suspendUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.userService.suspendUser(id);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  activateUser = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.userService.activateUser(id);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };
}
