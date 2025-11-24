import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import path from 'path';
import { getDatabase } from '../config/database';
import { logger } from '../config/logger';
import { User, UserResponse, UserRole } from '../types';
import { ConflictError, NotFoundError } from '../middleware/errorHandler';
import { UserRepository } from '../repositories/UserRepository';

const SALT_ROUNDS = 10;

// Initialize repository
let userRepository: UserRepository | null = null;

function getUserRepository(): UserRepository {
  if (!userRepository) {
    userRepository = new UserRepository(getDatabase());
  }
  return userRepository;
}

/**
 * Test-only helper to clear the cached repository instance.
 */
export function __resetUserRepositoryCache(): void {
  userRepository = null;
}

/**
 * Removes sensitive password hash from user object
 *
 * @param user - User object with password hash
 * @returns User object without password hash
 */
function sanitizeUser(user: User): UserResponse {
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

/**
 * Creates a new user account
 *
 * @param data - User creation data
 * @param data.username - Unique username (3-50 characters)
 * @param data.email - Valid email address
 * @param data.password - Plain text password (will be hashed)
 * @param data.role - User role: 'admin' or 'user'
 *
 * @returns Promise resolving to created user (without password hash)
 *
 * @throws {ConflictError} If username or email already exists
 *
 * @example
 * ```typescript
 * const user = await createUser({
 *   username: 'johndoe',
 *   email: 'john@example.com',
 *   password: 'SecurePass123!',
 *   role: 'user'
 * });
 * ```
 */
export async function createUser(data: {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}): Promise<UserResponse> {
  const repository = getUserRepository();
  const password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);

  // Check existing user
  const existing = await repository.findByUsernameOrEmail(data.username, data.email);

  if (existing) {
    throw new ConflictError('Username or email already exists');
  }

  // Insert user
  const user = await repository.create({
    username: data.username,
    email: data.email,
    password_hash,
    role: data.role,
  });

  return sanitizeUser(user);
}

/**
 * Retrieves a user by their ID
 *
 * @param id - User ID
 * @returns Promise resolving to user without password hash, or null if not found
 */
export async function getUserById(id: number): Promise<UserResponse | null> {
  const repository = getUserRepository();
  const user = await repository.findById(id);
  return user ? sanitizeUser(user) : null;
}

/**
 * Retrieves a user by username (includes password hash for authentication)
 *
 * @param username - Username to search for
 * @returns Promise resolving to user with password hash, or null if not found
 */
export async function getUserByUsername(username: string): Promise<User | null> {
  const repository = getUserRepository();
  return repository.findByUsername(username);
}

/**
 * Retrieves a user by email address (includes password hash for authentication)
 *
 * @param email - Email address to search for
 * @returns Promise resolving to user with password hash, or null if not found
 */
export async function getUserByEmailForAuth(email: string): Promise<User | null> {
  const repository = getUserRepository();
  return repository.findByEmail(email);
}

/**
 * Retrieves a user by email address
 *
 * @param email - Email address to search for
 * @returns Promise resolving to user without password hash, or null if not found
 */
export async function getUserByEmail(email: string): Promise<UserResponse | null> {
  const repository = getUserRepository();
  const user = await repository.findByEmail(email);
  return user ? sanitizeUser(user) : null;
}

/**
 * Updates an existing user's information
 *
 * @param id - User ID to update
 * @param data - Fields to update
 * @param data.username - New username (optional)
 * @param data.email - New email (optional)
 * @param data.password - New password, will be hashed (optional)
 * @param data.role - New role (optional)
 *
 * @returns Promise resolving to updated user without password hash
 *
 * @throws {NotFoundError} If user with given ID doesn't exist
 * @throws {ConflictError} If new username or email already exists
 */
export async function updateUser(
  id: number,
  data: {
    username?: string;
    email?: string;
    password?: string;
    role?: UserRole;
  }
): Promise<UserResponse> {
  const repository = getUserRepository();

  // Check if user exists
  const existingUser = await repository.findById(id);
  if (!existingUser) {
    throw new NotFoundError('User not found');
  }

  const updates: {
    username?: string;
    email?: string;
    password_hash?: string;
    role?: UserRole;
  } = {};

  if (data.username !== undefined) {
    updates.username = data.username;
  }

  if (data.email !== undefined) {
    updates.email = data.email;
  }

  if (data.password !== undefined) {
    updates.password_hash = await bcrypt.hash(data.password, SALT_ROUNDS);
  }

  if (data.role !== undefined) {
    updates.role = data.role;
  }

  if (Object.keys(updates).length === 0) {
    return sanitizeUser(existingUser);
  }

  try {
    await repository.update(id, updates);
  } catch (err: any) {
    if (err.message.includes('UNIQUE')) {
      throw new ConflictError('Username or email already exists');
    }
    throw err;
  }

  const user = await repository.findById(id);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return sanitizeUser(user);
}

/**
 * Deletes a user and their associated avatar file
 *
 * @param id - User ID to delete
 *
 * @throws {NotFoundError} If user with given ID doesn't exist
 */
export async function deleteUser(id: number): Promise<void> {
  const repository = getUserRepository();
  const user = await repository.findById(id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.avatar_filename) {
    await deleteAvatarFile(user.avatar_filename);
  }

  const changes = await repository.delete(id);

  if (changes === 0) {
    throw new NotFoundError('User not found');
  }
}

/**
 * Retrieves all users, optionally filtered by role
 *
 * @param roleFilter - Optional role filter ('admin' or 'user')
 * @returns Promise resolving to array of users without password hashes
 */
export async function getAllUsers(roleFilter?: UserRole): Promise<UserResponse[]> {
  const repository = getUserRepository();
  const users = await repository.getAllUsers(roleFilter);
  return users.map(sanitizeUser);
}

/**
 * Verifies a plain text password against a hashed password
 *
 * @param plainPassword - Plain text password to verify
 * @param hashedPassword - Bcrypt hashed password to compare against
 * @returns Promise resolving to true if passwords match, false otherwise
 */
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Updates a user's avatar image
 * Deletes the old avatar file if it exists
 *
 * @param id - User ID
 * @param filename - New avatar filename
 * @returns Promise resolving to updated user without password hash
 *
 * @throws {NotFoundError} If user with given ID doesn't exist
 */
export async function updateAvatar(id: number, filename: string): Promise<UserResponse> {
  const repository = getUserRepository();
  const user = await repository.findById(id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.avatar_filename) {
    await deleteAvatarFile(user.avatar_filename);
  }

  await repository.updateAvatar(id, filename);

  const updatedUser = await repository.findById(id);
  if (!updatedUser) {
    throw new NotFoundError('User not found');
  }

  return sanitizeUser(updatedUser);
}

/**
 * Deletes a user's avatar image and removes the file from disk
 *
 * @param id - User ID
 * @returns Promise resolving to updated user without password hash
 *
 * @throws {NotFoundError} If user with given ID doesn't exist
 */
export async function deleteAvatar(id: number): Promise<UserResponse> {
  const repository = getUserRepository();
  const user = await repository.findById(id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  if (user.avatar_filename) {
    await deleteAvatarFile(user.avatar_filename);
  }

  await repository.updateAvatar(id, null);

  const updatedUser = await repository.findById(id);
  if (!updatedUser) {
    throw new NotFoundError('User not found');
  }

  return sanitizeUser(updatedUser);
}

/**
 * Deletes an avatar file from the uploads directory
 * Logs errors but doesn't throw if file doesn't exist
 *
 * @param filename - Avatar filename to delete
 */
async function deleteAvatarFile(filename: string): Promise<void> {
  const filePath = path.resolve(__dirname, '../../uploads/avatars', filename);
  try {
    await fs.unlink(filePath);
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      logger.error('Error deleting avatar file', { filename, error: err });
    }
  }
}
