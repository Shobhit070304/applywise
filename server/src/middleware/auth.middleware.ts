import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { User, IUser } from '../models/user.model';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies?.access_token;

    if (!token) {
      res.status(401).json({ error: 'Unauthorized', message: 'No authorization token provided' });
      return;
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ error: 'Unauthorized', message: 'User no longer exists' });
      return;
    }

    (req as AuthRequest).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
  }
};

export const requireRole = (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthRequest).user;
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ error: 'Forbidden', message: 'You do not have permission to access this resource' });
      return;
    }
    next();
  };
