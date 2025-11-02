import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares';
import { PaymentService } from '../services';
import { ApiResponse, ProcessPaymentDTO } from '../types';

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  processPayment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: ProcessPaymentDTO = req.body;
      const result = await this.paymentService.processPayment(data);
      res.status(201).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getAllPayments = async (_req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.paymentService.getAllPayments();
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getPaymentById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.paymentService.getPaymentById(id);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getOrderPayments = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const orderId = parseInt(req.params.orderId);
      const result = await this.paymentService.getOrderPayments(orderId);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };
}
