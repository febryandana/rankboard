import { getDatabase } from '../config/database';
import { Score, LeaderboardEntry } from '../types';
import { NotFoundError } from '../middleware/errorHandler';

/**
 * Creates a new score or updates an existing score for a submission
 * Each admin can only score a submission once; updates replace the existing score
 *
 * @param submissionId - Submission ID being scored
 * @param adminId - Admin ID creating/updating the score
 * @param score - Numerical score value
 * @param feedback - Optional feedback text
 *
 * @returns Promise resolving to the created or updated score
 *
 * @throws {Error} If score creation or update fails
 */
export async function createOrUpdateScore(
  submissionId: number,
  adminId: number,
  score: number,
  feedback: string | null
): Promise<Score> {
  const db = getDatabase();

  const existing = await db.get<Score>(
    'SELECT * FROM scores WHERE submission_id = ? AND admin_id = ?',
    [submissionId, adminId]
  );

  if (existing) {
    await db.run(
      `UPDATE scores 
       SET score = ?, feedback = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE submission_id = ? AND admin_id = ?`,
      [score, feedback, submissionId, adminId]
    );

    const updatedScore = await db.get<Score>(
      'SELECT * FROM scores WHERE submission_id = ? AND admin_id = ?',
      [submissionId, adminId]
    );

    if (!updatedScore) {
      throw new Error('Failed to update score');
    }

    return updatedScore;
  } else {
    const result = await db.run(
      `INSERT INTO scores (submission_id, admin_id, score, feedback)
       VALUES (?, ?, ?, ?)`,
      [submissionId, adminId, score, feedback]
    );

    const newScore = await db.get<Score>('SELECT * FROM scores WHERE id = ?', [result.lastID]);

    if (!newScore) {
      throw new Error('Failed to create score');
    }

    return newScore;
  }
}

/**
 * Retrieves all scores for a submission with admin information
 *
 * @param submissionId - Submission ID
 * @returns Promise resolving to array of scores with admin usernames
 */
export async function getScoresBySubmission(submissionId: number): Promise<any[]> {
  const db = getDatabase();
  const scores = await db.all<any[]>(
    `SELECT 
      s.*,
      u.username as admin_username
     FROM scores s
     JOIN users u ON s.admin_id = u.id
     WHERE s.submission_id = ?
     ORDER BY s.created_at ASC`,
    [submissionId]
  );
  return scores;
}

/**
 * Generates a leaderboard for a challenge
 * Uses optimized JOIN query to prevent N+1 problem
 * Includes all users (even those without submissions) and calculates total scores
 *
 * @param challengeId - Challenge ID
 * @returns Promise resolving to ranked leaderboard entries
 */
export async function getLeaderboard(challengeId: number): Promise<LeaderboardEntry[]> {
  const db = getDatabase();

  // Optimized query using JOINs to eliminate N+1 problem
  const query = `
    SELECT
      u.id as user_id,
      u.username,
      u.avatar_filename,
      sub.id as submission_id,
      sub.filename,
      sub.submitted_at,
      sc.id as score_id,
      sc.admin_id,
      sc.score,
      sc.feedback,
      admin.username as admin_username
    FROM users u
    LEFT JOIN submissions sub ON u.id = sub.user_id AND sub.challenge_id = ?
    LEFT JOIN scores sc ON sub.id = sc.submission_id
    LEFT JOIN users admin ON sc.admin_id = admin.id
    WHERE u.role = 'user'
    ORDER BY u.username ASC, sc.created_at ASC
  `;

  const rows = await db.all<any[]>(query, [challengeId]);

  // Group results by user
  const userMap = new Map<number, LeaderboardEntry>();

  for (const row of rows) {
    if (!userMap.has(row.user_id)) {
      userMap.set(row.user_id, {
        rank: 0,
        user_id: row.user_id,
        username: row.username,
        avatar_filename: row.avatar_filename,
        submission_id: row.submission_id,
        scores: [],
        total_score: 0,
      });
    }

    const entry = userMap.get(row.user_id)!;

    // Add score if exists and not already added
    if (row.score_id && !entry.scores.find((s) => s.admin_id === row.admin_id)) {
      entry.scores.push({
        admin_id: row.admin_id,
        admin_username: row.admin_username,
        score: row.score,
        feedback: row.feedback,
      });
      entry.total_score += row.score;
    }
  }

  // Convert map to array and sort by total score
  const leaderboard = Array.from(userMap.values());
  leaderboard.sort((a, b) => b.total_score - a.total_score);

  // Assign ranks
  leaderboard.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return leaderboard;
}

/**
 * Retrieves scores for a user's submission
 * Verifies the submission belongs to the requesting user
 *
 * @param submissionId - Submission ID
 * @param userId - User ID requesting their scores
 *
 * @returns Promise resolving to submission scores and total
 *
 * @throws {NotFoundError} If submission not found or doesn't belong to user
 */
export async function getUserScores(submissionId: number, userId: number): Promise<any> {
  const db = getDatabase();

  const submission = await db.get<any>('SELECT * FROM submissions WHERE id = ? AND user_id = ?', [
    submissionId,
    userId,
  ]);

  if (!submission) {
    throw new NotFoundError('Submission not found or does not belong to you');
  }

  const scores = await getScoresBySubmission(submissionId);

  const result = {
    submission_id: submissionId,
    scores: scores.map((s) => ({
      admin_id: s.admin_id,
      admin_username: s.admin_username,
      score: s.score,
      feedback: s.feedback,
    })),
    total_score: scores.reduce((sum, s) => sum + s.score, 0),
  };

  return result;
}
