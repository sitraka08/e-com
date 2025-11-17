import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares';
import { SavedCartService } from '../services';
import { ApiResponse, CreateSavedCartDTO, UpdateSavedCartDTO } from '../types';

export class SavedCartController {
  constructor(private savedCartService: SavedCartService) {}

  createSavedCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const data: CreateSavedCartDTO = req.body;

      const result = await this.savedCartService.createSavedCart(userId, data);
      res.status(201).json({ success: true, data: result, message: 'Cart saved successfully' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getUserSavedCarts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await this.savedCartService.getUserSavedCarts(userId);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getSavedCartById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const id = parseInt(req.params.id);

      const result = await this.savedCartService.getSavedCartById(id, userId);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  updateSavedCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const id = parseInt(req.params.id);
      const data: UpdateSavedCartDTO = req.body;

      const result = await this.savedCartService.updateSavedCart(id, userId, data);
      res.status(200).json({ success: true, data: result, message: 'Saved cart updated successfully' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  deleteSavedCart = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const id = parseInt(req.params.id);

      await this.savedCartService.deleteSavedCart(id, userId);
      res.status(200).json({ success: true, message: 'Saved cart deleted successfully' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };
}
