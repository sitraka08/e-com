import { Router } from 'express';
import { ProductController } from '../controllers';
import { authenticate, authorize, uploadProductImages } from '../middlewares';
import { UserRole } from '../types';

export const createProductRoutes = (productController: ProductController): Router => {
  const router = Router();

  router.get('/', productController.getAllProducts);
  router.get('/search', productController.searchProducts);
  router.get('/:id', productController.getProductById);

  // Routes protégées: Seuls les SELLER peuvent gérer les produits
  router.post('/', authenticate, authorize(UserRole.SELLER), uploadProductImages, productController.createProduct);
  router.put('/:id', authenticate, authorize(UserRole.SELLER), uploadProductImages, productController.updateProduct);
  router.delete('/:id', authenticate, authorize(UserRole.SELLER), productController.deleteProduct);

  // Routes ADMIN uniquement
  router.get('/low-stock', authenticate, authorize(UserRole.ADMIN), productController.getLowStockProducts);
  router.patch('/:id/stock', authenticate, authorize(UserRole.ADMIN), productController.updateStock);

  return router;
};
