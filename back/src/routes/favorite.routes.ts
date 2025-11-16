import { Router } from 'express';
import { FavoriteController } from '../controllers';
import { authenticate } from '../middlewares';

export const createFavoriteRoutes = (favoriteController: FavoriteController): Router => {
  const router = Router();

  // All routes require authentication
  router.use(authenticate);

  router.post('/', favoriteController.addFavorite);
  router.get('/', favoriteController.getUserFavorites);
  router.delete('/:productId', favoriteController.removeFavorite);
  router.get('/check/:productId', favoriteController.checkIsFavorite);

  return router;
};
