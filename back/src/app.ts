import express, { Application } from 'express';
import cors from 'cors';
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
} from './services';

const prisma = new PrismaClient();

export const createApp = (): Application => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(logger);

  const userRepository = new UserRepository(prisma);
  const categoryRepository = new CategoryRepository(prisma);
  const productRepository = new ProductRepository(prisma);
  const addressRepository = new AddressRepository(prisma);
  const paymentMethodRepository = new PaymentMethodRepository(prisma);
  const orderRepository = new OrderRepository(prisma);
  const paymentRepository = new PaymentRepository(prisma);
  const otpRepository = new OtpRepository(prisma);

  const authService = new AuthService(userRepository, otpRepository);
  const userService = new UserService(userRepository);
  const categoryService = new CategoryService(categoryRepository);
  const productService = new ProductService(productRepository, categoryRepository);
  const addressService = new AddressService(addressRepository);
  const paymentMethodService = new PaymentMethodService(paymentMethodRepository);
  const orderService = new OrderService(orderRepository, paymentRepository, paymentMethodRepository, addressRepository);
  const paymentService = new PaymentService(paymentRepository, orderRepository);

  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'API E-Commerce - Backend MySQL + Prisma',
      version: '3.0.0',
      features: ['Auth JWT', 'Products', 'Orders', 'Multi-payment', 'Partial payment'],
    });
  });

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
