import User from '../models/user.model.js';
import { errorHandler } from '../errors/error.js';

// GET /api/admin/users
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.search) {
      const re = new RegExp(req.query.search, 'i');
      query.$or = [{ firstName: re }, { lastName: re }, { email: re }];
    }

    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).select('-password'),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/users/:id/role
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return next(errorHandler(400, 'Role must be "user" or "admin"'));
    }

    // Prevent admin from demoting themselves
    if (req.params.id === req.user.id && role !== 'admin') {
      return next(errorHandler(403, 'You cannot change your own admin role'));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) return next(errorHandler(404, 'User not found'));
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/admin/users/:id/status
export const updateUserStatus = async (req, res, next) => {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return next(errorHandler(400, 'isActive must be a boolean'));
    }

    if (req.params.id === req.user.id) {
      return next(errorHandler(403, 'You cannot deactivate yourself'));
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) return next(errorHandler(404, 'User not found'));
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return next(errorHandler(403, 'You cannot delete yourself'));
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(errorHandler(404, 'User not found'));
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
  }
};
