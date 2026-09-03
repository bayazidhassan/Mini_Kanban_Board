import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth_routes';
import { boardRoutes } from '../modules/board/board_routes';
import { columnRoutes } from '../modules/column/column_routes';
import { userRoutes } from '../modules/user/user_routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/boards', boardRoutes);
router.use('/boards', columnRoutes);

export default router;
