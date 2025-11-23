import { getDatabase } from '../config/database';
import { logger } from '../config/logger';
import { Submission } from '../types';
import { NotFoundError } from '../middleware/errorHandler';
import fs from 'fs/promises';
import path from 'path';

/**
 * Creates or updates a submission for a challenge
 * If a submission already exists for this user/challenge, it will be updated
 * The old file will be deleted when updating
 *
 * @param challengeId - Challenge ID
 * @param userId - User ID making the submission
 * @param filename - Filename of the uploaded submission
 *
 * @returns Promise resolving to the created or updated submission
 *
 * @throws {NotFoundError} If submission not found after update
 * @throws {Error} If submission creation fails
 */
export async function createSubmission(
  challengeId: number,
  userId: number,
  filename: string
): Promise<Submission> {
  const db = getDatabase();
  const existing = await getSubmissionByChallengeAndUser(challengeId, userId);

  if (existing) {
    await deleteSubmissionFile(existing.filename);

    await db.run(
      `UPDATE submissions 
       SET filename = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE challenge_id = ? AND user_id = ?`,
      [filename, challengeId, userId]
    );

    const updated = await getSubmissionByChallengeAndUser(challengeId, userId);
    if (!updated) {
      throw new NotFoundError('Submission not found after update');
    }
    return updated;
  } else {
    const result = await db.run(
      `INSERT INTO submissions (challenge_id, user_id, filename)
       VALUES (?, ?, ?)`,
      [challengeId, userId, filename]
    );

    const submission = await db.get<Submission>('SELECT * FROM submissions WHERE id = ?', [
      result.lastID,
    ]);

    if (!submission) {
      throw new Error('Failed to create submission');
    }

    return submission;
  }
}

/**
 * Retrieves a submission by its ID
 *
 * @param id - Submission ID
 * @returns Promise resolving to submission or null if not found
 */
export async function getSubmissionById(id: number): Promise<Submission | null> {
  const db = getDatabase();
  const submission = await db.get<Submission>('SELECT * FROM submissions WHERE id = ?', [id]);
  return submission || null;
}

/**
 * Retrieves a submission for a specific challenge and user
 *
 * @param challengeId - Challenge ID
 * @param userId - User ID
 * @returns Promise resolving to submission or null if not found
 */
export async function getSubmissionByChallengeAndUser(
  challengeId: number,
  userId: number
): Promise<Submission | null> {
  const db = getDatabase();
  const submission = await db.get<Submission>(
    'SELECT * FROM submissions WHERE challenge_id = ? AND user_id = ?',
    [challengeId, userId]
  );
  return submission || null;
}

/**
 * Retrieves all submissions for a challenge with user information
 * Includes user ID, username, and avatar filename
 *
 * @param challengeId - Challenge ID
 * @returns Promise resolving to array of submissions with user data
 */
export async function getSubmissionsByChallenge(challengeId: number): Promise<any[]> {
  const db = getDatabase();
  const submissions = await db.all<any[]>(
    `SELECT 
      s.*,
      u.id as user_id,
      u.username,
      u.avatar_filename
     FROM submissions s
     JOIN users u ON s.user_id = u.id
     WHERE s.challenge_id = ?
     ORDER BY s.submitted_at DESC`,
    [challengeId]
  );
  return submissions;
}

/**
 * Updates a submission's file
 * Deletes the old file and replaces it with the new one
 *
 * @param submissionId - Submission ID to update
 * @param filename - New filename
 *
 * @returns Promise resolving to updated submission
 *
 * @throws {NotFoundError} If submission with given ID doesn't exist
 */
export async function updateSubmission(
  submissionId: number,
  filename: string
): Promise<Submission> {
  const db = getDatabase();
  const submission = await getSubmissionById(submissionId);

  if (!submission) {
    throw new NotFoundError('Submission not found');
  }

  await deleteSubmissionFile(submission.filename);

  await db.run(
    `UPDATE submissions 
     SET filename = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
    [filename, submissionId]
  );

  const updated = await getSubmissionById(submissionId);
  if (!updated) {
    throw new NotFoundError('Submission not found');
  }

  return updated;
}

/**
 * Deletes a submission and its associated file
 *
 * @param id - Submission ID to delete
 *
 * @throws {NotFoundError} If submission with given ID doesn't exist
 */
export async function deleteSubmission(id: number): Promise<void> {
  const db = getDatabase();
  const submission = await getSubmissionById(id);

  if (!submission) {
    throw new NotFoundError('Submission not found');
  }

  await deleteSubmissionFile(submission.filename);

  await db.run('DELETE FROM submissions WHERE id = ?', [id]);
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
  } catch (err: any) {
    if (err.code !== 'ENOENT') {
      logger.error('Error deleting submission file', { filename, error: err });
    }
  }
}
