// Classes d'erreurs personnalisées avec codes HTTP appropriés

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 - Erreur de validation
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

// 401 - Non authentifié
export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 401);
  }
}

// 403 - Non autorisé
export class AuthorizationError extends AppError {
  constructor(message: string) {
    super(message, 403);
  }
}

// 404 - Ressource non trouvée
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

// 409 - Conflit (ex: email déjà utilisé)
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}
