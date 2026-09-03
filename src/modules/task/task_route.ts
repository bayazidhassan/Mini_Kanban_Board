import { Router } from 'express';
import authenticate from '../../middlewares/authenticate';
import { taskController } from './task_controller';

const router = Router();

router.post(
  '/:boardId/columns/:columnId/tasks',
  authenticate,
  taskController.createTask,
);
router.get(
  '/:boardId/columns/:columnId/tasks',
  authenticate,
  taskController.getTasks,
);
router.get(
  '/:boardId/columns/:columnId/tasks/:id',
  authenticate,
  taskController.getATask,
);
router.patch(
  '/:boardId/columns/:columnId/tasks/:id',
  authenticate,
  taskController.updateTask,
);
router.delete(
  '/:boardId/columns/:columnId/tasks/:id',
  authenticate,
  taskController.deleteTask,
);

export const taskRoutes = router;
