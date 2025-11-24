import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { AuthRequest } from '../types';
import * as userService from '../services/userService';
import { UnauthorizedError } from '../middleware/errorHandler';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const user = await userService.getUserByEmailForAuth(email);

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValidPassword = await userService.verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const authReq = req as AuthRequest;

    // Regenerate session to prevent fixation attacks
    authReq.session.regenerate((err) => {
      if (err) {
        logger.error('Session regeneration error', { error: err });
        return next(err);
      }

      // Restore session data after regeneration
      authReq.session.userId = user.id;
      authReq.session.username = user.username;
      authReq.session.email = user.email;
      authReq.session.role = user.role;

      authReq.session.save((err) => {
        if (err) {
          logger.error('Session save error', { error: err });
          return next(err);
        }

        userService
          .getUserById(user.id)
          .then((userResponse) => {
            res.json({
              success: true,
              data: {
                user: userResponse,
              },
            });
          })
          .catch(next);
      });
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    req.session.destroy((err) => {
      if (err) {
        logger.error('Error destroying session', { error: err });
      }
      res.clearCookie('rankboard.sid');
      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    });
  } catch (error) {
    next(error);
  }
}

export async function getSession(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authReq = req as AuthRequest;

    if (!authReq.session || !authReq.session.userId) {
      res.json({
        success: true,
        data: {
          authenticated: false,
          user: null,
        },
      });
      return;
    }

    const user = await userService.getUserById(authReq.session.userId);

    if (!user) {
      req.session.destroy(() => {});
      res.json({
        success: true,
        data: {
          authenticated: false,
          user: null,
        },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        authenticated: true,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
}
