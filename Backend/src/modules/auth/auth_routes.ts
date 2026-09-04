import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import { authController } from './auth_controller';

const router = Router();

router.post('/login', authController.loginUser);
router.get('/session', authenticate, authController.getSession);

export const authRoutes = router;
