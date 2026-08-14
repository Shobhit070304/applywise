import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('[Error]', err.stack || err.message || err);

  // Mongoose Invalid ObjectId Cast Error (e.g. invalid job ID format)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    res.status(400).json({
      error: 'Bad Request',
      message: `Invalid ID format: ${err.value}`,
    });
    return;
  }

  // Mongoose Schema Validation Error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    res.status(400).json({
      error: 'Validation Error',
      message: messages.join(', '),
    });
    return;
  }

  // MongoDB Duplicate Key Error (e.g. duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    res.status(409).json({
      error: 'Conflict',
      message: `A record with this ${field} already exists.`,
    });
    return;
  }

  // Default Internal Server Error
  res.status(500).json({
    error: 'Internal Server Error',
    message: config.env === 'development' ? err.message : 'An unexpected error occurred.',
  });
};
