import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import * as userService from '../../services/userService';
import { UserRepository } from '../../repositories/UserRepository';
import { ConflictError, NotFoundError } from '../../middleware/errorHandler';
import bcrypt from 'bcrypt';
import * as fs from 'fs/promises';
import path from 'path';
import { User } from '../../types';

jest.mock('../../repositories/UserRepository');
jest.mock('../../config/database', () => ({
  getDatabase: jest.fn(() => ({})),
}));
jest.mock('../../config/logger', () => ({
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
}));
jest.mock('fs/promises', () => ({
  unlink: jest.fn(),
}));
jest.mock('path', () => {
  const actualPath: typeof import('path') = jest.requireActual('path');
  return {
    ...actualPath,
    resolve: jest.fn((...segments: string[]) => segments.join('/')),
  };
});

const createUserFixture = (overrides: Partial<User> = {}): User => ({
  id: 1,
  username: 'testuser',
  email: 'test@example.com',
  password_hash: 'hashed_password',
  role: 'user',
  avatar_filename: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
});

describe('UserService', () => {
  let mockRepository: jest.Mocked<UserRepository>;
  let mockFsUnlink: jest.MockedFunction<typeof fs.unlink>;
  let mockPathResolve: jest.MockedFunction<typeof path.resolve>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRepository = {
      findById: jest.fn(),
      findByUsername: jest.fn(),
      findByEmail: jest.fn(),
      findByUsernameOrEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getAllUsers: jest.fn(),
      updateAvatar: jest.fn(),
    } as any;

    (UserRepository as jest.MockedClass<typeof UserRepository>).mockImplementation(
      () => mockRepository
    );

    userService.__resetUserRepositoryCache();

    mockFsUnlink = fs.unlink as jest.MockedFunction<typeof fs.unlink>;
    mockFsUnlink.mockResolvedValue(undefined);

    mockPathResolve = path.resolve as jest.MockedFunction<typeof path.resolve>;
    mockPathResolve.mockImplementation((...segments: string[]) => segments.join('/'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test@123456',
        role: 'user' as const,
      };

      const createdUser = createUserFixture();

      mockRepository.findByUsernameOrEmail.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(createdUser);

      const result = await userService.createUser(userData);

      expect(mockRepository.findByUsernameOrEmail).toHaveBeenCalledWith(
        userData.username,
        userData.email
      );
      expect(mockRepository.create).toHaveBeenCalled();
      expect(result).not.toHaveProperty('password_hash');
      expect(result.username).toBe(userData.username);
      expect(result.email).toBe(userData.email);
    });

    it('should throw ConflictError if username already exists', async () => {
      const userData = {
        username: 'existinguser',
        email: 'new@example.com',
        password: 'Test@123456',
        role: 'user' as const,
      };

      const existingUser = createUserFixture({ username: 'existinguser' });

      mockRepository.findByUsernameOrEmail.mockResolvedValue(existingUser);

      await expect(userService.createUser(userData)).rejects.toThrow(ConflictError);
      await expect(userService.createUser(userData)).rejects.toThrow(
        'Username or email already exists'
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('should hash the password before creating user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'PlainTextPassword',
        role: 'user' as const,
      };

      mockRepository.findByUsernameOrEmail.mockResolvedValue(null);
      mockRepository.create.mockImplementation(async (data) => ({
        ...createUserFixture({ id: 1 }),
        ...data,
      }));

      await userService.createUser(userData);

      const createCall = mockRepository.create.mock.calls[0][0];
      expect(createCall.password_hash).not.toBe(userData.password);
      expect(createCall.password_hash).toBeTruthy();

      const isValid = await bcrypt.compare(userData.password, createCall.password_hash);
      expect(isValid).toBe(true);
    });
  });

  describe('getUserById', () => {
    it('should return user without password hash', async () => {
      const user = createUserFixture();

      mockRepository.findById.mockResolvedValue(user);

      const result = await userService.getUserById(1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(result).not.toBeNull();
      expect(result).not.toHaveProperty('password_hash');
      expect(result?.username).toBe('testuser');
    });

    it('should return null if user not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await userService.getUserById(999);

      expect(result).toBeNull();
    });
  });

  describe('getUserByUsername', () => {
    it('should return user with password hash for authentication', async () => {
      const user = createUserFixture();

      mockRepository.findByUsername.mockResolvedValue(user);

      const result = await userService.getUserByUsername('testuser');

      expect(mockRepository.findByUsername).toHaveBeenCalledWith('testuser');
      expect(result).not.toBeNull();
      expect(result?.password_hash).toBe('hashed_password');
    });
  });

  describe('getUserByEmail', () => {
    it('should return sanitized user when found', async () => {
      const user = createUserFixture();

      mockRepository.findByEmail.mockResolvedValue(user);

      const result = await userService.getUserByEmail('test@example.com');

      expect(mockRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).not.toHaveProperty('password_hash');
      expect(result?.email).toBe('test@example.com');
    });

    it('should return null when user does not exist', async () => {
      mockRepository.findByEmail.mockResolvedValue(null);

      const result = await userService.getUserByEmail('missing@example.com');

      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const existingUser = createUserFixture({ username: 'oldname', email: 'old@example.com' });
      const updatedUser = createUserFixture({ username: 'newname', email: 'new@example.com' });

      mockRepository.findById
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(updatedUser);
      mockRepository.update.mockResolvedValue(1);

      const result = await userService.updateUser(1, {
        username: 'newname',
        email: 'new@example.com',
      });

      expect(mockRepository.update).toHaveBeenCalledWith(1, {
        username: 'newname',
        email: 'new@example.com',
      });
      expect(result.username).toBe('newname');
      expect(result.email).toBe('new@example.com');
      expect(result).not.toHaveProperty('password_hash');
    });

    it('should return existing user when no updates provided', async () => {
      const existingUser = createUserFixture();

      mockRepository.findById.mockResolvedValue(existingUser);

      const result = await userService.updateUser(1, {});

      expect(mockRepository.update).not.toHaveBeenCalled();
      expect(result.username).toBe(existingUser.username);
    });

    it('should throw NotFoundError if user does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(userService.updateUser(999, { username: 'newname' })).rejects.toThrow(
        NotFoundError
      );
    });

    it('should hash new password if provided', async () => {
      const existingUser = createUserFixture();

      mockRepository.findById
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(existingUser);
      mockRepository.update.mockResolvedValue(1);

      await userService.updateUser(1, { password: 'NewPass@123' });

      const updateCall = mockRepository.update.mock.calls[0][1];
      expect(updateCall.password_hash).toBeDefined();
      expect(updateCall.password_hash).not.toBe('NewPass@123');
    });

    it('should throw ConflictError on unique constraint violation', async () => {
      const existingUser = createUserFixture();

      mockRepository.findById.mockResolvedValue(existingUser);
      mockRepository.update.mockRejectedValue(
        new Error('SQLITE_CONSTRAINT: UNIQUE constraint failed')
      );

      await expect(userService.updateUser(1, { username: 'duplicate' })).rejects.toThrow(
        ConflictError
      );
    });

    it('should rethrow non-unique errors from repository', async () => {
      const existingUser = createUserFixture();

      mockRepository.findById.mockResolvedValue(existingUser);
      mockRepository.update.mockRejectedValue(new Error('database unavailable'));

      await expect(userService.updateUser(1, { username: 'anything' })).rejects.toThrow(
        'database unavailable'
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const user = createUserFixture();

      mockRepository.findById.mockResolvedValue(user);
      mockRepository.delete.mockResolvedValue(1);

      await expect(userService.deleteUser(1)).resolves.not.toThrow();

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should delete avatar file before removing user', async () => {
      const user = createUserFixture({ avatar_filename: 'avatar.png' });

      mockRepository.findById.mockResolvedValue(user);
      mockRepository.delete.mockResolvedValue(1);

      await userService.deleteUser(1);

      expect(mockFsUnlink).toHaveBeenCalledTimes(1);
      expect(mockFsUnlink).toHaveBeenCalledWith(expect.stringContaining('avatar.png'));
    });

    it('should throw NotFoundError if user does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(userService.deleteUser(999)).rejects.toThrow(NotFoundError);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError if deletion affects zero rows', async () => {
      const user = createUserFixture();

      mockRepository.findById.mockResolvedValue(user);
      mockRepository.delete.mockResolvedValue(0);

      await expect(userService.deleteUser(1)).rejects.toThrow(NotFoundError);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users without password hashes', async () => {
      const users = [
        createUserFixture({ id: 1, username: 'user1' }),
        createUserFixture({ id: 2, username: 'admin1', role: 'admin' }),
      ];

      mockRepository.getAllUsers.mockResolvedValue(users);

      const result = await userService.getAllUsers();

      expect(result).toHaveLength(2);
      expect(result[0]).not.toHaveProperty('password_hash');
      expect(result[1]).not.toHaveProperty('password_hash');
    });

    it('should filter users by role', async () => {
      const adminUsers = [createUserFixture({ id: 2, username: 'admin1', role: 'admin' })];

      mockRepository.getAllUsers.mockResolvedValue(adminUsers);

      const result = await userService.getAllUsers('admin');

      expect(mockRepository.getAllUsers).toHaveBeenCalledWith('admin');
      expect(result).toHaveLength(1);
      expect(result[0].role).toBe('admin');
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const password = 'TestPassword123!';
      const hash = await bcrypt.hash(password, 10);

      const result = await userService.verifyPassword(password, hash);

      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'TestPassword123!';
      const hash = await bcrypt.hash(password, 10);

      const result = await userService.verifyPassword('WrongPassword', hash);

      expect(result).toBe(false);
    });
  });

  describe('updateAvatar', () => {
    it('should replace avatar and delete previous file', async () => {
      const existingUser = createUserFixture({ avatar_filename: 'old.png' });
      const updatedUser = createUserFixture({ avatar_filename: 'new.png' });

      mockRepository.findById
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(updatedUser);
      mockRepository.updateAvatar.mockResolvedValue(1);

      const result = await userService.updateAvatar(1, 'new.png');

      expect(mockFsUnlink).toHaveBeenCalledWith(expect.stringContaining('old.png'));
      expect(mockRepository.updateAvatar).toHaveBeenCalledWith(1, 'new.png');
      expect(result.avatar_filename).toBe('new.png');
    });

    it('should not attempt to delete avatar if none exists', async () => {
      const existingUser = createUserFixture();
      const updatedUser = createUserFixture({ avatar_filename: 'new.png' });

      mockRepository.findById
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(updatedUser);
      mockRepository.updateAvatar.mockResolvedValue(1);

      await userService.updateAvatar(1, 'new.png');

      expect(mockFsUnlink).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError when user does not exist', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(userService.updateAvatar(999, 'file.png')).rejects.toThrow(NotFoundError);
      expect(mockRepository.updateAvatar).not.toHaveBeenCalled();
    });

    it('should ignore ENOENT errors when deleting old avatar', async () => {
      const existingUser = createUserFixture({ avatar_filename: 'old.png' });
      const updatedUser = createUserFixture({ avatar_filename: 'new.png' });

      mockRepository.findById
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(updatedUser);
      mockRepository.updateAvatar.mockResolvedValue(1);

      mockFsUnlink.mockRejectedValueOnce(Object.assign(new Error('missing'), { code: 'ENOENT' }));

      await expect(userService.updateAvatar(1, 'new.png')).resolves.not.toThrow();
    });
  });

  describe('deleteAvatar', () => {
    it('should remove avatar file and clear filename', async () => {
      const existingUser = createUserFixture({ avatar_filename: 'avatar.png' });
      const updatedUser = createUserFixture({ avatar_filename: null });

      mockRepository.findById
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(updatedUser);
      mockRepository.updateAvatar.mockResolvedValue(1);

      const result = await userService.deleteAvatar(1);

      expect(mockFsUnlink).toHaveBeenCalledWith(expect.stringContaining('avatar.png'));
      expect(mockRepository.updateAvatar).toHaveBeenCalledWith(1, null);
      expect(result.avatar_filename).toBeNull();
    });

    it('should skip file deletion when no avatar exists', async () => {
      const existingUser = createUserFixture();
      const updatedUser = createUserFixture();

      mockRepository.findById
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(updatedUser);
      mockRepository.updateAvatar.mockResolvedValue(1);

      await userService.deleteAvatar(1);

      expect(mockFsUnlink).not.toHaveBeenCalled();
    });

    it('should throw NotFoundError when user is missing', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(userService.deleteAvatar(123)).rejects.toThrow(NotFoundError);
    });
  });
});
