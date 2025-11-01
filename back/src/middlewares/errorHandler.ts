import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

/**
 * Middleware global de gestion des erreurs
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Erreur:', err);

  const response: ApiResponse = {
    success: false,
    error: err.message || 'Erreur interne du serveur',
  };

  res.status(500).json(response);
};
