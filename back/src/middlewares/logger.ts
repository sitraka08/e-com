import { Request, Response, NextFunction } from 'express';

/**
 * Middleware de logging des requêtes
 */
export const logger = (req: Request, res: Response, next: NextFunction): void => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
};
