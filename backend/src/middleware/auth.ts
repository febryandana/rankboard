import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { AuthRequest } from '../types';

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthRequest;

  if (!authReq.session || !authReq.session.userId) {
    logger.debug('Auth failed - no session or userId');
    res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
    return;
  }

  logger.debug('Auth passed', { userId: authReq.session.userId });
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authReq = req as AuthRequest;

  if (!authReq.session || !authReq.session.userId) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
    });
    return;
  }

  if (authReq.session.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: 'Admin access required',
    });
    return;
  }

  next();
}

export function optionalAuth(_req: Request, _res: Response, next: NextFunction): void {
  // User info already attached via session, just continue
  next();
}
