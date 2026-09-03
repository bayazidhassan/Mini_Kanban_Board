import catchAsync from '../../utils/catchAsync';
import { boardService } from './board_service';

const createBoard = catchAsync(async (req, res) => {
  const result = await boardService.createBoard(req.body, req.user.id);

  res.status(201).json({
    success: true,
    message: 'Board created successfully.',
    data: result,
  });
});

const getMyBoards = catchAsync(async (req, res) => {
  const result = await boardService.getMyBoards(req.user.id);

  res.status(200).json({
    success: true,
    message: 'Boards retrieved successfully.',
    data: result,
  });
});

export const boardController = {
  createBoard,
  getMyBoards,
};
