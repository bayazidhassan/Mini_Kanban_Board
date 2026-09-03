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

const getTasks = async (boardId: string, columnId: string, userId: string) => {
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

  const result = await prisma.task.findMany({
    where: {
      columnId,
    },
    orderBy: {
      position: 'asc',
    },
  });

  return result;
};

const getATask = async (
  boardId: string,
  columnId: string,
  taskId: string,
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

  const result = await prisma.task.findFirst({
    where: {
      id: taskId,
      columnId,
    },
  });
  if (!result) {
    throw new AppError(404, 'Task not found.');
  }

  return result;
};

const updateTask = async (
  boardId: string,
  columnId: string,
  taskId: string,
  payload: {
    title?: string;
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

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      columnId,
    },
  });
  if (!task) {
    throw new AppError(404, 'Task not found.');
  }

  const result = await prisma.task.update({
    where: {
      id: taskId,
    },
    data: {
      ...(payload.title !== undefined && {
        title: payload.title,
      }),
      ...(payload.description !== undefined && {
        description: payload.description,
      }),
    },
  });

  return result;
};

const deleteTask = async (
  boardId: string,
  columnId: string,
  taskId: string,
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

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      columnId,
    },
  });
  if (!task) {
    throw new AppError(404, 'Task not found.');
  }

  await prisma.task.delete({
    where: {
      id: taskId,
    },
  });
};

export const taskService = {
  createTask,
  getTasks,
  getATask,
  updateTask,
  deleteTask,
};
