import { Router } from 'express';
import * as userController from '../controllers/userController';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { validate, createUserSchema, updateUserSchema } from '../middleware/validation';
import { avatarUpload } from '../middleware/upload';

const router = Router();

router.get('/', requireAdmin, userController.getAll);
router.post('/', requireAdmin, validate(createUserSchema), userController.create);
router.get('/:id', requireAuth, userController.getById);
router.put('/:id', requireAuth, validate(updateUserSchema), userController.update);
router.delete('/:id', requireAdmin, userController.deleteUser);

router.post('/:id/avatar', requireAuth, avatarUpload.single('avatar'), userController.uploadAvatar);

router.delete('/:id/avatar', requireAuth, userController.deleteAvatar);

export default router;
