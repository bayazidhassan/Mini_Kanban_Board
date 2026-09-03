import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

const createTask = async (
  boardId: string,
  columnId: string,
  payload: {
    title: string;
    description?: string;
  },
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

  const column = await prisma.column.findFirst({
    where: {
      id: columnId,
      boardId,
    },
  });
  if (!column) {
    throw new AppError(404, 'Column not found.');
  }

  const lastTask = await prisma.task.findFirst({
    where: {
      columnId,
    },
    orderBy: {
      position: 'desc',
    },
  });
  const position = lastTask ? lastTask.position + 1 : 1;

  const result = await prisma.task.create({
    data: {
      title: payload.title,
      ...(payload.description !== undefined && {
        description: payload.description,
      }),
      position,
      columnId,
    },
  });

  return result;
};

export const taskService = {
  createTask,
};
