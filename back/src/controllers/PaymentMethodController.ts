import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares';
import { PaymentMethodService } from '../services';
import { ApiResponse, CreatePaymentMethodDTO, UpdatePaymentMethodDTO } from '../types';

export class PaymentMethodController {
  constructor(private paymentMethodService: PaymentMethodService) {}

  createPaymentMethod = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreatePaymentMethodDTO = { ...req.body, userId: req.user!.id };
      const result = await this.paymentMethodService.createPaymentMethod(data);
      res.status(201).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getUserPaymentMethods = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await this.paymentMethodService.getUserPaymentMethods(userId);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getPaymentMethodById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.paymentMethodService.getPaymentMethodById(id);

      if (req.user!.role !== 'ADMIN' && result.userId !== req.user!.id) {
        res.status(403).json({ success: false, error: 'Accès non autorisé' } as ApiResponse);
        return;
      }

      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  updatePaymentMethod = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const paymentMethod = await this.paymentMethodService.getPaymentMethodById(id);

      if (req.user!.role !== 'ADMIN' && paymentMethod.userId !== req.user!.id) {
        res.status(403).json({ success: false, error: 'Accès non autorisé' } as ApiResponse);
        return;
      }

      const data: UpdatePaymentMethodDTO = req.body;
      const result = await this.paymentMethodService.updatePaymentMethod(id, data);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  deletePaymentMethod = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const paymentMethod = await this.paymentMethodService.getPaymentMethodById(id);

      if (req.user!.role !== 'ADMIN' && paymentMethod.userId !== req.user!.id) {
        res.status(403).json({ success: false, error: 'Accès non autorisé' } as ApiResponse);
        return;
      }

      await this.paymentMethodService.deletePaymentMethod(id);
      res.status(200).json({ success: true, message: 'Méthode de paiement supprimée' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  setDefaultPaymentMethod = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user!.id;
      const result = await this.paymentMethodService.setDefaultPaymentMethod(userId, id);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };
}
