import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { logger, errorHandler, notFoundHandler } from './middlewares';
import {
  UserRepository,
  CategoryRepository,
  ProductRepository,
  AddressRepository,
  PaymentMethodRepository,
  OrderRepository,
  PaymentRepository,
  OtpRepository,
} from './repositories';
import {
  AuthService,
  UserService,
  CategoryService,
  ProductService,
  AddressService,
  PaymentMethodService,
  OrderService,
  PaymentService,
  EmailService,
} from './services';
import {
  AuthController,
  UserController,
  CategoryController,
  ProductController,
  AddressController,
  PaymentMethodController,
  OrderController,
  PaymentController,
} from './controllers';
import { createRoutes } from './routes';

const prisma = new PrismaClient();

export const createApp = (): Application => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(logger);

  // Servir les fichiers statiques (images uploadées)
  app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

  const userRepository = new UserRepository(prisma);
  const categoryRepository = new CategoryRepository(prisma);
  const productRepository = new ProductRepository(prisma);
  const addressRepository = new AddressRepository(prisma);
  const paymentMethodRepository = new PaymentMethodRepository(prisma);
  const orderRepository = new OrderRepository(prisma);
  const paymentRepository = new PaymentRepository(prisma);
  const otpRepository = new OtpRepository(prisma);

  const emailService = new EmailService();
  const authService = new AuthService(userRepository, otpRepository, emailService);
  const userService = new UserService(userRepository);
  const categoryService = new CategoryService(categoryRepository);
  const productService = new ProductService(productRepository, categoryRepository);
  const addressService = new AddressService(addressRepository);
  const paymentMethodService = new PaymentMethodService(paymentMethodRepository);
  const orderService = new OrderService(orderRepository);
  const paymentService = new PaymentService(paymentRepository, orderRepository);

  const authController = new AuthController(authService);
  const userController = new UserController(userService);
  const categoryController = new CategoryController(categoryService);
  const productController = new ProductController(productService);
  const addressController = new AddressController(addressService);
  const paymentMethodController = new PaymentMethodController(paymentMethodService);
  const orderController = new OrderController(orderService);
  const paymentController = new PaymentController(paymentService);

  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'API E-Commerce - Backend MySQL + Prisma',
      version: '3.0.0',
      features: ['Auth JWT', 'Products', 'Orders', 'Multi-payment', 'Partial payment'],
    });
  });

  app.use('/api', createRoutes({
    authController,
    userController,
    categoryController,
    productController,
    addressController,
    paymentMethodController,
    orderController,
    paymentController,
  }));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
