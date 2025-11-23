import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { logger } from './logger';
import { env } from './env';

let db: Database | null = null;

export async function initDatabase(): Promise<void> {
  const dbPath = path.resolve(__dirname, '../../database/rankboard.db');

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await db.exec('PRAGMA foreign_keys = ON');

  // Enable query logging in development
  if (env.NODE_ENV === 'development') {
    db.on('trace', (sql: string) => {
      logger.debug('SQL Query:', { sql });
    });
  }

  logger.info('Connected to SQLite database');

  // Create users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(10) NOT NULL CHECK(role IN ('admin', 'user')),
      avatar_filename VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.exec('CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');

  // Create challenges table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title VARCHAR(200) NOT NULL,
      description TEXT,
      created_at DATETIME NOT NULL,
      deadline DATETIME NOT NULL,
      created_by_admin_id INTEGER NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by_admin_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_challenges_created_at ON challenges(created_at DESC)'
  );
  await db.exec('CREATE INDEX IF NOT EXISTS idx_challenges_deadline ON challenges(deadline)');
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_challenges_created_by ON challenges(created_by_admin_id)'
  );

  // Create submissions table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      challenge_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      filename VARCHAR(255) NOT NULL,
      submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(challenge_id, user_id)
    )
  `);

  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_submissions_challenge ON submissions(challenge_id)'
  );
  await db.exec('CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id)');
  await db.exec(
    'CREATE UNIQUE INDEX IF NOT EXISTS idx_submissions_challenge_user ON submissions(challenge_id, user_id)'
  );

  // Create scores table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      submission_id INTEGER NOT NULL,
      admin_id INTEGER NOT NULL,
      score INTEGER NOT NULL DEFAULT 0,
      feedback TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE,
      FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(submission_id, admin_id)
    )
  `);

  await db.exec('CREATE INDEX IF NOT EXISTS idx_scores_submission ON scores(submission_id)');
  await db.exec('CREATE INDEX IF NOT EXISTS idx_scores_admin ON scores(admin_id)');
  await db.exec(
    'CREATE UNIQUE INDEX IF NOT EXISTS idx_scores_submission_admin ON scores(submission_id, admin_id)'
  );

  // Additional performance indexes
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at DESC)'
  );
  await db.exec('CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score DESC)');

  // Composite indexes for common queries
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_submissions_challenge_submitted ON submissions(challenge_id, submitted_at DESC)'
  );
  await db.exec(
    'CREATE INDEX IF NOT EXISTS idx_scores_submission_score ON scores(submission_id, score DESC)'
  );

  // Create triggers for automatic updated_at
  await db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
    AFTER UPDATE ON users
    BEGIN
      UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);

  await db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_challenges_timestamp 
    AFTER UPDATE ON challenges
    BEGIN
      UPDATE challenges SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);

  await db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_submissions_timestamp 
    AFTER UPDATE ON submissions
    BEGIN
      UPDATE submissions SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);

  await db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_scores_timestamp 
    AFTER UPDATE ON scores
    BEGIN
      UPDATE scores SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);

  logger.info('Database tables and indexes created successfully');
}

export function getDatabase(): Database {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
    logger.info('Database connection closed');
  }
}

export default getDatabase;
