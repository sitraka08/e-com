import { Router } from 'express';
import { UserController } from '../controllers';
import { authenticate, authorize } from '../middlewares';
import { UserRole } from '../types';

export const createUserRoutes = (userController: UserController): Router => {
  const router = Router();

  router.use(authenticate, authorize(UserRole.ADMIN));

  router.get('/', userController.getAllUsers);
  router.get('/:id', userController.getUserById);
  router.put('/:id', userController.updateUser);
  router.delete('/:id', userController.deleteUser);
  router.patch('/:id/validate', userController.validateUser);
  router.patch('/:id/suspend', userController.suspendUser);
  router.patch('/:id/activate', userController.activateUser);

  return router;
};
