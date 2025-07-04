import { verifyToken } from '../lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';

export function withAuth(handler: Function, requiredRole?: string) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    try {
      const user = verifyToken(token) as any;
      if (requiredRole && user.role !== requiredRole)
        return res.status(403).json({ message: 'Forbidden' });

      (req as any).user = user;
      return handler(req, res);
    } catch {
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
}
