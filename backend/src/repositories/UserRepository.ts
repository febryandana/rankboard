import { Database } from 'sqlite';
import { BaseRepository } from './BaseRepository';
import { User, UserRole } from '../types';

/**
 * Repository for User data access operations
 * Handles all database queries related to users
 */
export class UserRepository extends BaseRepository {
  constructor(db: Database) {
    super(db);
  }

  /**
   * Create a new user in the database
   * @param data User data including username, email, password_hash, and role
   * @returns The created user record
   */
  async create(data: {
    username: string;
    email: string;
    password_hash: string;
    role: UserRole;
  }): Promise<User> {
    const result = await this.execute(
      `INSERT INTO users (username, email, password_hash, role) 
       VALUES (?, ?, ?, ?)`,
      [data.username, data.email, data.password_hash, data.role]
    );

    const user = await this.findById(result.lastID!);
    if (!user) {
      throw new Error('Failed to create user');
    }

    return user;
  }

  /**
   * Find a user by ID
   * @param id User ID
   * @returns User record or null if not found
   */
  async findById(id: number): Promise<User | null> {
    return this.findOne<User>('SELECT * FROM users WHERE id = ?', [id]);
  }

  /**
   * Find a user by username
   * @param username Username to search for
   * @returns User record or null if not found
   */
  async findByUsername(username: string): Promise<User | null> {
    return this.findOne<User>('SELECT * FROM users WHERE username = ?', [username]);
  }

  /**
   * Find a user by email
   * @param email Email to search for
   * @returns User record or null if not found
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.findOne<User>('SELECT * FROM users WHERE email = ?', [email]);
  }

  /**
   * Check if a username or email already exists
   * @param username Username to check
   * @param email Email to check
   * @returns User record if exists, null otherwise
   */
  async findByUsernameOrEmail(username: string, email: string): Promise<User | null> {
    return this.findOne<User>('SELECT id FROM users WHERE username = ? OR email = ?', [
      username,
      email,
    ]);
  }

  /**
   * Update user data
   * @param id User ID
   * @param updates Object containing fields to update
   * @returns Number of rows affected
   */
  async update(
    id: number,
    updates: {
      username?: string;
      email?: string;
      password_hash?: string;
      role?: UserRole;
      avatar_filename?: string | null;
    }
  ): Promise<number> {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.username !== undefined) {
      fields.push('username = ?');
      values.push(updates.username);
    }

    if (updates.email !== undefined) {
      fields.push('email = ?');
      values.push(updates.email);
    }

    if (updates.password_hash !== undefined) {
      fields.push('password_hash = ?');
      values.push(updates.password_hash);
    }

    if (updates.role !== undefined) {
      fields.push('role = ?');
      values.push(updates.role);
    }

    if (updates.avatar_filename !== undefined) {
      fields.push('avatar_filename = ?');
      values.push(updates.avatar_filename);
    }

    if (fields.length === 0) {
      return 0;
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    const result = await this.execute(query, values);

    return result.changes || 0;
  }

  /**
   * Delete a user by ID
   * @param id User ID
   * @returns Number of rows affected
   */
  async delete(id: number): Promise<number> {
    const result = await this.execute('DELETE FROM users WHERE id = ?', [id]);
    return result.changes || 0;
  }

  /**
   * Get all users, optionally filtered by role
   * @param roleFilter Optional role to filter by
   * @returns Array of user records
   */
  async getAllUsers(roleFilter?: UserRole): Promise<User[]> {
    if (roleFilter) {
      return super.findAll<User>('SELECT * FROM users WHERE role = ? ORDER BY created_at DESC', [
        roleFilter,
      ]);
    }

    return super.findAll<User>('SELECT * FROM users ORDER BY created_at DESC');
  }

  /**
   * Update user's avatar filename
   * @param id User ID
   * @param filename Avatar filename (or null to remove)
   * @returns Number of rows affected
   */
  async updateAvatar(id: number, filename: string | null): Promise<number> {
    const result = await this.execute(
      'UPDATE users SET avatar_filename = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [filename, id]
    );

    return result.changes || 0;
  }
}
