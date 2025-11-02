import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
  console.error('Erreur:', err);

  // Si c'est une erreur applicative avec statusCode
  if (err instanceof AppError || err.statusCode) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erreur interne du serveur';

    res.status(statusCode).json({
      success: false,
      error: message,
    });
    return;
  }

  // Erreur inconnue - 500
  res.status(500).json({
    success: false,
    error: 'Erreur interne du serveur',
  });
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: 'Route introuvable',
  });
};
