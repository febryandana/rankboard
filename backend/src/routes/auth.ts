import { Router } from 'express';
import * as authController from '../controllers/authController';
import { requireAuth } from '../middleware/auth';
import { validate, loginSchema } from '../middleware/validation';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', requireAuth, authController.logout);
router.get('/session', authController.getSession);

export default router;
