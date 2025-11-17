import { Router } from 'express';
import { OrderController } from '../controllers';
import { authenticate, authorize } from '../middlewares';
import { UserRole } from '../types';

export const createOrderRoutes = (orderController: OrderController): Router => {
  const router = Router();

  router.use(authenticate);

  router.post('/', orderController.createOrder);
  router.get('/', orderController.getAllOrders);
  router.get('/:id', orderController.getOrderById);
  router.get('/number/:orderNumber', orderController.getOrderByNumber);
  router.patch('/:id/cancel', orderController.cancelOrder);

  router.get('/stats', authorize(UserRole.ADMIN), orderController.getStats);
  router.get('/unpaid', authorize(UserRole.ADMIN), orderController.getUnpaidOrders);

  return router;
};
