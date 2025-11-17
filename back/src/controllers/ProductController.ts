import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares";
import { ProductService } from "../services";
import {
  ApiResponse,
  CreateProductDTO,
  UpdateProductDTO,
  ProductFilters,
  PaginationParams,
  UpdateStockDTO,
  ProductFormData,
} from "../types";

export class ProductController {
  constructor(private productService: ProductService) {}

  createProduct = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let data: CreateProductDTO;

      // Vérifier si des fichiers ont été uploadés (FormData)
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const formData = req.body as ProductFormData;

        // Générer les URLs des images uploadées
        const imageUrls = req.files.map((file: Express.Multer.File) => {
          return `${req.protocol}://${req.get("host")}/uploads/products/${
            file.filename
          }`;
        });

        data = {
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          categoryId: parseInt(formData.categoryId),
          images: imageUrls,
        };
      } else {
        // Utiliser les URLs d'images du body JSON
        data = req.body;
      }

      const result = await this.productService.createProduct(
        data,
        req.user?.id,
        req.user?.role
      );
      res.status(201).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getAllProducts = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const filters: ProductFilters = {
        categoryId: req.query.categoryId
          ? parseInt(req.query.categoryId as string)
          : undefined,
        isActive:
          req.query.isActive === "true"
            ? true
            : req.query.isActive === "false"
            ? false
            : undefined,
        minPrice: req.query.minPrice
          ? parseFloat(req.query.minPrice as string)
          : undefined,
        maxPrice: req.query.maxPrice
          ? parseFloat(req.query.maxPrice as string)
          : undefined,
      };
      const pagination: PaginationParams = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      };
      const result = await this.productService.getAllProducts(
        filters,
        pagination
      );
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.productService.getProductById(id);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  searchProducts = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = (req.query.q as string) || "";
      const pagination: PaginationParams = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      };
      const result = await this.productService.searchProducts(
        query,
        pagination
      );
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      let data: UpdateProductDTO;

      // Vérifier si des fichiers ont été uploadés (FormData)
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const formData = req.body as Partial<ProductFormData>;

        // Générer les URLs des images uploadées
        const imageUrls = req.files.map((file: Express.Multer.File) => {
          return `${req.protocol}://${req.get("host")}/uploads/products/${
            file.filename
          }`;
        });

        data = {
          name: formData.name,
          description: formData.description,
          price: formData.price ? parseFloat(formData.price) : undefined,
          stock: formData.stock ? parseInt(formData.stock) : undefined,
          categoryId: formData.categoryId
            ? parseInt(formData.categoryId)
            : undefined,
          images: imageUrls,
        };
      } else {
        // Utiliser les données du body JSON
        data = req.body;
      }

      const result = await this.productService.updateProduct(
        id,
        data,
        req.user?.id,
        req.user?.role
      );
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.productService.deleteProduct(id, req.user?.id, req.user?.role);
      res
        .status(200)
        .json({ success: true, message: "Produit supprimé" } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  updateStock = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateStockDTO = req.body;
      const result = await this.productService.updateStock(id, data);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getLowStockProducts = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const threshold = req.query.threshold
        ? parseInt(req.query.threshold as string)
        : 10;
      const result = await this.productService.getLowStockProducts(threshold);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };
}
