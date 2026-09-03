import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

const createColumn = async (
  boardId: string,
  payload: { name: string },
  userId: string,
) => {
  const board = await prisma.board.findUnique({
    where: {
      id: boardId,
    },
    include: {
      members: {
        where: {
          userId,
        },
      },
    },
  });
  if (!board) {
    throw new AppError(404, 'Board not found.');
  }

  const hasAccess = board.ownerId === userId || board.members.length > 0;
  if (!hasAccess) {
    throw new AppError(403, 'Unauthorized.');
  }

  const lastColumn = await prisma.column.findFirst({
    where: {
      boardId,
    },
    orderBy: {
      position: 'desc',
    },
  });
  const position = lastColumn ? lastColumn.position + 1 : 1;

  const result = await prisma.column.create({
    data: {
      name: payload.name,
      position,
      boardId,
    },
  });

  return result;
};

const getColumns = async (boardId: string, userId: string) => {
  const board = await prisma.board.findUnique({
    where: {
      id: boardId,
    },
    include: {
      members: {
        where: {
          userId,
        },
      },
    },
  });
  if (!board) {
    throw new AppError(404, 'Board not found.');
  }

  const hasAccess = board.ownerId === userId || board.members.length > 0;
  if (!hasAccess) {
    throw new AppError(403, 'Unauthorized.');
  }

  const result = await prisma.column.findMany({
    where: {
      boardId,
    },
    orderBy: {
      position: 'asc',
    },
  });

  return result;
};

const getColumn = async (boardId: string, columnId: string, userId: string) => {
  const board = await prisma.board.findUnique({
    where: {
      id: boardId,
    },
    include: {
      members: {
        where: {
          userId,
        },
      },
    },
  });
  if (!board) {
    throw new AppError(404, 'Board not found.');
  }

  const hasAccess = board.ownerId === userId || board.members.length > 0;
  if (!hasAccess) {
    throw new AppError(403, 'Unauthorized.');
  }

  const result = await prisma.column.findFirst({
    where: {
      id: columnId,
      boardId,
    },
  });
  if (!result) {
    throw new AppError(404, 'Column not found.');
  }

  return result;
};

export const columnService = {
  createColumn,
  getColumns,
  getColumn,
};
