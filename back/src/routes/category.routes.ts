import { Router } from 'express';
import { CategoryController } from '../controllers';
import { authenticate, authorize } from '../middlewares';
import { UserRole } from '../types';

export const createCategoryRoutes = (categoryController: CategoryController): Router => {
  const router = Router();

  router.get('/', categoryController.getAllCategories);
  router.get('/:id', categoryController.getCategoryById);
  router.get('/slug/:slug', categoryController.getCategoryBySlug);

  router.use(authenticate, authorize(UserRole.ADMIN));
  router.post('/', categoryController.createCategory);
  router.put('/:id', categoryController.updateCategory);
  router.delete('/:id', categoryController.deleteCategory);

  return router;
};
