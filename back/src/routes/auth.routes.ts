import { Router } from 'express';
import { AuthController } from '../controllers';
import { authenticate } from '../middlewares';

export const createAuthRoutes = (authController: AuthController): Router => {
  const router = Router();

  router.post('/register', authController.register);
  router.post('/login', authController.login);
  router.post('/forgot-password', authController.forgotPassword);
  router.post('/reset-password', authController.resetPassword);
  router.get('/profile', authenticate, authController.getProfile);

  return router;
};
