import { Database } from 'sqlite';

/**
 * Base repository providing common database operations
 * All specific repositories should extend this class
 */
export abstract class BaseRepository {
  constructor(protected db: Database) {}

  /**
   * Find a single record matching the query
   * @param query SQL query string
   * @param params Query parameters
   * @returns Single record or null if not found
   */
  protected async findOne<T>(query: string, params: any[] = []): Promise<T | null> {
    const result = await this.db.get<T>(query, params);
    return result || null;
  }

  /**
   * Find all records matching the query
   * @param query SQL query string
   * @param params Query parameters
   * @returns Array of records (empty array if none found)
   */
  protected async findAll<T>(query: string, params: any[] = []): Promise<T[]> {
    return await this.db.all<T[]>(query, params);
  }

  /**
   * Execute a query that modifies data (INSERT, UPDATE, DELETE)
   * @param query SQL query string
   * @param params Query parameters
   * @returns Result containing lastID and changes count
   */
  protected async execute(
    query: string,
    params: any[] = []
  ): Promise<{ lastID?: number; changes?: number }> {
    return await this.db.run(query, params);
  }

  /**
   * Execute multiple SQL statements in a transaction
   * @param callback Function containing database operations
   * @returns Result of the callback function
   */
  protected async transaction<T>(callback: () => Promise<T>): Promise<T> {
    await this.db.exec('BEGIN TRANSACTION');
    try {
      const result = await callback();
      await this.db.exec('COMMIT');
      return result;
    } catch (error) {
      await this.db.exec('ROLLBACK');
      throw error;
    }
  }
}
