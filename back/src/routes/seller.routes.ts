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
  router.get('/me', authorize(UserRole.SELLER), sellerController.getSellerProfile);
  router.put('/me', authorize(UserRole.SELLER), sellerController.updateSellerProfile);
  router.get('/me/stats', authorize(UserRole.SELLER), sellerController.getSellerStats);
  router.get('/me/products', authorize(UserRole.SELLER), sellerController.getSellerProducts);

  // Admin Routes - Only for ADMIN
  router.get('/requests', authorize(UserRole.ADMIN), sellerController.getAllSellerRequests);
  router.get('/requests/:id', authorize(UserRole.ADMIN), sellerController.getSellerRequestById);
  router.patch('/requests/:id/approve', authorize(UserRole.ADMIN), sellerController.approveSellerRequest);
  router.patch('/requests/:id/reject', authorize(UserRole.ADMIN), sellerController.rejectSellerRequest);

  router.get('/', authorize(UserRole.ADMIN), sellerController.getAllSellers);
  router.get('/:id', authorize(UserRole.ADMIN), sellerController.getSellerById);
  router.patch('/:id/commission', authorize(UserRole.ADMIN), sellerController.updateCommissionRate);

  return router;
};
