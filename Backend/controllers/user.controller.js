import User from '../models/user.model.js';
import { errorHandler } from '../errors/error.js';

const isNonEmptyString = (v) => typeof v === 'string' && v.trim().length > 0;

const isValidHttpUrl = (value) => {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(errorHandler(401, 'Unauthorized'));

    const user = await User.findById(userId).select('-password');
    if (!user) return next(errorHandler(404, 'User not found'));

    return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) return next(errorHandler(401, 'Unauthorized'));

    const allowed = ['firstName', 'lastName', 'age', 'gender', 'location', 'bio', 'avatar'];
    const updates = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(req.body || {}, key)) {
        updates[key] = req.body[key];
      }
    }

    // Input validation (return friendly 400s)
    if (Object.prototype.hasOwnProperty.call(updates, 'firstName')) {
      if (!isNonEmptyString(updates.firstName) || updates.firstName.trim().length > 50) {
        return next(errorHandler(400, 'First name must be a non-empty string (max 50 chars)'));
      }
      updates.firstName = updates.firstName.trim();
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'lastName')) {
      if (!isNonEmptyString(updates.lastName) || updates.lastName.trim().length > 50) {
        return next(errorHandler(400, 'Last name must be a non-empty string (max 50 chars)'));
      }
      updates.lastName = updates.lastName.trim();
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'age')) {
      const ageNum = Number(updates.age);
      if (!Number.isFinite(ageNum) || !Number.isInteger(ageNum)) {
        return next(errorHandler(400, 'Age must be an integer'));
      }
      if (ageNum < 0 || ageNum > 120) {
        return next(errorHandler(400, 'Age must be between 0 and 120'));
      }
      updates.age = ageNum;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'gender')) {
      const g = updates.gender;
      const allowedGender = ['male', 'female', 'other'];
      if (typeof g !== 'string' || !allowedGender.includes(g)) {
        return next(errorHandler(400, `Gender must be one of: ${allowedGender.join(', ')}`));
      }
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'location')) {
      if (!isNonEmptyString(updates.location) || updates.location.trim().length > 100) {
        return next(errorHandler(400, 'Location must be a non-empty string (max 100 chars)'));
      }
      updates.location = updates.location.trim();
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'bio')) {
      if (typeof updates.bio !== 'string') {
        return next(errorHandler(400, 'Bio must be a string'));
      }
      const trimmed = updates.bio.trim();
      if (trimmed.length > 500) {
        return next(errorHandler(400, 'Bio must be at most 500 characters'));
      }
      updates.bio = trimmed;
    }

    if (Object.prototype.hasOwnProperty.call(updates, 'avatar')) {
      if (!isValidHttpUrl(updates.avatar)) {
        return next(errorHandler(400, 'Avatar must be a valid http/https URL'));
      }
    }

    const updated = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updated) return next(errorHandler(404, 'User not found'));
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
};

