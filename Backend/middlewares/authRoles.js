import { errorHandler } from '../errors/error.js';

export const authRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return next(errorHandler(403, 'You do not have permission to access this resource'));
  }
  next();
};

