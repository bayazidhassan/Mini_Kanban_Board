import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { hashPassword } from '../../utils/hashPassword';

const registerUser = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
  });
  if (existingUser) {
    throw new AppError(409, 'User already exists.');
  }

  const hashedPassword = await hashPassword(payload.password);

  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      passwordHash: hashedPassword,
    },
  });

  const { passwordHash, ...result } = user;
  return result;
};

export const userService = {
  registerUser,
};
