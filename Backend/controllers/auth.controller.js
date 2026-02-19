import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../errors/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body || {};
    if (!email || !password || !firstName || !lastName) {
      return next(errorHandler(400, 'First name, last name, email and password are required'));
    }
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ firstName, lastName, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json('User created successfully!');
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return next(errorHandler(400, 'Email and password are required'));
    }
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(401, 'Invalid email or password'));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, 'Invalid email or password'));
    const token = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET
    );
    const userObj = validUser.toObject ? validUser.toObject() : validUser._doc || {};
    const { password: _p, ...rest } = userObj;
    res
      .cookie('access_token', token, { httpOnly: true, sameSite: 'lax', secure: false })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};

