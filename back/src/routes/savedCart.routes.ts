import { Router } from 'express';
import { SavedCartController } from '../controllers';
import { authenticate } from '../middlewares';

export const createSavedCartRoutes = (savedCartController: SavedCartController): Router => {
  const router = Router();

  // All routes require authentication
  router.use(authenticate);

  router.post('/', savedCartController.createSavedCart);
  router.get('/', savedCartController.getUserSavedCarts);
  router.get('/:id', savedCartController.getSavedCartById);
  router.put('/:id', savedCartController.updateSavedCart);
  router.delete('/:id', savedCartController.deleteSavedCart);

  return router;
};
