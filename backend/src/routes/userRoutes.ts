// backend/src/routes/userRoutes.ts
import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validate } from '../middleware/validator';
import { updateProfileSchema, changePasswordSchema } from '../utils/validation';

const router = Router();
const userController = new UserController();

router.use(authMiddleware);

router.get('/profile', userController.getProfile);
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);
router.put('/password', validate(changePasswordSchema), userController.changePassword);
router.get('/statistics', userController.getStatistics);

export default router;
