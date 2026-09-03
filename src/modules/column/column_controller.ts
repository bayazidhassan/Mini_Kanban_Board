import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { columnService } from './column_service';

const createColumn = catchAsync(async (req: Request, res: Response) => {
  const result = await columnService.createColumn(
    req.params.boardId as string,
    req.body,
    req.user.id,
  );

  res.status(201).json({
    success: true,
    message: 'Column created successfully.',
    data: result,
  });
});

const getColumns = catchAsync(async (req: Request, res: Response) => {
  const result = await columnService.getColumns(
    req.params.boardId as string,
    req.user.id,
  );

  res.status(200).json({
    success: true,
    message: 'Columns retrieved successfully.',
    data: result,
  });
});

const getColumn = catchAsync(async (req: Request, res: Response) => {
  const result = await columnService.getColumn(
    req.params.boardId as string,
    req.params.id as string,
    req.user.id,
  );

  res.status(200).json({
    success: true,
    message: 'Column retrieved successfully.',
    data: result,
  });
});

const updateColumn = catchAsync(async (req: Request, res: Response) => {
  const result = await columnService.updateColumn(
    req.params.boardId as string,
    req.params.id as string,
    req.body,
    req.user.id,
  );

  res.status(200).json({
    success: true,
    message: 'Column updated successfully.',
    data: result,
  });
});

export const columnController = {
  createColumn,
  getColumns,
  getColumn,
  updateColumn,
};
