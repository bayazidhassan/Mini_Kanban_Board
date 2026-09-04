import { NextFunction, Request, Response } from 'express';

import AppError from '../errors/AppError';
import { prisma } from '../lib/prisma';
import catchAsync from '../utils/catchAsync';
import { verifyAccessToken } from '../utils/jwt';

const authenticate = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new AppError(401, 'Unauthorized');
    }

    const token = authorization.split(' ')[1];

    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });

    if (!user) {
      throw new AppError(401, 'User not found.');
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    next();
  },
);

export default authenticate;
