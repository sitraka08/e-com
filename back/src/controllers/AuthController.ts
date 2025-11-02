import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares';
import { AuthService } from '../services';
import { ApiResponse, RegisterDTO, LoginDTO, ForgotPasswordDTO, ResetPasswordDTO } from '../types';

export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: RegisterDTO = req.body;
      const result = await this.authService.register(data);
      res.status(201).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: LoginDTO = req.body;
      const result = await this.authService.login(data);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: ForgotPasswordDTO = req.body;
      const result = await this.authService.forgotPassword(data);
      res.status(200).json({ success: true, data: result, message: 'OTP envoyé par email' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data: ResetPasswordDTO = req.body;
      await this.authService.resetPassword(data);
      res.status(200).json({ success: true, message: 'Mot de passe réinitialisé avec succès' } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!.id;
      const result = await this.authService.getProfile(userId);
      res.status(200).json({ success: true, data: result } as ApiResponse);
    } catch (error) {
      next(error);
    }
  };
}
