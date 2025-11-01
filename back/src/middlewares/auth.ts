import { Request, Response, NextFunction } from 'express';
import { Role } from '../generated/prisma';
import { AuthService } from '../services/AuthService';
import { ApiResponse } from '../types';

// Étendre l'interface Request pour inclure user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: Role;
      };
    }
  }
}

/**
 * Middleware d'authentification JWT
 * Vérifie le token et ajoute les informations utilisateur à la requête
 */
export const authenticate = (authService: AuthService) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const response: ApiResponse = {
          success: false,
          error: 'Token d\'authentification requis',
        };
        res.status(401).json(response);
        return;
      }

      const token = authHeader.substring(7); // Enlever 'Bearer '
      const decoded = authService.verifyToken(token);

      req.user = decoded;
      next();
    } catch (error) {
      const response: ApiResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Token invalide',
      };
      res.status(401).json(response);
    }
  };
};

/**
 * Middleware d'autorisation par rôle
 * Vérifie que l'utilisateur a l'un des rôles autorisés
 */
export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        error: 'Authentification requise',
      };
      res.status(401).json(response);
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      const response: ApiResponse = {
        success: false,
        error: 'Accès refusé: permissions insuffisantes',
      };
      res.status(403).json(response);
      return;
    }

    next();
  };
};
