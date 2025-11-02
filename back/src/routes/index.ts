import { Router } from 'express';
import {
  AuthController,
  UserController,
  CategoryController,
  ProductController,
  AddressController,
  PaymentMethodController,
  OrderController,
  PaymentController,
} from '../controllers';
import { createAuthRoutes } from './auth.routes';
import { createUserRoutes } from './user.routes';
import { createCategoryRoutes } from './category.routes';
import { createProductRoutes } from './product.routes';
import { createAddressRoutes } from './address.routes';
import { createPaymentMethodRoutes } from './payment-method.routes';
import { createOrderRoutes } from './order.routes';
import { createPaymentRoutes } from './payment.routes';

interface RouteControllers {
  authController: AuthController;
  userController: UserController;
  categoryController: CategoryController;
  productController: ProductController;
  addressController: AddressController;
  paymentMethodController: PaymentMethodController;
  orderController: OrderController;
  paymentController: PaymentController;
}

export const createRoutes = (controllers: RouteControllers): Router => {
  const router = Router();

  router.use('/auth', createAuthRoutes(controllers.authController));
  router.use('/users', createUserRoutes(controllers.userController));
  router.use('/categories', createCategoryRoutes(controllers.categoryController));
  router.use('/products', createProductRoutes(controllers.productController));
  router.use('/addresses', createAddressRoutes(controllers.addressController));
  router.use('/payment-methods', createPaymentMethodRoutes(controllers.paymentMethodController));
  router.use('/orders', createOrderRoutes(controllers.orderController));
  router.use('/payments', createPaymentRoutes(controllers.paymentController));

  return router;
};
