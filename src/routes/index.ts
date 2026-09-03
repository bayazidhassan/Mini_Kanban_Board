import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth_routes';
import { boardRoutes } from '../modules/board/board_routes';
import { userRoutes } from '../modules/user/user_routes';

const router = Router();

router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/board', boardRoutes);

export default router;
