import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { ApiResponse } from '../types';

/**
 * Contrôleur pour les routes produits (Principe S - Single Responsibility)
 * Gère uniquement les requêtes/réponses HTTP pour les produits
 */
export class ProductController {
  constructor(private productService: ProductService) {}

  getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const products = await this.productService.getAllProducts();
      const response: ApiResponse = {
        success: true,
        data: products,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      };
      res.status(500).json(response);
    }
  };

  getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productService.getProductById(id);

      if (!product) {
        const response: ApiResponse = {
          success: false,
          error: 'Produit non trouvé',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: product,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      };
      res.status(400).json(response);
    }
  };

  searchProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = req.query.q as string;
      const products = await this.productService.searchProducts(query || '');

      const response: ApiResponse = {
        success: true,
        data: products,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      };
      res.status(500).json(response);
    }
  };

  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.createProduct(req.body);
      const response: ApiResponse = {
        success: true,
        data: product,
        message: 'Produit créé avec succès',
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      };
      res.status(400).json(response);
    }
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const product = await this.productService.updateProduct(id, req.body);

      if (!product) {
        const response: ApiResponse = {
          success: false,
          error: 'Produit non trouvé',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        data: product,
        message: 'Produit mis à jour avec succès',
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      };
      res.status(400).json(response);
    }
  };

  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.productService.deleteProduct(id);

      if (!deleted) {
        const response: ApiResponse = {
          success: false,
          error: 'Produit non trouvé',
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse = {
        success: true,
        message: 'Produit supprimé avec succès',
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      };
      res.status(400).json(response);
    }
  };
}
