import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares';
import { SellerService } from '../services';
import {
  ApiResponse,
  CreateSellerRequestDTO,
  UpdateSellerDTO,
  ApproveSellerRequestDTO,
  RejectSellerRequestDTO,
  UpdateCommissionRateDTO,
  SellerRequestStatus,
} from '../types';

export class SellerController {
  constructor(private sellerService: SellerService) {}

  // Seller Request Endpoints
  submitSellerRequest = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const data: CreateSellerRequestDTO = req.body;

      const result = await this.sellerService.submitSellerRequest(userId, data);
      res.status(201).json({ success: true, data: result, message: 'Seller request submitted successfully' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getAllSellerRequests = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const status = req.query.status as SellerRequestStatus | undefined;
      const filters = status ? { status } : undefined;

      const result = await this.sellerService.getAllSellerRequests(filters);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getSellerRequestById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.sellerService.getSellerRequestById(id);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getMySellerRequest = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await this.sellerService.getMySellerRequest(userId);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  approveSellerRequest = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestId = parseInt(req.params.id);
      const adminId = req.user!.id;
      const data: ApproveSellerRequestDTO | undefined = req.body;

      const result = await this.sellerService.approveSellerRequest(requestId, adminId, data);
      res.status(200).json({ success: true, data: result, message: 'Seller request approved successfully' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  rejectSellerRequest = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const requestId = parseInt(req.params.id);
      const adminId = req.user!.id;
      const data: RejectSellerRequestDTO = req.body;

      const result = await this.sellerService.rejectSellerRequest(requestId, adminId, data);
      res.status(200).json({ success: true, data: result, message: 'Seller request rejected' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  // Seller Endpoints
  getSellerProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await this.sellerService.getSellerProfile(userId);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getSellerById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.sellerService.getSellerById(id);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getAllSellers = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isApproved = req.query.isApproved === 'true' ? true : req.query.isApproved === 'false' ? false : undefined;
      const filters = isApproved !== undefined ? { isApproved } : undefined;

      const result = await this.sellerService.getAllSellers(filters);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  updateSellerProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const data: UpdateSellerDTO = req.body;

      const result = await this.sellerService.updateSellerProfile(userId, data);
      res.status(200).json({ success: true, data: result, message: 'Seller profile updated successfully' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  updateCommissionRate = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sellerId = parseInt(req.params.id);
      const data: UpdateCommissionRateDTO = req.body;

      const result = await this.sellerService.updateCommissionRate(sellerId, data);
      res.status(200).json({ success: true, data: result, message: 'Commission rate updated successfully' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getSellerStats = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await this.sellerService.getSellerStats(userId);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getSellerProducts = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await this.sellerService.getSellerProducts(userId, page, limit);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };
}
