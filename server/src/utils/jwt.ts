import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { config } from '../config';

export interface TokenPayload extends JwtPayload {
  userId: string;
}

export const generateToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign({ userId }, config.jwtSecret, options);
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwtSecret) as TokenPayload;
};

export const generateRefreshToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: config.jwtRefreshTokenExpiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign({ userId }, config.jwtRefreshTokenSecret, options);
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, config.jwtRefreshTokenSecret) as TokenPayload;
};
