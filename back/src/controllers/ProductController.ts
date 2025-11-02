import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares';
import { ProductService } from '../services';
import { ApiResponse, CreateProductDTO, UpdateProductDTO, ProductFilters, PaginationParams, UpdateStockDTO } from '../types';

export class ProductController {
  constructor(private productService: ProductService) {}

  createProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateProductDTO = req.body;
      const result = await this.productService.createProduct(data);
      res.status(201).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getAllProducts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters: ProductFilters = {
        categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
        isActive: req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      };
      const pagination: PaginationParams = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      };
      const result = await this.productService.getAllProducts(filters, pagination);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.productService.getProductById(id);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  searchProducts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query.q as string || '';
      const pagination: PaginationParams = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      };
      const result = await this.productService.searchProducts(query, pagination);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateProductDTO = req.body;
      const result = await this.productService.updateProduct(id, data);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.productService.deleteProduct(id);
      res.status(200).json({ success: true, message: 'Produit supprimé' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  updateStock = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateStockDTO = req.body;
      const result = await this.productService.updateStock(id, data);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getLowStockProducts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const threshold = req.query.threshold ? parseInt(req.query.threshold as string) : 10;
      const result = await this.productService.getLowStockProducts(threshold);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };
}
