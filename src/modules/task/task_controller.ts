import catchAsync from '../../utils/catchAsync';
import { taskService } from './task_service';

const createTask = catchAsync(async (req, res) => {
  const result = await taskService.createTask(
    req.params.boardId as string,
    req.params.columnId as string,
    req.body,
    req.user.id,
  );

  res.status(201).json({
    success: true,
    message: 'Task created successfully.',
    data: result,
  });
});

export const taskController = {
  createTask,
};
