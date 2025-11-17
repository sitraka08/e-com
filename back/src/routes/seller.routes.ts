import { Router } from 'express';
import { SellerController } from '../controllers';
import { authenticate, authorize } from '../middlewares';
import { UserRole } from '../types';

export const createSellerRoutes = (sellerController: SellerController): Router => {
  const router = Router();

  // Public routes (authenticated users only)
  router.use(authenticate);

  // Seller Request Routes - Any authenticated user can submit
  router.post('/request', sellerController.submitSellerRequest);
  router.get('/request/me', sellerController.getMySellerRequest);

  // Seller Routes - Only for users with SELLER role
  // IMPORTANT: Declare more specific routes FIRST before generic routes

  // Orders sub-routes - most specific first
  router.patch('/me/orders/:id/status', authorize(UserRole.SELLER), sellerController.updateOrderStatus);
  router.get('/me/orders/:id', authorize(UserRole.SELLER), sellerController.getOrderById);
  router.get('/me/orders', authorize(UserRole.SELLER), sellerController.getMyOrders);

  // Other /me routes
  router.get('/me/stats', authorize(UserRole.SELLER), sellerController.getSellerStats);
  router.get('/me/products', authorize(UserRole.SELLER), sellerController.getSellerProducts);
  router.put('/me', authorize(UserRole.SELLER), sellerController.updateSellerProfile);
  router.get('/me', authorize(UserRole.SELLER), sellerController.getSellerProfile);

  // Admin Routes - Only for ADMIN (declare specific routes BEFORE generic /:id)
  router.get('/requests', authorize(UserRole.ADMIN), sellerController.getAllSellerRequests);
  router.patch('/requests/:id/approve', authorize(UserRole.ADMIN), sellerController.approveSellerRequest);
  router.patch('/requests/:id/reject', authorize(UserRole.ADMIN), sellerController.rejectSellerRequest);
  router.get('/requests/:id', authorize(UserRole.ADMIN), sellerController.getSellerRequestById);

  router.get('/pending', authorize(UserRole.ADMIN), sellerController.getPendingSellers);
  router.patch('/:id/approve', authorize(UserRole.ADMIN), sellerController.approveSeller);
  router.patch('/:id/reject', authorize(UserRole.ADMIN), sellerController.rejectSeller);
  router.patch('/:id/commission', authorize(UserRole.ADMIN), sellerController.updateCommissionRate);
  router.get('/', authorize(UserRole.ADMIN), sellerController.getAllSellers);
  router.get('/:id', authorize(UserRole.ADMIN), sellerController.getSellerById);

  return router;
};
