import jwt from 'jsonwebtoken';
import { errorHandler } from '../errors/error.js';

// export const verifyToken = (req, res, next) => {
//   const authHeader = req.headers?.authorization;
//   let token = null;

//   if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
//     token = authHeader.slice(7);
//   }

//   if (!token && req.cookies?.access_token) {
//     token = req.cookies.access_token;
//   }

//   if (!token) return next(errorHandler(401, 'Unauthorized'));

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return next(errorHandler(403, 'Forbidden'));

//     req.user = user;
//     next();
//   });
// };


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

