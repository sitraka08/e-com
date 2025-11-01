import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

export const createProductRouter = (productController: ProductController): Router => {
  const router = Router();

  // GET /api/products - Récupérer tous les produits
  router.get('/', productController.getAllProducts);

  // GET /api/products/search?q=query - Rechercher des produits
  router.get('/search', productController.searchProducts);

  // GET /api/products/:id - Récupérer un produit par ID
  router.get('/:id', productController.getProductById);

  // POST /api/products - Créer un nouveau produit
  router.post('/', productController.createProduct);

  // PUT /api/products/:id - Mettre à jour un produit
  router.put('/:id', productController.updateProduct);

  // DELETE /api/products/:id - Supprimer un produit
  router.delete('/:id', productController.deleteProduct);

  return router;
};
