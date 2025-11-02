import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares';
import { OrderService } from '../services';
import { ApiResponse, CreateOrderDTO, UpdateOrderStatusDTO, OrderFilters, PaginationParams } from '../types';

export class OrderController {
  constructor(private orderService: OrderService) {}

  createOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateOrderDTO = { ...req.body, userId: req.user!.id };
      const result = await this.orderService.createOrder(data);
      res.status(201).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getAllOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters: OrderFilters = {
        userId: req.user!.role === 'ADMIN'
          ? (req.query.userId ? parseInt(req.query.userId as string) : undefined)
          : req.user!.id,
        status: req.query.status as any,
        startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
        endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      };
      const pagination: PaginationParams = {
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
      };
      const result = await this.orderService.getAllOrders(filters, pagination);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getOrderById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.orderService.getOrderById(id);

      if (req.user!.role !== 'ADMIN' && result.userId !== req.user!.id) {
        res.status(403).json({ success: false, error: 'Accès non autorisé' } as ApiResponse);
        return;
      }

      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getOrderByNumber = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderNumber = req.params.orderNumber;
      const result = await this.orderService.getOrderByNumber(orderNumber);

      if (req.user!.role !== 'ADMIN' && result.userId !== req.user!.id) {
        res.status(403).json({ success: false, error: 'Accès non autorisé' } as ApiResponse);
        return;
      }

      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateOrderStatusDTO = req.body;
      const result = await this.orderService.updateOrderStatus(id, data);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const order = await this.orderService.getOrderById(id);

      if (req.user!.role !== 'ADMIN' && order.userId !== req.user!.id) {
        res.status(403).json({ success: false, error: 'Accès non autorisé' } as ApiResponse);
        return;
      }

      const result = await this.orderService.cancelOrder(id);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getStats = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.orderService.getStats();
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getUnpaidOrders = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.orderService.getUnpaidOrders();
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };
}
