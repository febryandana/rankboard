import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import * as submissionService from '../services/submissionService';
import { ForbiddenError, NotFoundError } from '../middleware/errorHandler';
import path from 'path';
import fs from 'fs';

export async function getByChallengeId(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const challengeId = parseInt(req.params.challengeId, 10);

    if (authReq.session.role === 'admin') {
      const submissions = await submissionService.getSubmissionsByChallenge(challengeId);
      res.json({
        success: true,
        data: submissions,
      });
    } else {
      const submission = await submissionService.getSubmissionByChallengeAndUser(
        challengeId,
        authReq.session.userId!
      );
      res.json({
        success: true,
        data: submission ? [submission] : [],
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const challengeId = parseInt(req.params.challengeId, 10);

    if (authReq.session.role !== 'user') {
      throw new ForbiddenError('Only users can submit to challenges');
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
      return;
    }

    const submission = await submissionService.createSubmission(
      challengeId,
      authReq.session.userId!,
      req.file.filename
    );

    res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const challengeId = parseInt(req.params.challengeId, 10);

    if (authReq.session.role !== 'user') {
      throw new ForbiddenError('Only users can update submissions');
    }

    if (!req.file) {
      res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
      return;
    }

    const submission = await submissionService.createSubmission(
      challengeId,
      authReq.session.userId!,
      req.file.filename
    );

    res.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    next(error);
  }
}

export async function download(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authReq = req as AuthRequest;
    const submissionId = parseInt(req.params.id, 10);

    const submission = await submissionService.getSubmissionById(submissionId);

    if (!submission) {
      throw new NotFoundError('Submission not found');
    }

    if (authReq.session.role !== 'admin' && submission.user_id !== authReq.session.userId) {
      throw new ForbiddenError('You can only download your own submissions');
    }

    const filePath = path.resolve(__dirname, '../../uploads/submissions', submission.filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundError('File not found');
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${submission.filename}"`);

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
}
