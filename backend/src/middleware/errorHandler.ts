import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Server error occurred', { error, path: req.path, method: req.method });

  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof SyntaxError && 'body' in error) {
    logger.warn('Invalid JSON in request body', { path: req.path, method: req.method });
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }

  res.status(error.status || 500).json({
    message: error.message || 'Internal server error'
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  logger.warn('Route not found', { path: req.path, method: req.method });
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` });
};
