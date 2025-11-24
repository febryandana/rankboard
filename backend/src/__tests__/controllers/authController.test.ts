import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import * as authController from '../../controllers/authController';
import * as userService from '../../services/userService';
import { AuthRequest } from '../../types';
import { UnauthorizedError } from '../../middleware/errorHandler';

// Mock dependencies
jest.mock('../../services/userService', () => ({
  getUserByEmailForAuth: jest.fn(),
  verifyPassword: jest.fn(),
  getUserById: jest.fn(),
}));
jest.mock('../../config/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
}));

describe('AuthController', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      body: {},
      session: {
        regenerate: jest.fn((cb: any) => cb(null)),
        save: jest.fn((cb: any) => cb(null)),
        destroy: jest.fn((cb: any) => cb(null)),
      } as any,
    };

    mockResponse = {
      json: jest.fn() as any,
      clearCookie: jest.fn() as any,
    };

    nextFunction = jest.fn();
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        role: 'user' as const,
        avatar_filename: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockUserResponse = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user' as const,
        avatar_filename: null,
        created_at: new Date().toISOString(),
      };

      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      (
        userService.getUserByEmailForAuth as jest.MockedFunction<
          typeof userService.getUserByEmailForAuth
        >
      ).mockResolvedValue(mockUser);
      (
        userService.verifyPassword as jest.MockedFunction<typeof userService.verifyPassword>
      ).mockResolvedValue(true);
      (
        userService.getUserById as jest.MockedFunction<typeof userService.getUserById>
      ).mockResolvedValue(mockUserResponse);

      await authController.login(mockRequest as Request, mockResponse as Response, nextFunction);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(userService.getUserByEmailForAuth).toHaveBeenCalledWith('test@example.com');
      expect(userService.verifyPassword).toHaveBeenCalledWith('password123', 'hashed_password');
      expect(mockRequest.session?.regenerate).toHaveBeenCalled();
      expect(mockRequest.session?.save).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          user: mockUserResponse,
        },
      });
    });

    it('should return error with invalid email', async () => {
      mockRequest.body = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      (
        userService.getUserByEmailForAuth as jest.MockedFunction<
          typeof userService.getUserByEmailForAuth
        >
      ).mockResolvedValue(null);

      await authController.login(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });

    it('should return error with invalid password', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        role: 'user' as const,
        avatar_filename: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockRequest.body = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      (
        userService.getUserByEmailForAuth as jest.MockedFunction<
          typeof userService.getUserByEmailForAuth
        >
      ).mockResolvedValue(mockUser);
      (
        userService.verifyPassword as jest.MockedFunction<typeof userService.verifyPassword>
      ).mockResolvedValue(false);

      await authController.login(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(nextFunction).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    });
  });

  describe('logout', () => {
    it('should logout user successfully', async () => {
      await authController.logout(mockRequest as Request, mockResponse as Response, nextFunction);

      expect(mockRequest.session?.destroy).toHaveBeenCalled();
      expect(mockResponse.clearCookie).toHaveBeenCalledWith('rankboard.sid');
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Logged out successfully',
      });
    });
  });

  describe('getSession', () => {
    it('should return authenticated user if session exists', async () => {
      const mockUserResponse = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user' as const,
        avatar_filename: null,
        created_at: new Date().toISOString(),
      };

      mockRequest.session = {
        userId: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
      } as any;

      (
        userService.getUserById as jest.MockedFunction<typeof userService.getUserById>
      ).mockResolvedValue(mockUserResponse);

      await authController.getSession(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(userService.getUserById).toHaveBeenCalledWith(1);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          authenticated: true,
          user: mockUserResponse,
        },
      });
    });

    it('should return unauthenticated if no session', async () => {
      mockRequest.session = {} as any;

      await authController.getSession(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          authenticated: false,
          user: null,
        },
      });
    });

    it('should destroy session if user not found', async () => {
      mockRequest.session = {
        userId: 999,
        destroy: jest.fn((cb: any) => cb()),
      } as any;

      (
        userService.getUserById as jest.MockedFunction<typeof userService.getUserById>
      ).mockResolvedValue(null);

      await authController.getSession(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockRequest.session?.destroy).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: {
          authenticated: false,
          user: null,
        },
      });
    });
  });
});
