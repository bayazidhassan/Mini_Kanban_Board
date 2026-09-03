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

const getTasks = catchAsync(async (req, res) => {
  const result = await taskService.getTasks(
    req.params.boardId as string,
    req.params.columnId as string,
    req.user.id,
  );

  res.status(200).json({
    success: true,
    message: 'Tasks retrieved successfully.',
    data: result,
  });
});

const getATask = catchAsync(async (req, res) => {
  const result = await taskService.getATask(
    req.params.boardId as string,
    req.params.columnId as string,
    req.params.id as string,
    req.user.id,
  );

  res.status(200).json({
    success: true,
    message: 'Task retrieved successfully.',
    data: result,
  });
});

export const taskController = {
  createTask,
  getTasks,
  getATask,
};
