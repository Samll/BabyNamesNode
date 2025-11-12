import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config';
import { getParentRepository } from '../repositories';

export interface AuthenticatedRequest extends Request {
  parentId?: string;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: 'Authorization header missing' });
    return;
  }

  const [, token] = authHeader.split(' ');
  if (!token) {
    res.status(401).json({ message: 'Token missing' });
    return;
  }

  void (async () => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { parentId: string };
      const parentRepository = getParentRepository();
      const parent = await parentRepository.findById(decoded.parentId);
      if (!parent) {
        res.status(401).json({ message: 'Parent not found' });
        return;
      }
      req.parentId = parent.id;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  })();
}
