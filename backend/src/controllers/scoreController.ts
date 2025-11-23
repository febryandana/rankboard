import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as scoreService from '../services/scoreService';

export async function getByChallengeId(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const challengeId = parseInt(req.params.challengeId, 10);
    const leaderboard = await scoreService.getLeaderboard(challengeId);

    res.json({
      success: true,
      data: {
        leaderboard,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function createOrUpdate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const submissionId = parseInt(req.params.submissionId, 10);
    const { score, feedback } = req.body;

    const scoreRecord = await scoreService.createOrUpdateScore(
      submissionId,
      authReq.session.userId!,
      score,
      feedback || null
    );

    res.json({
      success: true,
      data: scoreRecord,
    });
  } catch (error) {
    next(error);
  }
}

export async function getMyScores(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const submissionId = parseInt(req.params.submissionId, 10);

    const result = await scoreService.getUserScores(submissionId, authReq.session.userId!);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}
