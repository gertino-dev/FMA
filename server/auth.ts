import type { Request, Response, NextFunction } from 'express';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if ((req.session as any)?.admin === true) return next();
  return res.status(401).json({ error: 'unauthorized' });
}

