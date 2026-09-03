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

const getABoard = catchAsync(async (req, res) => {
  const result = await boardService.getABoard(req.params.id as string);

  res.status(200).json({
    success: true,
    message: 'Board retrieved successfully.',
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

const updateBoard = catchAsync(async (req, res) => {
  const result = await boardService.updateBoard(
    req.params.id as string,
    req.body,
    req.user.id,
  );

  res.status(200).json({
    success: true,
    message: 'Board updated successfully.',
    data: result,
  });
});

export const boardController = {
  createBoard,
  getABoard,
  getMyBoards,
  updateBoard,
};
