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

const getMyBoards = async (ownerId: string) => {
  const result = await prisma.board.findMany({
    where: {
      ownerId,
    },
  });

  return result;
};

export const boardService = {
  createBoard,
  getMyBoards,
};
