import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authenticate, authorize } from '../middlewares';
import { UserRole } from '../types';

export const createAdminRoutes = (adminController: AdminController): Router => {
  const router = Router();

  // Toutes les routes admin nécessitent l'authentification et le rôle ADMIN
  router.use(authenticate, authorize(UserRole.ADMIN));

  router.get('/stats', adminController.getPlatformStats);

  return router;
};
