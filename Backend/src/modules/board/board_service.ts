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

const getABoard = async (id: string, userId: string) => {
  const result = await prisma.board.findFirst({
    where: {
      id,

      OR: [
        {
          ownerId: userId,
        },

        {
          members: {
            some: {
              userId,
            },
          },
        },
      ],
    },
  });

  if (!result) {
    throw new AppError(404, 'Board not found.');
  }

  return result;
};

const getMyBoards = async (userId: string) => {
  const result = await prisma.board.findMany({
    where: {
      OR: [
        {
          ownerId: userId,
        },

        {
          members: {
            some: {
              userId,
            },
          },
        },
      ],
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

const addMemberToBoard = async (
  boardId: string,
  ownerId: string,
  payload: { email: string },
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

  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!existingUser) {
    throw new AppError(404, 'User not found.');
  }

  if (existingBoard.ownerId === existingUser.id) {
    throw new AppError(
      400,
      'Owner is already the board owner — no need to add as a member.',
    );
  }

  const existingMember = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId,
        userId: existingUser.id,
      },
    },
  });
  if (existingMember) {
    throw new AppError(409, 'Already a member.');
  }

  const result = await prisma.boardMember.create({
    data: {
      boardId,
      userId: existingUser.id,
    },
  });
  return result;
};

const removeMemberFromBoard = async (
  boardId: string,
  ownerId: string,
  payload: { email: string },
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

  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (!existingUser) {
    throw new AppError(404, 'User not found.');
  }

  const existingMember = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: {
        boardId,
        userId: existingUser.id,
      },
    },
  });
  if (!existingMember) {
    throw new AppError(404, 'Not a board member.');
  }

  const result = await prisma.boardMember.delete({
    where: {
      boardId_userId: {
        boardId,
        userId: existingUser.id,
      },
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
  addMemberToBoard,
  removeMemberFromBoard,
};
