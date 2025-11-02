import { Router } from 'express';
import { PaymentMethodController } from '../controllers';
import { authenticate } from '../middlewares';

export const createPaymentMethodRoutes = (paymentMethodController: PaymentMethodController): Router => {
  const router = Router();

  router.use(authenticate);

  router.post('/', paymentMethodController.createPaymentMethod);
  router.get('/', paymentMethodController.getUserPaymentMethods);
  router.get('/:id', paymentMethodController.getPaymentMethodById);
  router.put('/:id', paymentMethodController.updatePaymentMethod);
  router.delete('/:id', paymentMethodController.deletePaymentMethod);
  router.patch('/:id/set-default', paymentMethodController.setDefaultPaymentMethod);

  return router;
};
