import jwt, { SignOptions } from 'jsonwebtoken';

export interface JwtPayload {
  userId: string;
  name: string;
  email: string;
}

export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN as string, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as SignOptions['expiresIn'],
  });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, process.env.ACCESS_TOKEN as string) as JwtPayload;
};
