import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { authenticate } from '../middlewares/auth';

export const createAuthRouter = (
  authController: AuthController,
  authService: AuthService
): Router => {
  const router = Router();

  // POST /api/auth/register - Inscription
  router.post('/register', authController.register);

  // POST /api/auth/login - Connexion
  router.post('/login', authController.login);

  // GET /api/auth/profile - Profil utilisateur (protégé)
  router.get('/profile', authenticate(authService), authController.getProfile);

  return router;
};
