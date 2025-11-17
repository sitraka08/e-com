import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares';
import { FavoriteService } from '../services';
import { ApiResponse, AddFavoriteDTO } from '../types';

export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  addFavorite = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const { productId }: AddFavoriteDTO = req.body;

      const result = await this.favoriteService.addFavorite(userId, productId);
      res.status(201).json({ success: true, data: result, message: 'Product added to favorites' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getUserFavorites = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await this.favoriteService.getUserFavorites(userId);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  removeFavorite = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const productId = parseInt(req.params.productId);

      await this.favoriteService.removeFavorite(userId, productId);
      res.status(200).json({ success: true, message: 'Product removed from favorites' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  checkIsFavorite = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const productId = parseInt(req.params.productId);

      const isFavorite = await this.favoriteService.checkIsFavorite(userId, productId);
      res.status(200).json({ success: true, data: { isFavorite } } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };
}
