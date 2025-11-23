import { Router } from 'express';
import * as submissionController from '../controllers/submissionController';
import { requireAuth } from '../middleware/auth';
import { submissionUpload } from '../middleware/upload';

const router = Router();

router.get(
  '/challenges/:challengeId/submissions',
  requireAuth,
  submissionController.getByChallengeId
);

router.post(
  '/challenges/:challengeId/submissions',
  requireAuth,
  submissionUpload.single('submission'),
  submissionController.create
);

router.put(
  '/challenges/:challengeId/submissions',
  requireAuth,
  submissionUpload.single('submission'),
  submissionController.update
);

router.get('/submissions/:id/download', requireAuth, submissionController.download);

export default router;
