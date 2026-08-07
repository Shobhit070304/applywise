import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[Error]', err.stack || err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.env === 'development' ? err.message : undefined,
  });
};
