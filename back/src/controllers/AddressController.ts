import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares';
import { AddressService } from '../services';
import { ApiResponse, CreateAddressDTO, UpdateAddressDTO } from '../types';

export class AddressController {
  constructor(private addressService: AddressService) {}

  createAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: CreateAddressDTO = { ...req.body, userId: req.user!.id };
      const result = await this.addressService.createAddress(data);
      res.status(201).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getUserAddresses = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await this.addressService.getUserAddresses(userId);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getAddressById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const result = await this.addressService.getAddressById(id);

      if (req.user!.role !== 'ADMIN' && result.userId !== req.user!.id) {
        res.status(403).json({ success: false, error: 'Accès non autorisé' } as ApiResponse);
        return;
      }

      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  updateAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const address = await this.addressService.getAddressById(id);

      if (req.user!.role !== 'ADMIN' && address.userId !== req.user!.id) {
        res.status(403).json({ success: false, error: 'Accès non autorisé' } as ApiResponse);
        return;
      }

      const data: UpdateAddressDTO = req.body;
      const result = await this.addressService.updateAddress(id, data);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  deleteAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const address = await this.addressService.getAddressById(id);

      if (req.user!.role !== 'ADMIN' && address.userId !== req.user!.id) {
        res.status(403).json({ success: false, error: 'Accès non autorisé' } as ApiResponse);
        return;
      }

      await this.addressService.deleteAddress(id);
      res.status(200).json({ success: true, message: 'Adresse supprimée' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  setDefaultAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user!.id;
      const result = await this.addressService.setDefaultAddress(userId, id);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getDefaultAddress = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await this.addressService.getDefaultAddress(userId);
      if (!result) {
        res.status(404).json({ success: false, error: 'Aucune adresse par défaut trouvée' } as ApiResponse);
        return;
      }
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };
}
