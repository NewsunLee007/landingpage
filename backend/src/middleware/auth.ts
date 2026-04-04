import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends Request {
  adminId?: string;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.warn('Authentication failed: authorization header missing', { path: req.path, method: req.method });
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    logger.warn('Authentication failed: token missing', { path: req.path, method: req.method });
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    req.adminId = decoded.id;
    logger.debug('Authentication successful', { adminId: decoded.id, path: req.path, method: req.method });
    next();
  } catch (error) {
    logger.warn('Authentication failed: invalid or expired token', { path: req.path, method: req.method, error });
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
