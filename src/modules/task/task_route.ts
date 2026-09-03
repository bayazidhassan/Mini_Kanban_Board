import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import { taskController } from './task_controller';

const router = Router();

router.post(
  '/:boardId/columns/:columnId/tasks',
  authenticate,
  taskController.createTask,
);

export const taskRoutes = router;
