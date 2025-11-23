import { Router } from 'express';
import * as challengeController from '../controllers/challengeController';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { validate, createChallengeSchema, updateChallengeSchema } from '../middleware/validation';

const router = Router();

router.get('/', requireAuth, challengeController.getAll);

router.post('/', requireAdmin, validate(createChallengeSchema), challengeController.create);

router.get('/:id', requireAuth, challengeController.getById);

router.put('/:id', requireAdmin, validate(updateChallengeSchema), challengeController.update);

router.delete('/:id', requireAdmin, challengeController.deleteChallenge);

export default router;
