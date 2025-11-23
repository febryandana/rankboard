import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as challengeService from '../services/challengeService';
import { NotFoundError } from '../middleware/errorHandler';

export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const challenges = await challengeService.getAllChallenges();

    res.json({
      success: true,
      data: challenges,
    });
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const challengeId = parseInt(req.params.id, 10);
    const challenge = await challengeService.getChallengeById(challengeId);

    if (!challenge) {
      throw new NotFoundError('Challenge not found');
    }

    res.json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const { title, description, created_at, deadline } = req.body;

    const challenge = await challengeService.createChallenge({
      title,
      description,
      created_at,
      deadline,
      created_by_admin_id: authReq.session.userId!,
    });

    res.status(201).json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const challengeId = parseInt(req.params.id, 10);
    const { title, description, created_at, deadline } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (created_at !== undefined) updateData.created_at = created_at;
    if (deadline !== undefined) updateData.deadline = deadline;

    const challenge = await challengeService.updateChallenge(challengeId, updateData);

    res.json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteChallenge(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const challengeId = parseInt(req.params.id, 10);

    await challengeService.deleteChallenge(challengeId);

    res.json({
      success: true,
      message: 'Challenge deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}
