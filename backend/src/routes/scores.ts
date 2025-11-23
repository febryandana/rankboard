import { Router } from 'express';
import * as scoreController from '../controllers/scoreController';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { validate, createScoreSchema } from '../middleware/validation';

const router = Router();

router.get('/challenges/:challengeId/scores', requireAuth, scoreController.getByChallengeId);

router.post(
  '/submissions/:submissionId/scores',
  requireAdmin,
  validate(createScoreSchema),
  scoreController.createOrUpdate
);

router.get('/submissions/:submissionId/scores/me', requireAuth, scoreController.getMyScores);

export default router;
