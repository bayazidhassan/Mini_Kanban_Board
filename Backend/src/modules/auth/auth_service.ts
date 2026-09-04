import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { comparePassword } from '../../utils/hashPassword';
import { generateAccessToken } from '../../utils/jwt';

const loginUser = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user || !(await comparePassword(payload.password, user.passwordHash))) {
    throw new AppError(401, 'Invalid credentials.');
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    name: user.name,
    email: user.email,
  });

  return {
    accessToken,
  };
};

export const authService = {
  loginUser,
};
