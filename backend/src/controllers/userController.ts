import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as userService from '../services/userService';
import { ForbiddenError, NotFoundError } from '../middleware/errorHandler';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { role } = req.query;
    const roleFilter = role === 'admin' || role === 'user' ? role : undefined;
    const users = await userService.getAllUsers(roleFilter);

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = parseInt(req.params.id, 10);
    const authReq = req as AuthRequest;

    if (authReq.session.role !== 'admin' && authReq.session.userId !== userId) {
      throw new ForbiddenError('You can only view your own profile');
    }

    const user = await userService.getUserById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { username, email, password, role } = req.body;

    const user = await userService.createUser({
      username,
      email,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = parseInt(req.params.id, 10);
    const authReq = req as AuthRequest;
    const { username, email, password, role } = req.body;

    if (authReq.session.role !== 'admin' && authReq.session.userId !== userId) {
      throw new ForbiddenError('You can only update your own profile');
    }

    if (role !== undefined && authReq.session.role !== 'admin') {
      throw new ForbiddenError('Only admins can change user roles');
    }

    const updateData: any = {};
    if (username !== undefined) {
      updateData.username = username;
    }
    if (email !== undefined) {
      updateData.email = email;
    }
    if (password !== undefined) {
      updateData.password = password;
    }
    if (role !== undefined) {
      updateData.role = role;
    }

    const user = await userService.updateUser(userId, updateData);

    if (authReq.session.userId === userId) {
      if (username !== undefined) {
        authReq.session.username = username;
      }
      if (email !== undefined) {
        authReq.session.email = email;
      }
      if (role !== undefined) {
        authReq.session.role = role;
      }
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = parseInt(req.params.id, 10);
    const authReq = req as AuthRequest;

    if (authReq.session.userId === userId) {
      throw new ForbiddenError('You cannot delete your own account');
    }

    await userService.deleteUser(userId);

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

export async function uploadAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = parseInt(req.params.id, 10);
    const authReq = req as AuthRequest;

    if (authReq.session.role !== 'admin' && authReq.session.userId !== userId) {
      throw new ForbiddenError('You can only update your own avatar');
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
      return;
    }

    const user = await userService.updateAvatar(userId, req.file.filename);

    res.json({
      success: true,
      data: {
        avatar_filename: user.avatar_filename,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAvatar(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = parseInt(req.params.id, 10);
    const authReq = req as AuthRequest;

    if (authReq.session.role !== 'admin' && authReq.session.userId !== userId) {
      throw new ForbiddenError('You can only delete your own avatar');
    }

    await userService.deleteAvatar(userId);

    res.json({
      success: true,
      message: 'Avatar deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
