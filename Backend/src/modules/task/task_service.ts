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

const moveTask = async (
  boardId: string,
  taskId: string,
  payload: {
    targetColumnId: string;
    targetPosition: number;
  },
  userId: string,
) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      column: {
        include: {
          board: {
            include: {
              members: {
                where: {
                  userId,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!task) {
    throw new AppError(404, 'Task not found.');
  }

  if (task.column.boardId !== boardId) {
    throw new AppError(404, 'Task not found.');
  }

  const board = task.column.board;

  const hasAccess = board.ownerId === userId || board.members.length > 0;
  if (!hasAccess) {
    throw new AppError(403, 'Unauthorized.');
  }

  if (!Number.isInteger(payload.targetPosition) || payload.targetPosition < 1) {
    throw new AppError(400, 'Target position must be a positive integer.');
  }

  const sourceColumnId = task.columnId;
  const sourcePosition = task.position;
  const targetColumnId = payload.targetColumnId;

  const targetColumn = await prisma.column.findFirst({
    where: {
      id: targetColumnId,
      boardId,
    },
  });
  if (!targetColumn) {
    throw new AppError(404, 'Target column not found.');
  }

  if (
    sourceColumnId === targetColumnId &&
    sourcePosition === payload.targetPosition
  ) {
    return task;
  }

  const targetTaskCount = await prisma.task.count({
    where: {
      columnId: targetColumnId,
    },
  });

  const maxTargetPosition =
    sourceColumnId === targetColumnId ? targetTaskCount : targetTaskCount + 1;

  if (payload.targetPosition > maxTargetPosition) {
    throw new AppError(
      400,
      `Target position must be between 1 and ${maxTargetPosition}.`,
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    if (sourceColumnId === targetColumnId) {
      if (sourcePosition < payload.targetPosition) {
        await tx.task.updateMany({
          where: {
            columnId: sourceColumnId,
            position: {
              gt: sourcePosition,
              lte: payload.targetPosition,
            },
          },
          data: {
            position: {
              decrement: 1,
            },
          },
        });
      } else {
        await tx.task.updateMany({
          where: {
            columnId: sourceColumnId,
            position: {
              gte: payload.targetPosition,
              lt: sourcePosition,
            },
          },
          data: {
            position: {
              increment: 1,
            },
          },
        });
      }

      return tx.task.update({
        where: {
          id: taskId,
        },
        data: {
          position: payload.targetPosition,
        },
      });
    }

    await tx.task.updateMany({
      where: {
        columnId: sourceColumnId,
        position: {
          gt: sourcePosition,
        },
      },
      data: {
        position: {
          decrement: 1,
        },
      },
    });

    await tx.task.updateMany({
      where: {
        columnId: targetColumnId,
        position: {
          gte: payload.targetPosition,
        },
      },
      data: {
        position: {
          increment: 1,
        },
      },
    });

    return tx.task.update({
      where: {
        id: taskId,
      },
      data: {
        columnId: targetColumnId,
        position: payload.targetPosition,
      },
    });
  });

  return result;
};

export const taskService = {
  createTask,
  getTasks,
  getATask,
  updateTask,
  deleteTask,
  moveTask,
};
