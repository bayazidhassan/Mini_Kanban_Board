import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import { columnController } from './column_controller';

const router = Router();

router.post('/:boardId/columns', authenticate, columnController.createColumn);
router.get('/:boardId/columns', authenticate, columnController.getColumns);
router.get('/:boardId/columns/:id', authenticate, columnController.getColumn);
router.patch(
  '/:boardId/columns/:id',
  authenticate,
  columnController.updateColumn,
);

export const columnRoutes = router;
