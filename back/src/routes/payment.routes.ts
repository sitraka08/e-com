import { Router } from 'express';
import { PaymentController } from '../controllers';
import { authenticate, authorize } from '../middlewares';
import { UserRole } from '../types';

export const createPaymentRoutes = (paymentController: PaymentController): Router => {
  const router = Router();

  router.use(authenticate);

  router.post('/process', paymentController.processPayment);
  router.get('/order/:orderId', paymentController.getOrderPayments);

  router.use(authorize(UserRole.ADMIN));
  router.get('/', paymentController.getAllPayments);
  router.get('/:id', paymentController.getPaymentById);

  return router;
};
