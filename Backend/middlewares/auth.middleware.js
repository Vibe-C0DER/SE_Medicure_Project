import jwt from 'jsonwebtoken';
import { errorHandler } from '../errors/error.js';




export const verifyToken = (req, res, next) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return next(errorHandler(401, "Unauthorized - No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return next(errorHandler(403, "Forbidden - Invalid or expired token"));
  }
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return next(errorHandler(403, 'Forbidden - Admins only'));
    }
  });
};


