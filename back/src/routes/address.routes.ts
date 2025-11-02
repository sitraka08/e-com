import { Router } from 'express';
import { AddressController } from '../controllers';
import { authenticate } from '../middlewares';

export const createAddressRoutes = (addressController: AddressController): Router => {
  const router = Router();

  router.use(authenticate);

  router.post('/', addressController.createAddress);
  router.get('/', addressController.getUserAddresses);
  router.get('/:id', addressController.getAddressById);
  router.put('/:id', addressController.updateAddress);
  router.delete('/:id', addressController.deleteAddress);
  router.patch('/:id/set-default', addressController.setDefaultAddress);

  return router;
};
