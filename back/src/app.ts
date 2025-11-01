import express, { Application } from 'express';
import cors from 'cors';
import { logger } from './middlewares/logger';
import { errorHandler } from './middlewares/errorHandler';
import { createProductRouter } from './routes/productRoutes';
import { createAuthRouter } from './routes/authRoutes';
import { ProductController } from './controllers/ProductController';
import { AuthController } from './controllers/AuthController';
import { ProductService } from './services/ProductService';
import { AuthService } from './services/AuthService';
import { PrismaProductRepository } from './repositories/PrismaProductRepository';
import { prisma } from './config/prisma';

/**
 * Configuration de l'application Express (Principe D - Dependency Injection)
 * Toutes les dépendances sont injectées via le constructeur
 */
export const createApp = (): Application => {
  const app = express();

  // Middlewares globaux
  app.use(cors());
  app.use(express.json());
  app.use(logger);

  // Injection de dépendances (SOLID - Dependency Inversion)
  // Repositories
  const productRepository = new PrismaProductRepository(prisma);

  // Services
  const productService = new ProductService(productRepository);
  const authService = new AuthService(prisma);

  // Controllers
  const productController = new ProductController(productService);
  const authController = new AuthController(authService);

  // Routes
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'API E-Commerce - Backend avec Prisma + MySQL',
      version: '2.0.0',
      features: ['Authentication', 'Products', 'Orders', 'Multi-role (Admin/Seller/Buyer)'],
    });
  });

  app.use('/api/auth', createAuthRouter(authController, authService));
  app.use('/api/products', createProductRouter(productController));

  // Middleware de gestion d'erreurs (doit être en dernier)
  app.use(errorHandler);

  return app;
};
