import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import { columnController } from './column_controller';

const router = Router();

router.post('/:boardId/columns', authenticate, columnController.createColumn);

export const columnRoutes = router;
