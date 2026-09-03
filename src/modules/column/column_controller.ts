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

export const columnController = {
  createColumn,
};
