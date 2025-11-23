import { getDatabase } from '../config/database';
import { logger } from '../config/logger';
import { Challenge } from '../types';
import { NotFoundError } from '../middleware/errorHandler';
import fs from 'fs/promises';
import path from 'path';

/**
 * Creates a new challenge
 *
 * @param data - Challenge creation data
 * @param data.title - Challenge title
 * @param data.description - Detailed challenge description
 * @param data.created_at - ISO 8601 datetime when challenge was created
 * @param data.deadline - ISO 8601 datetime for submission deadline
 * @param data.created_by_admin_id - ID of the admin creating the challenge
 *
 * @returns Promise resolving to the created challenge
 *
 * @throws {Error} If challenge creation fails
 */
export async function createChallenge(data: {
  title: string;
  description: string;
  created_at: string;
  deadline: string;
  created_by_admin_id: number;
}): Promise<Challenge> {
  const db = getDatabase();

  const result = await db.run(
    `INSERT INTO challenges (title, description, created_at, deadline, created_by_admin_id)
     VALUES (?, ?, ?, ?, ?)`,
    [data.title, data.description, data.created_at, data.deadline, data.created_by_admin_id]
  );

  const challenge = await db.get<Challenge>('SELECT * FROM challenges WHERE id = ?', [
    result.lastID,
  ]);

  if (!challenge) {
    throw new Error('Failed to create challenge');
  }

  logger.info('Challenge created', { challengeId: challenge.id, title: challenge.title });

  return challenge;
}

/**
 * Retrieves a challenge by its ID
 *
 * @param id - Challenge ID
 * @returns Promise resolving to challenge or null if not found
 */
export async function getChallengeById(id: number): Promise<Challenge | null> {
  const db = getDatabase();
  const challenge = await db.get<Challenge>('SELECT * FROM challenges WHERE id = ?', [id]);
  return challenge || null;
}

/**
 * Retrieves all challenges, ordered by creation date (newest first)
 *
 * @returns Promise resolving to array of all challenges
 */
export async function getAllChallenges(): Promise<Challenge[]> {
  const db = getDatabase();
  const challenges = await db.all<Challenge[]>(
    'SELECT * FROM challenges ORDER BY created_at DESC',
    []
  );
  return challenges;
}

/**
 * Updates an existing challenge
 *
 * @param id - Challenge ID to update
 * @param data - Fields to update
 * @param data.title - New title (optional)
 * @param data.description - New description (optional)
 * @param data.created_at - New creation datetime (optional)
 * @param data.deadline - New deadline (optional)
 *
 * @returns Promise resolving to updated challenge
 *
 * @throws {NotFoundError} If challenge with given ID doesn't exist
 */
export async function updateChallenge(
  id: number,
  data: {
    title?: string;
    description?: string;
    created_at?: string;
    deadline?: string;
  }
): Promise<Challenge> {
  const db = getDatabase();
  const updates: string[] = [];
  const values: any[] = [];

  if (data.title !== undefined) {
    updates.push('title = ?');
    values.push(data.title);
  }

  if (data.description !== undefined) {
    updates.push('description = ?');
    values.push(data.description);
  }

  if (data.created_at !== undefined) {
    updates.push('created_at = ?');
    values.push(data.created_at);
  }

  if (data.deadline !== undefined) {
    updates.push('deadline = ?');
    values.push(data.deadline);
  }

  if (updates.length === 0) {
    const challenge = await getChallengeById(id);
    if (!challenge) {
      throw new NotFoundError('Challenge not found');
    }
    return challenge;
  }

  //updates.push('updated_at = CURRENT_TIMESTAMP');
  // Note: updated_at is now handled automatically by trigger in database.ts
  values.push(id);

  const query = `UPDATE challenges SET ${updates.join(', ')} WHERE id = ?`;

  const result = await db.run(query, values);

  if (result.changes === 0) {
    throw new NotFoundError('Challenge not found');
  }

  const challenge = await getChallengeById(id);
  if (!challenge) {
    throw new NotFoundError('Challenge not found');
  }

  logger.info('Challenge updated', { challengeId: id, updates: Object.keys(data) });

  return challenge;
}

/**
 * Deletes a challenge and all associated submissions and files
 * Uses CASCADE delete from foreign keys for related records
 *
 * @param id - Challenge ID to delete
 *
 * @throws {NotFoundError} If challenge with given ID doesn't exist
 */
export async function deleteChallenge(id: number): Promise<void> {
  const db = getDatabase();

  // Get all submission filenames before deletion (CASCADE will remove records)
  const submissions = await db.all<{ filename: string }[]>(
    'SELECT filename FROM submissions WHERE challenge_id = ?',
    [id]
  );

  // Delete the challenge (CASCADE will delete submissions and scores)
  const result = await db.run('DELETE FROM challenges WHERE id = ?', [id]);

  if (result.changes === 0) {
    throw new NotFoundError('Challenge not found');
  }

  // Clean up submission files from filesystem
  for (const submission of submissions) {
    await deleteSubmissionFile(submission.filename);
  }

  logger.info('Challenge deleted', { challengeId: id, filesDeleted: submissions.length });
}

/**
 * Checks if a challenge is currently active (deadline not passed)
 *
 * @param id - Challenge ID
 * @returns Promise resolving to true if active, false otherwise
 * @throws {NotFoundError} If challenge doesn't exist
 */
export async function isChallengeActive(id: number): Promise<boolean> {
  const db = getDatabase();
  const result = await db.get<{ is_active: number }>(
    `SELECT (deadline > datetime('now')) as is_active
     FROM challenges WHERE id = ?`,
    [id]
  );

  if (result === undefined) {
    throw new NotFoundError('Challenge not found');
  }

  return result.is_active === 1;
}

/**
 * Deletes a submission file from the uploads directory
 * Logs errors but doesn't throw if file doesn't exist
 *
 * @param filename - Submission filename to delete
 */
async function deleteSubmissionFile(filename: string): Promise<void> {
  const filePath = path.resolve(__dirname, '../../uploads/submissions', filename);
  try {
    await fs.unlink(filePath);
    logger.debug('Submission file deleted', { filename });
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      logger.error('Error deleting submission file', { filename, error: err.message });
    }
  }
}
