import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

const createBoard = async (
  payload: { name: string; description?: string },
  ownerId: string,
) => {
  const result = await prisma.board.create({
    data: {
      name: payload.name,
      description: payload.description,
      ownerId,
    },
  });

  return result;
};

const getABoard = async (id: string) => {
  const result = await prisma.board.findUnique({
    where: {
      id,
    },
  });

  if (!result) {
    throw new AppError(404, 'Board not found.');
  }

  return result;
};

const getMyBoards = async (ownerId: string) => {
  const result = await prisma.board.findMany({
    where: {
      ownerId,
    },
  });

  if (!result.length) {
    throw new AppError(404, 'Boards not found.');
  }

  return result;
};

const updateBoard = async (
  boardId: string,
  payload: { name: string; description?: string },
  ownerId: string,
) => {
  const existingBoard = await prisma.board.findUnique({
    where: {
      id: boardId,
    },
  });
  if (!existingBoard) {
    throw new AppError(404, 'Board not found.');
  }
  if (existingBoard.ownerId !== ownerId) {
    throw new AppError(403, 'Unauthorized.');
  }

  const result = await prisma.board.update({
    where: {
      id: boardId,
    },
    data: {
      name: payload.name,
      description: payload.description,
    },
  });

  return result;
};

const deleteBoard = async (boardId: string, ownerId: string) => {
  const existingBoard = await prisma.board.findUnique({
    where: {
      id: boardId,
    },
  });
  if (!existingBoard) {
    throw new AppError(404, 'Board not found.');
  }
  if (existingBoard.ownerId !== ownerId) {
    throw new AppError(403, 'Unauthorized.');
  }

  const result = await prisma.board.delete({
    where: {
      id: boardId,
    },
  });

  return result;
};

export const boardService = {
  createBoard,
  getABoard,
  getMyBoards,
  updateBoard,
  deleteBoard,
};
