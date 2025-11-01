import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { ApiResponse } from '../types';

/**
 * Contrôleur d'authentification (Principe S - Single Responsibility)
 * Gère uniquement les requêtes/réponses HTTP pour l'authentification
 */
export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name, phone, address, role } = req.body;

      // Validation basique
      if (!email || !password || !name) {
        const response: ApiResponse = {
          success: false,
          error: 'Email, mot de passe et nom sont requis',
        };
        res.status(400).json(response);
        return;
      }

      if (password.length < 6) {
        const response: ApiResponse = {
          success: false,
          error: 'Le mot de passe doit contenir au moins 6 caractères',
        };
        res.status(400).json(response);
        return;
      }

      const result = await this.authService.register({
        email,
        password,
        name,
        phone,
        address,
        role,
      });

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Inscription réussie',
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de l\'inscription',
      };
      res.status(400).json(response);
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        const response: ApiResponse = {
          success: false,
          error: 'Email et mot de passe sont requis',
        };
        res.status(400).json(response);
        return;
      }

      const result = await this.authService.login({ email, password });

      const response: ApiResponse = {
        success: true,
        data: result,
        message: 'Connexion réussie',
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la connexion',
      };
      res.status(401).json(response);
    }
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        const response: ApiResponse = {
          success: false,
          error: 'Non authentifié',
        };
        res.status(401).json(response);
        return;
      }

      const user = await this.authService.getUserById(req.user.userId);

      const response: ApiResponse = {
        success: true,
        data: user,
      };
      res.json(response);
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur serveur',
      };
      res.status(500).json(response);
    }
  };
}
