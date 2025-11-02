import { Router } from 'express';
import { ProductController } from '../controllers';
import { authenticate, authorize, uploadProductImages } from '../middlewares';
import { UserRole } from '../types';

export const createProductRoutes = (productController: ProductController): Router => {
  const router = Router();

  router.get('/', productController.getAllProducts);
  router.get('/search', productController.searchProducts);
  router.get('/:id', productController.getProductById);

  router.use(authenticate, authorize(UserRole.ADMIN));
  router.post('/', uploadProductImages, productController.createProduct);
  router.get('/low-stock', productController.getLowStockProducts);
  router.put('/:id', uploadProductImages, productController.updateProduct);
  router.delete('/:id', productController.deleteProduct);
  router.patch('/:id/stock', productController.updateStock);

  return router;
};
