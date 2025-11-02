import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares';
import { CategoryService } from '../services';
import { ApiResponse, CreateCategoryDTO, UpdateCategoryDTO } from '../types';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  createCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateCategoryDTO = req.body;
      const result = await this.categoryService.createCategory(data);
      res.status(201).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getAllCategories = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
      const result = await this.categoryService.getAllCategories(isActive);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getCategoryById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.categoryService.getCategoryById(id);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getCategoryBySlug = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const slug = req.params.slug;
      const result = await this.categoryService.getCategoryBySlug(slug);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  updateCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateCategoryDTO = req.body;
      const result = await this.categoryService.updateCategory(id, data);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  deleteCategory = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.categoryService.deleteCategory(id);
      res.status(200).json({ success: true, message: 'Catégorie supprimée' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };
}
