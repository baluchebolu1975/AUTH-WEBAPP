import { verifyAccessToken } from '../utils/jwt.js';
import { error } from '../utils/response.js';

export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    return error(res, 'No token provided', 401);

  try {
    req.user = verifyAccessToken(authHeader.split(' ')[1]);
    next();
  } catch {
    return error(res, 'Invalid or expired token', 401);
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return error(res, 'Admin access required', 403);
  next();
};
